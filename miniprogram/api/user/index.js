const http = require('../../api/http.js')
const pageable = require('../../api/pageable.js')
const utils = require('../../utils/util.js')

const token = () => utils.getCurrentToken() || ''

const user = () => ({
  following: (username) => {
    const url = `https://api.github.com/user/following/${username}`
    return {
      get: () => new Promise((resolve, reject) => {
        http.get(url).then(({ status }) => {
          resolve(status === 204)
        }).catch(error => reject(error))
      }),
      put: () => new Promise((resolve, reject) => {
        http.put(url).then(({ status }) => {
          resolve(status === 204)
        }).catch(error => reject(error))
      }),
      delete: () => new Promise((resolve, reject) => {
        http.del(url).then(({ status }) => {
          resolve(status === 204)
        }).catch(error => reject(error))
      })
    }
  },
  starred: (repo) => {
    const url = `https://api.github.com/user/starred/${repo}`
    return {
      get: () => new Promise((resolve, reject) => {
        http.get(url).then(({ status }) => {
          resolve(status === 204)
        }).catch(error => reject(error))
      }),
      put: () => new Promise((resolve, reject) => {
        http.put(url).then(({ status }) => {
          resolve(status === 204)
        }).catch(error => reject(error))
      }),
      delete: () => new Promise((resolve, reject) => {
        http.del(url).then(({ status }) => {
          resolve(status === 204)
        }).catch(error => reject(error))
      })
    }
  },
  repos: () => {
    const promise = http.get('https://api.github.com/user/repos')
    return pageable.wrap(promise)
  },
  subscriptions: () => new Promise((resolve, reject) => {
    const url = 'https://api.github.com/user/subscriptions'
    http.get(url).then(({ status, data }) => {
      if (status === 200) {
        const repos = data
        resolve(repos)
      } else {
        reject(new Error(data.message))
      }
    }).catch(error => {
      reject(error)
    })
  }),
  get: () => new Promise((resolve, reject) => {
    const url = 'https://api.github.com/user'
    http.get(url).then(({ status, data}) => {
      if (status === 200) {
        const user = data
        user.created_at = utils.toReadableTime(user.created_at)
        resolve(user)
      } else {
        reject(new Error(data.message))
      }
    }).catch(error => {
      reject(error)
    })
  })
})

module.exports = user