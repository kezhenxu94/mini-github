const moment = require('../utils/moment.js')
const Bmob = require('../lib/bmob.js')
Bmob.initialize('a6ca02364643e5214d51a84ac10e2ff6', '3cee74cb07ef58620c4cc04909edd3d3')

function errorHandler() {
  wx.showToast({
    title: '出现错误, 请稍后再试',
    icon: 'none',
  })
}

function getToken(username, password) {
  let str = username + ':' + password
  return 'Basic ' + wx.arrayBufferToBase64(new Uint8Array([...str].map(char => char.charCodeAt(0))))
}

let login = ({username, password}, onSuccess) => {
  let url = 'https://api.github.com/user'
  let token = getToken(username, password)
  Bmob.functions('proxy', {
    url: url,
    _: new Date(),
    token: token
  }).then(res => {
    console.log(res)
    let statusCode = res.statusCode
    if (statusCode !== 200) {
      wx.showToast({
        title: '未知错误',
        icon: 'none',
      })
      return
    }
    let user = JSON.parse(res.body)
    user.created_at = moment(user.created_at).format('YYYY/MM/DD HH:mm:SS')
    user.token = token
    onSuccess(user)
  }).catch(error => {
    console.log(error)
    wx.showToast({
      title: '网络错误, 请稍后再试',
      icon: 'none',
    })
  })
}

let getGlobalEvents = (onSuccess) => {
  const token = (wx.getStorageSync('user') || {}).token || ''
  Bmob.functions('proxy', {
    url: 'https://api.github.com/events',
    _: new Date(),
    token: token
  }).then(function (res) {
    console.log(res)
    if (res.statusCode !== 200) {
      wx.showToast({
        title: res.data.message,
        icon: 'none',
        duration: 10000
      })
      return []
    }
    let data = JSON.parse(res.body).map(it => {
      it.created_at = moment(it.created_at).format('YYYY/MM/DD HH:mm:SS')
      return it
    })
    onSuccess(data)
  }).catch(function (error) {
    console.log(error);
    errorHandler()
  });
}

let getIssues = (filter, onSuccess, onError) => {
  const url = 'https://api.github.com/user/issues?filter=' + (filter || 'all')
  const token = (wx.getStorageSync('user') || {}).token || ''
  if (!token) {
    return onError(new Error('使用此功能, 请先登录'))
  }
  Bmob.functions('proxy', {
    url: url,
    _: new Date(),
    token: token
  }).then(function (res) {
    console.log(res)
    if (res.statusCode !== 200) {
      wx.showToast({
        title: res.data.message,
        icon: 'none',
        duration: 10000
      })
      return []
    }
    let data = JSON.parse(res.body).map(it => {
      it.created_at = moment(it.created_at).format('YYYY/MM/DD HH:mm:SS')
      return it
    })
    onSuccess(data)
  }).catch(function (error) {
    console.log(error);
    errorHandler()
  })
}

let getPulls = (filter, onSuccess) => {
  const url = 'https://api.github.com/user/pulls?filter=' + (filter || 'all')
  const token = (wx.getStorageSync('user') || {}).token || ''
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
      let data = res.data.map(it => {
        it.created_at = moment(it.created_at).format('YYYY/MM/DD HH:mm:SS')
        return it
      })
      onSuccess(data)
    },
    fail: () => errorHandler()
  })
}

module.exports = {
  login: login,
  getGlobalEvents: getGlobalEvents,
  getIssues: getIssues,
  getPulls: getPulls
}