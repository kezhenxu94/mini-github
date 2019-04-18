const http = require('../http.js')
const util = require('../../utils/util.js')

const token = () => util.getCurrentToken() || ''

const notifications = () => ({
  get: ({ all = false, participating = false } = {}) => new Promise((resolve, reject) => {
    if (!token()) reject(new Error('使用此功能, 请先登录'))
    const url = `https://api.github.com/notifications?all=${all}&participating=${participating}`
    http.get(url).then(({ status, headers, data }) => {
      resolve({ notifications: data })
    }).catch(error => {
      reject(error)
    })
  }),
  threads: id => ({
    patch: () => new Promise((resolve, reject) => {
      if (!token()) reject(new Error('使用此功能, 请先登录'))
      const url = `https://api.github.com/notifications/threads/${id}`
      http.patch(url).then(({ status, headers, data }) => {
        resolve(status === 205)
      }).catch(error => {
        reject(error)
      })
    })
  })
})

module.exports = notifications