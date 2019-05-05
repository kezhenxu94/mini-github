const utils = require('../utils/util.js')

const token = () => utils.getCurrentToken() || ''

const get = (url, { params = {}, headers = {} } = {}) => new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: 'proxy',
    data: {
      method: 'GET',
      url,
      headers: Object.assign({ 'Authorization': token() }, headers),
      params
    }
  }).then(({ result: { status, headers = {}, data } }) => {
    resolve({ status, headers, data })
  }).catch(error => {
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
    resolve({ status, headers, data })
  }).catch(error => {
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
    resolve({ status, headers, data })
  }).catch(error => {
    reject(error)
  })
})

const del = (url, { params = {} } = {}) => new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: 'proxy',
    data: {
      method: 'DELETE',
      url,
      headers: { 'Authorization': token() },
      params
    }
  }).then(({ result: { status, headers = {}, data } }) => {
    resolve({ status, headers, data })
  }).catch(error => {
    reject(error)
  })
})

const patch = (url, { data = {}, headers = {} } = {}) => new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: 'proxy',
    data: {
      method: 'PATCH',
      url,
      headers: Object.assign({ 'Authorization': token() }, headers),
      data
    }
  }).then(({ result: { status, headers = {}, data } }) => {
    resolve({ status, headers, data })
  }).catch(error => {
    reject(error)
  })
})

module.exports = {
  get, put, post, del, patch
}