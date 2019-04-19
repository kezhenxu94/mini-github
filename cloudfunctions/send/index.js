const cloud = require('wx-server-sdk')

cloud.init()

const env = 'github-development'

const db = cloud.database({ env })
const collection = db.collection('notifications')

exports.main = async(event, context) => {
  try {
    const result = await cloud.openapi.uniformMessage.send({
      touser: 'oefHi5Fuvi2-DUGbUDUIBM4GvhKw',
      weappTemplateMsg: {
        page: 'pages/trends/trends',
        data: {
          keyword1: {
            value: '339208499'
          },
          keyword2: {
            value: '2015年01月05日 12:30'
          },
          keyword3: {
            value: '腾讯微信总部'
          },
          keyword4: {
            value: '广州市海珠区新港中路397号'
          }
        },
        templateId: 'Kps2qg5Th70Y4jXFzQqrJusOQN620i3g6tDghRns4VQ',
        formId: 'a26c2083a18e40df8742aaa827786e5c',
        emphasisKeyword: 'keyword1.DATA'
      }
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}