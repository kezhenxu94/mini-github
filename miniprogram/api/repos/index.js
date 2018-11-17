const http = require('../http.js')
const util = require('../../utils/util.js')

const token = () => util.getCurrentToken() || ''

const repos = (repo) => {
  return {
    issues: (number) => {
      return {
        comments: () => {
          return {
            post: (body) => new Promise((resolve, reject) => {
              if (!token()) reject(new Error('使用此功能, 请先登录'))
              const url = `https://api.github.com/repos/${repo}/issues/${number}/comments`
              http.post(url, { data: { body } }).then(({ status, headers, data }) => {
                resolve(status === 201)
              }).catch(error => {
                reject(error)
              })
            })
          }
        },
        end: () => new Promise((resolve, reject) => {
          const url = `https://api.github.com/repos/${repo}/issues`
          http.get(url).then(({ status, headers, data }) => {
            if (status !== 200) reject(new Error(data))
            const issues = data.filter(it => {
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
      }
    },
    pulls: () => new Promise((resolve, reject) => {
      const url = `https://api.github.com/repos/${repo}/pulls`
      http.get(url).then(({ status, headers, data }) => {
        if (status !== 200) reject(new Error(data))
        const pulls = data.map(it => {
          it.created_at = util.toReadableTime(it.created_at)
          return it
        })
        resolve(pulls)
      }).catch(error => reject(error))
    }),
    forks: () => {
      return {
        post: () => new Promise((resolve, reject) => {
          const url = `https://api.github.com/repos/${repo}/forks`
          http.post(url).then(({ status, headers, data }) => {
            resolve(status === 202)
          }).catch(error => reject(error))
        })
      }
    },
    subscription: () => {
      const $ = (method) => new Promise((resolve, reject) => {
        wx.cloud.callFunction({
          name: 'proxy',
          data: {
            url: `https://api.github.com/repos/${repo}/subscription`,
            method,
            headers: {
              'Authorization': token()
            }
          }
        }).then(({ result: { status } }) => {
          resolve(status === 200)
        }).catch(error => reject(error))
      })
      return {
        get: () => $('GET'),
        put: () => $('PUT'),
        delete: () => $('DELETE')
      }
    }
  }
}

module.exports = repos