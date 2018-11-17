const utils = require('../utils/util.js')

const token = () => utils.getCurrentToken() || ''

const get = (url, { params = {} } = {}) => new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: 'proxy',
    data: {
      method: 'GET',
      url,
      headers: { 'Authorization': token() },
      params
    }
  }).then(({ result: { status, headers = {}, data } }) => {
    console.log(
      'url= %o, status = %o, headers = %o, data = %o',
      url, status, headers, data
    )
    resolve({ status, headers, data })
  }).catch(error => {
    console.log('url = %o, error = %o', url, error)
    reject(error)
  })
})

const put = (url, { params = {}, data = {} } = {}) => new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: 'proxy',
    data: {
      method: 'PUT',
      url,
      headers: { 'Authorization': token() },
      params,
      data
    }
  }).then(({ result: { status, headers = {}, data } }) => {
    console.log(
      'url= %o, status = %o, headers = %o, data = %o',
      url, status, headers, data
    )
    resolve({ status, headers, data })
  }).catch(error => {
    console.log('url = %o, error = %o', url, error)
    reject(error)
  })
})

const post = (url, { params = {}, data = {} } = {}) => new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: 'proxy',
    data: {
      method: 'POST',
      url,
      headers: { 'Authorization': token() },
      params,
      data
    }
  }).then(({ result: { status, headers = {}, data } }) => {
    console.log(
      'url= %o, status = %o, headers = %o, data = %o',
      url, status, headers, data
    )
    resolve({ status, headers, data })
  }).catch(error => {
    console.log('url = %o, error = %o', url, error)
    reject(error)
  })
})

module.exports = {
  get, put, post
}