const http = require('../http.js')
const util = require('../../utils/util.js')

const token = () => util.getCurrentToken() || ''

const search = () => ({
  issues: ({ q, sort = '', order = 'desc' }) => new Promise((resolve, reject) => {
    const url = `https://api.github.com/search/issues?q=${q}&sort=${sort}&order=${order}`
    http.get(url).then(({ status, headers, data }) => {
      if (status !== 200) {
        reject(new Error(data))
      }
      const issues = data.items.filter(it => {
        return it.pull_request === undefined
      }).map(it => {
        it.created_at = util.toReadableTime(it.created_at)
        return it
      })
      resolve(issues)
    }).catch(error => {
      reject(error)
    })
  })
})

module.exports = search