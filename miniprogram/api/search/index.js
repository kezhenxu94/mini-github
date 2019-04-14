const http = require('../http.js')
const pageable = require('../pageable.js')
const util = require('../../utils/util.js')

const token = () => util.getCurrentToken() || ''

const search = () => ({
  issues: ({ q, sort = '', order = 'desc' }) => new Promise((resolve, reject) => {
    const url = `https://api.github.com/search/issues?q=${q}&sort=${sort}&order=${order}`
    http.get(url).then(({ status, headers, data }) => {
      if (status !== 200) {
        reject(new Error(data))
      }
      const issues = data.items.map(it => {
        it.created_at = util.toReadableTime(it.created_at)
        it.updated_at = util.toReadableTime(it.updated_at)
        return it
      })
      resolve(issues)
    }).catch(error => {
      reject(error)
    })
  }),

  repos: ({ q, sort = '', order = 'desc' }) => {
    const url = `https://api.github.com/search/repositories?q=${q}&sort=${sort}&order=${order}`
    const promise = http.get(url)
    return pageable.wrap(promise)
  },

  users: ({ q, sort = '', order = 'desc' }) => {
    const url = `https://api.github.com/search/users?q=${q}&sort=${sort}&order=${order}`
    const promise = http.get(url)
    return pageable.wrap(promise)
  }
})

module.exports = search