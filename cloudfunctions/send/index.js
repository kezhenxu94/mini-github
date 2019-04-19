const cloud = require('wx-server-sdk')

cloud.init()

const env = 'github-development'

const db = cloud.database({ env })
const collection = db.collection('notifications')

exports.main = async(event, context) => {
  try {
    const openId = 'oefHi5Fuvi2-DUGbUDUIBM4GvhKw'
    const notifs = await collection.where({
      enabled: true,
      openId: openId
    }).limit(1).get()
    console.info({ notifs })
    if (!notifs.data || notifs.data.length <= 0) {
      console.error('notifs is empty')
      return
    }
    const notif = notifs.data[0]
    const result = await cloud.openapi.uniformMessage.send({
      touser: openId,
      weappTemplateMsg: {
        page: 'pages/trends/trends',
        data: {
          keyword1: {
            value: notif.openId
          },
          keyword2: {
            value: new Date()
          },
          keyword3: {
            value: '腾讯微信总部'
          },
          keyword4: {
            value: notif.formId
          }
        },
        templateId: 'Kps2qg5Th70Y4jXFzQqrJusOQN620i3g6tDghRns4VQ',
        formId: notif.formId
      }
    })
    collection.doc(notif._id).update({
      data: { enabled: false }
    })
    console.info(notif._id)
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}