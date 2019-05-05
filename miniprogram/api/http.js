const utils = require('../utils/util.js')

const token = () => utils.getCurrentToken() || ''

const get = (url, { params = {}, headers = {} } = {}) => new Promise((resolve, reject) => {
  wx.request({
    url: url,
    data: params,
    header: Object.assign({ 'Authorization': token() }, headers),
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      const { statusCode, header, data } = res
      resolve({ status: statusCode, headers: header, data })
    },
    fail: function(res) {
      console.info({ res })
      reject(new Error(JSON.stringify(res)))
    },
    complete: function(res) {}
  })
})

const put = (url, { params = {}, data = {} } = {}) => new Promise((resolve, reject) => {
  wx.request({
    url: url,
    data: params,
    header: { 'Authorization': token() },
    method: 'PUT',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      const { statusCode, header, data } = res
      resolve({ status: statusCode, headers: header, data })
    },
    fail: function (res) {
      console.info({ res })
      reject(new Error(JSON.stringify(res)))
    },
    complete: function(res) {}
  })
})

const post = (url, { params = {}, data = {} } = {}) => new Promise((resolve, reject) => {
  wx.request({
    url: url,
    data: params,
    header: { 'Authorization': token() },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      const { statusCode, header, data } = res
      resolve({ status: statusCode, headers: header, data })
    },
    fail: function (res) {
      console.info({ res })
      reject(new Error(JSON.stringify(res)))
    },
    complete: function (res) { },
  })
})

const del = (url, { params = {} } = {}) => new Promise((resolve, reject) => {
  wx.request({
    url: url,
    data: params,
    header: { 'Authorization': token() },
    method: 'DELETE',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      const { statusCode, header, data } = res
      resolve({ status: statusCode, headers: header, data })
    },
    fail: function (res) {
      console.info({ res })
      reject(new Error(JSON.stringify(res)))
    },
    complete: function (res) { },
  })
})

const patch = (url, { params = {} } = {}) => new Promise((resolve, reject) => {
  wx.request({
    url: url,
    data: params,
    header: { 'Authorization': token() },
    method: 'PATCH',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      const { statusCode, header, data } = res
      resolve({ status: statusCode, headers: header, data })
    },
    fail: function (res) {
      console.info({ res })
      reject(new Error(JSON.stringify(res)))
    },
    complete: function (res) { }
  })
})

module.exports = {
  get, put, post, del, patch
}