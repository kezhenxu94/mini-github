const http = require('../http.js')
const pageable = require('../pageable.js')
const util = require('../../utils/util.js')

const token = () => utils.getCurrentToken() || ''

const users = (username) => {
  return {
    repos: () => {
      const promise = http.get(`https://api.github.com/users/${username}/repos`)
      return pageable.wrap(promise)
    },  
    starred: () => {
      const promise = http.get(`https://api.github.com/users/${username}/starred`)
      return pageable.wrap(promise)
    },
    receivedEvents: () => {
      const promise = http.get(`https://api.github.com/users/${username}/received_events`)
      return pageable.wrap(promise)
    },
    orgs: () => new Promise((resolve, reject) => {
      const url = `https://api.github.com/users/${username}/orgs`
      http.get(url).then(({ status, headers, data }) => {
        if (status !== 200) reject(new Error(data))
        resolve({ orgs: data })
      }).catch(error => reject(error))
    }),
    followers: () => new Promise((resolve, reject) => {
      const url = `https://api.github.com/users/${username}/followers`
      http.get(url).then(({ status, headers, data }) => {
        if (status !== 200) reject(new Error(data))
        resolve({ followers: data })
      }).catch(error => reject(error))
    }),
    following: () => new Promise((resolve, reject) => {
      const url = `https://api.github.com/users/${username}/following`
      http.get(url).then(({ status, headers, data }) => {
        if (status !== 200) reject(new Error(data))
        resolve({ following: data })
      }).catch(error => reject(error))
    }),
    get: () => new Promise((resolve, reject) => {
      const url = `https://api.github.com/users/${username}`
      http.get(url).then(({ status, headers, data }) => {
        if (status !== 200) reject(new Error(data))
        const user = data
        user.created_at = util.toReadableTime(user.created_at)
        resolve(user)
      }).catch(error => reject(error))
    })
  }
}

module.exports = users