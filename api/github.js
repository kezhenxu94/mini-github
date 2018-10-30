const moment = require('../utils/moment.js')

let getGlobalEvents = (onSuccess) => {
  wx.request({
    url: 'https://api.github.com/events',
    success: (res) => {
      if (res.statusCode === 403) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 10000
        })
        return []
      }
      let data = res.data.map(it => {
        it.created_at = moment(it.created_at).format('YYYY/MM/DD HH:mm:SS')
        return it
      })
      onSuccess(data)
    },
    fail: () => {
      wx.showToast({
        title: '出现错误, 请稍后再试',
        icon: 'none',
      })
    }
  })
}

module.exports = {
  getGlobalEvents
}