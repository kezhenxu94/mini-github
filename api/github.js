let getGlobalEvents = (onSuccess) => {
  wx.request({
    url: 'https://api.github.com/events',
    success: (res) => {
      let data = res.data
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