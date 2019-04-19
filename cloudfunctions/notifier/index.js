const axios = require('axios')
const cloud = require('wx-server-sdk')
cloud.init()

axios.defaults.validateStatus = () => true

const env = 'github-development'
const db = cloud.database({
  env
})
const usersC = db.collection('users')
const notifC = db.collection('notifications')
const subC = db.collection('subscriptions')

exports.main = async(event, context) => new Promise((resolve, reject) => {
  subC.where({ type: 'participating' }).get().then(({ data }) => {
    console.info({ db: data })

    Promise.all(data.map(sub => new Promise((resolve, reject) => {
      const { _openid: openId } = sub
      console.info({ openId })
      usersC.doc(openId).get().then(({ data: user }) => {
        console.info({ user })
        const token = user.token
        axios({
          method: 'GET',
          url: `https://api.github.com/notifications?participating=true`,
          headers: {
            'Authorization': token
          }
        }).then(({ data: participating }) => {
          console.info({ participating })

          notifC.where({
            enabled: true,
            openId: openId
          }).limit(1).get().then(({ data: notifs }) => {
            console.info({ notifs })
            if (!notifs || notifs.length === 0) {
              console.error('empty notifs: ' + notifs)
              return
            }
            const notif = notifs[0]
            if (participating && participating.length > 0) {
              const n = participating[0]
              const params = {
                touser: openId,
                weappTemplateMsg: {
                  page: 'pages/trends/trends',
                  data: {
                    keyword1: {
                      value: openId
                    },
                    keyword2: {
                      value: new Date()
                    },
                    keyword3: {
                      value: n.subject.title
                    },
                    keyword4: {
                      value: notif.formId
                    }
                  },
                  template_id: 'Kps2qg5Th70Y4jXFzQqrJu5UWcCk3dEBBXOhFvqc0uI',
                  templateId: 'Kps2qg5Th70Y4jXFzQqrJu5UWcCk3dEBBXOhFvqc0uI',
                  form_id: notif.formId
                }
              }
              console.info(JSON.stringify(params))

              const token = '20_KQ3MtP-jRbptTgEg5zi2WWqMMHMDWiYWjQFHz9Dw1KSZ3T0T2YFOW2JpJN8lLRlVjvYhhi-0cMg7fILTBPoZDko1bhraJI3nGiNK3XEuyBPuJelSOzrgrDFj_vfb2HYyQ4nRL6nSYipjjU_NJPAhACAVBM'
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
                })
              }).catch(console.error)
            }
          }).catch(console.error)
        }).catch(console.error)
      }).catch(console.error)
    }))).then(resolve).catch(reject)
  })
})