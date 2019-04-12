const http = require('../../api/http.js')
const utils = require('../../utils/util.js')

const token = () => utils.getCurrentToken() || ''

function asRepository(object = {}) {
  object.created_at = utils.toReadableTime(object.created_at)
  return object
}

function getReposByUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url).then(({ status, headers, data }) => {
      if (status !== 200) reject(new Error(data))
      const repos = data.map(it => asRepository(it))
      const links = utils.parseLinks(headers.link || "")
      const nextUrl = links['rel="next"']
      if (nextUrl) {
        resolve({
          repos,
          next: () => getReposByUrl(nextUrl)
        })
      } else {
        resolve({ repos, next: null })
      }
    }).catch(error => reject(error))
  })
}

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
    const url = 'https://api.github.com/user/repos'
    return getReposByUrl(url)
  },
  end: () => new Promise((resolve, reject) => {
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