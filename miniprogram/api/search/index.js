const http = require('../http.js')
const pageable = require('../pageable.js')
const util = require('../../utils/util.js')

const token = () => util.getCurrentToken() || ''

const search = () => ({
  issues: ({ q, sort = '', order = 'desc' }) => {
    const url = `https://api.github.com/search/issues?q=${q}&sort=${sort}&order=${order}`
    const promise = http.get(url)
    return pageable.wrap(promise)
  },

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