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
          resolve(status === 204)
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
          resolve(status === 204)
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