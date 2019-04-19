const app = getApp()
const collection = app.globalData.db.collection('notifications')

const report = ({ formId, enabled, extra }) => {
  const openId = app.globalData.openId
  
  collection.add({
    data: {
      openId,
      formId,
      enabled,
      extra
    }
  })
}

module.exports = {
  report
}