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

const user = () => {
  return {
    issues: ({ filter = 'all' }) => new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'proxy',
        data: {
          url: `https://api.github.com/user/issues?filter=${filter}`,
          headers: {
            'Authorization': token()
          }
        },
      }).then(({ result: { status, data } }) => {
        const issues = data.map(it => {
          it.created_at = utils.toReadableTime(it.created_at)
          return it
        })
        resolve(issues)
      }).catch(error => {
        console.log(error)
        reject(error)
      })
    }),
    following: (username) => {
      const $ = (method) => new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'proxy',
          data: {
            method,
            url: `https://api.github.com/user/following/${username}`,
            headers: {
              'Authorization': token()
            }
          },
        }).then(({ result: { status } }) => {
          if (status === 204) {
            resolve(true)
          }
          resolve(false)
        }).catch(error => {
          reject(error)
        })
      })
      return {
        get: () => $('GET'),
        put: () => $('PUT'),
        delete: () => $('DELETE')
      }
    },
    starred: (repo) => {
      const $ = (method) => new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'proxy',
          data: {
            method,
            url: `https://api.github.com/user/starred/${repo}`,
            headers: {
              'Authorization': token()
            }
          },
        }).then(({ result: { status } }) => {
          console.log(status)
          if (status === 204) {
            resolve(true)
          }
          resolve(false)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
      return {
        get: () => $('GET'),
        put: () => $('PUT'),
        delete: () => $('DELETE')
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
  }
}

module.exports = user