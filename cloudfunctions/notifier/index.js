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

const getAccessToken = () => new Promise((resolve, reject) => {
  axios({
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    params: {
      grant_type: 'client_credential',
      appid: 'wx5d7793555064ce62',
      secret: 'd7f1aaaafd37a5dd07a523e554109b4a'
    }
  }).then(({ data: { access_token } }) => {
    resolve(access_token)
  }).catch(reject)
})

const handlerError = () => (error => {
  console.error
  return Promise.reject(error)
})

exports.main = async(event, context) => new Promise((resolve, reject) => {
  subC.where({ type: 'participating' }).get().then(({ data }) => {
    console.info({ db: data })

    return Promise.all(data.map(sub => new Promise((resolve, reject) => {
      const { _openid: openId, since } = sub
      console.info({ openId, since })
      usersC.doc(openId).get().then(({ data: user }) => {
        console.info({ user })
        const token = user.token
        axios({
          method: 'GET',
          url: `https://api.github.com/notifications`,
          headers: {
            'Authorization': token
          },
          params: {
            participating: true,
            since: moment(since).toISOString()
          }
        }).then(({ data: participating }) => {
          console.info({ participating })

          if (!participating || participating.length === 0) {
            return reject(new Error('empty paritcipating'))
          }

          notifC.where({
            enabled: true,
            openId: openId,
            formId: db.command.neq('the formId is a mock one')
          }).limit(1).get().then(({ data: notifs }) => {
            console.info({ notifs })
            if (!notifs || notifs.length === 0) {
              return reject(new Error('empty notifs: ' + notifs))
            }
            const notif = notifs[0]
            const n = participating[0]
            if (!n.subject.latest_comment_url) {
              return reject(new Error('not a comment: ' + JSON.stringify(n)))
            }
            axios({
              url: n.subject.latest_comment_url,
              headers: {
                'Authorization': token
              }
            }).then(({ data: { user, body, created_at } }) => {
              console.info({ user, body })
              const params = {
                "touser": openId,
                "template_id": "Kps2qg5Th70Y4jXFzQqrJu5UWcCk3dEBBXOhFvqc0uI",
                "page": "pages/trends/trends",
                "form_id": notif.formId,
                "data": {
                  "keyword1": {
                    "value": n.subject.title
                  },
                  "keyword2": {
                    "value": body.length > 100 ? `${body.slice(0, 99)}...` : body
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
              console.info({ params })

              getAccessToken().then(token => {
                console.info({ token })
                axios({
                  method: 'POST',
                  url: `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${token}`,
                  data: params
                }).then(result => {
                  console.info({
                    result
                  })
                  notifC.doc(notif._id).update({
                    data: { enabled: false }
                  }).then(() => {
                    console.info('notif updated')
                    return subC.doc(sub._id).update({
                      data: { since: moment(n.updated_at).add(1, 'seconds').toISOString() }
                    })
                  }).then(() => {
                    console.info('subscription updated')
                    return resolve('message sent')
                  }).catch(error => {
                    return reject(error)
                  })
                }).catch(handlerError)
              }).catch(handlerError)
            }).catch(handlerError)
          }).catch(handlerError)
        }).catch(handlerError)
      }).catch(handlerError)
    })))
  }).then(() => resolve('done')).catch(reject)
})