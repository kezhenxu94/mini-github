const app = getApp()
const collection = app.globalData.db.collection('notifications')

const report = ({ formId, enabled = true, extra }) => {
  const openId = app.globalData.openId
  
  collection.add({
    data: {
      openId,
      formId,
      enabled,
      extra
    }
  }).then(console.info).catch(console.error)
}

module.exports = {
  report
}