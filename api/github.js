const moment = require('../utils/moment.js')

function errorHandler() {
  wx.showToast({
    title: '出现错误, 请稍后再试',
    icon: 'none',
  })
}

let getGlobalEvents = (onSuccess) => {
  const token = wx.getStorageSync('token') || ''
  wx.request({
    url: 'https://api.github.com/events',
    header: {
      'Authorization': token
    },
    success: (res) => {
      console.log(res)
      if (res.statusCode !== 200) {
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
    fail: () => errorHandler()
  })
}

let getIssues = (filter, onSuccess) => {
  const url = 'https://api.github.com/user/issues?filter=' + (filter || 'all')
  const token = wx.getStorageSync('token') || ''
  wx.request({
    url,
    header: {
      'Authorization': token
    },
    success: function (res) {
      console.log(res)
      if (res.statusCode !== 200) {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 10000
        })
        return []
      }
      let data = res.data
      onSuccess(data)
    },
    fail: () => errorHandler()
  })
}

module.exports = {
  getGlobalEvents: getGlobalEvents,
  getIssues: getIssues
}