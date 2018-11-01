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
    const statusCode = res.statusCode
    const data = JSON.parse(res.body)
    if (statusCode !== 200) {
      return onError(new Error(data.message))
    }
    const user = data
    user.created_at = moment(user.created_at).format('YYYY/MM/DD HH:mm:SS')
    user.token = token
    onSuccess(user)
  }).catch(error => {
    console.log(error)
    errorHandler()
  })
}

let getGlobalEvents = (onSuccess, onError) => {
  const user = wx.getStorageSync('user')
  let url = 'https://api.github.com/events'
  if (user) {
    url = `https://api.github.com/users/${user.login}/received_events`
  }
  Bmob.functions('proxy', {
    url: url,
    _: new Date()
  }).then(function (res) {
    console.log(res)
    let data = JSON.parse(res.body)
    if (res.statusCode !== 200) {
      return onError(new Error(data.message))
    }
    data = data.map(it => {
      it.created_at = moment(it.created_at).format('YYYY/MM/DD HH:mm:SS')
      return it
    })
    return onSuccess(data)
  }).catch(function (error) {
    console.log(error);
    onError(error)
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
      return onError(new Error(data.message))
    }
    let data = JSON.parse(res.body).map(it => {
      it.created_at = moment(it.created_at).format('YYYY/MM/DD HH:mm:SS')
      return it
    })
    return onSuccess(data)
  }).catch(function (error) {
    console.log(error);
    errorHandler()
  })
}

let getPulls = (filter, onSuccess, onError) => {
  const user = wx.getStorageSync('user') || {}
  const token = user.token || ''
  const url = `https://api.github.com/search/issues?q=+type:pr+author:${user.login}`
  if (!token) {
    return onError(new Error('使用此功能, 请先登录'))
  }
  const params = {
    url: url,
    _: new Date(),
    token: token
  }
  Bmob.functions('proxy', params).then(function (res) {
    console.log(res)
    if (res.statusCode !== 200) {
      return onError(new Error(data.message))
    }
    const data = JSON.parse(res.body)
    const pulls = data.items.map(it => {
      it.created_at = moment(it.created_at).format('YYYY/MM/DD HH:mm:SS')
      return it
    })
    return onSuccess(pulls)
  }).catch(function (error) {
    console.log(error);
    errorHandler()
  })
}

module.exports = {
  login: login,
  getGlobalEvents: getGlobalEvents,
  getIssues: getIssues,
  getPulls: getPulls
}