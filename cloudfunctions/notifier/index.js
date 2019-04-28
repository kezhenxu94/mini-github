const axios = require('axios')
const moment = require('moment')
const cloud = require('wx-server-sdk')
cloud.init()

axios.defaults.validateStatus = () => true

// const env = 'github-development'
const env = 'github-production'
const db = cloud.database({
  env
})
const usersC = db.collection('users')
const notifC = db.collection('notifications')
const subC = db.collection('subscriptions')

const getAccessToken = async() => {
  const {
    data: {
      access_token
    }
  } = await axios({
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    params: {
      grant_type: 'client_credential',
      appid: 'wx5d7793555064ce62',
      secret: 'd7f1aaaafd37a5dd07a523e554109b4a'
    }
  })
  return access_token
}

const handlerError = (error, reject) => (error => {
  console.error(error)
  return reject(error)
})

exports.main = async (event, context) => {
  const accessToken = await getAccessToken()
  console.info({
    accessToken
  })

  const {
    data
  } = await subC.where({
    type: 'participating'
  }).get()
  console.info({
    db: data
  })
  const subKeyedByOpenId = {}
  data.forEach(sub => {
    subKeyedByOpenId[sub._openid] = sub
  })
  const openIds = Object.keys(subKeyedByOpenId)
  console.info({ subKeyedByOpenId, openIds })

  const { data: userInfos } = await usersC.where({
    _id: db.command.in(openIds)
  }).get()
  const userInfoKeyedByOpenId = {}
  userInfos.forEach(userInfo => {
    userInfoKeyedByOpenId[userInfo._id] = userInfo
  })
  console.info({ userInfoKeyedByOpenId })

  const { data: notifInfos } = await notifC.where({
    enabled: true,
    openId: db.command.in(openIds),
    formId: db.command.neq('the formId is a mock one')
  }).get()
  const notifInfoKeyedByOpenId = {}
  notifInfos.forEach(notifInfo => {
    const notifs = notifInfoKeyedByOpenId[notifInfo.openId] || []
    notifs.push(notifInfo)
    notifInfoKeyedByOpenId[notifInfo.openId] = notifs
  })

  const rs = data.map(async sub => {
    try {
      console.info({
        sub
      })
      const {
        _openid: openId,
        since
      } = sub
      const userInfo = userInfoKeyedByOpenId[openId]
      if (!userInfo) {
        return await `empty users info: ${openId}`
      }
      console.info({
        userInfo
      })

      const token = userInfo.token
      const {
        data: participating
      } = await axios({
        method: 'GET',
        url: `https://api.github.com/notifications`,
        headers: {
          'Authorization': token
        },
        params: {
          participating: true,
          since: moment(since).add(1, 'seconds').toISOString()
        }
      })
      console.info({
        participating
      })

      if (!participating || participating.length === 0) {
        return await `empty paritcipating: ${openId}`
      }

      const notifs = notifInfoKeyedByOpenId[openId] || []
      console.info({
        notifs
      })

      if (!notifs || notifs.length === 0) {
        return await `empty notifs: ${openId}`
      }

      const notif = notifs[0]
      const n = participating[0]
      if (!n.subject.latest_comment_url) {
        return await `not a comment: ${JSON.stringify(n)}`
      }
      const title = n.subject.title

      const {
        data: {
          user,
          body,
          created_at
        }
      } = await axios({
        url: n.subject.latest_comment_url,
        headers: {
          'Authorization': token
        }
      })
      console.info({
        user,
        body
      })

      const params = {
        "touser": openId,
        "template_id": "Kps2qg5Th70Y4jXFzQqrJu5UWcCk3dEBBXOhFvqc0uI",
        "page": "pages/trends/trends",
        "form_id": notif.formId,
        "data": {
          "keyword1": {
            "value": title.length > 80 ? `${title.slice(0, 79)}...` : title
          },
          "keyword2": {
            "value": body.length > 80 ? `${body.slice(0, 79)}...` : body
          },
          "keyword3": {
            "value": user.login
          },
          "keyword4": {
            "value": moment(created_at).format('YYYY/MM/DD HH:mm:ss')
          },
          "keyword5": {
            "value": `共有 ${participating.length} 条未读通知`
          }
        }
      }
      console.info({
        params
      })

      const result = await axios({
        method: 'POST',
        url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${accessToken}`,
        data: params
      })
      console.info({
        result
      })

      await notifC.doc(notif._id).update({
        data: {
          enabled: false
        }
      })
      console.info('notif updated')

      await subC.doc(sub._id).update({
        data: {
          since: moment(n.updated_at).add(1, 'seconds').toISOString()
        }
      })
      console.info('subscription updated')

      return await `done: ${openId}`
    } catch (error) {
      return await `error: ${sub._openid}; ${error}`
    }
  })
  const r = await Promise.all(rs)
  return r.join('  ')
}