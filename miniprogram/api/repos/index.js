const http = require('../http.js')
const util = require('../../utils/util.js')

const token = () => util.getCurrentToken() || ''

const repos = repo => ({
  issues: number => ({
    comments: (commentId) => ({
      post: body => new Promise((resolve, reject) => {
        if (!token()) reject(new Error('使用此功能, 请先登录'))
        const url = `https://api.github.com/repos/${repo}/issues/${number}/comments`
        http.post(url, { data: { body } }).then(({ status, headers, data }) => {
          resolve(status === 201)
        }).catch(error => {
          reject(error)
        })
      }),
      patch: body => new Promise((resolve, reject) => {
        if (!token()) reject(new Error('使用此功能, 请先登录'))
        const url = `https://api.github.com/repos/${repo}/issues/${number}/comments${commentId}`
        http.patch(url, { data: { body } }).then(({ status, headers, data }) => {
          resolve(status === 200)
        }).catch(error => {
          reject(error)
        })
      }) 
    }),
    get: () => new Promise((resolve, reject) => {
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
  }),
  pulls: () => new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${repo}/pulls`
    http.get(url).then(({ status, headers, data }) => {
      if (status !== 200) reject(new Error(data))
      const pulls = data.map(it => {
        it.created_at = util.toReadableTime(it.created_at)
        it.updated_at = util.toReadableTime(it.updated_at)
        return it
      })
      resolve(pulls)
    }).catch(error => reject(error))
  }),

  contributors: () => new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${repo}/contributors`
    http.get(url).then(({ status, headers, data }) => {
      if (status !== 200) reject(new Error(data))
      const contributors = data
      resolve(contributors)
    }).catch(error => reject(error))
  }),

  forks: () => ({
    post: () => new Promise((resolve, reject) => {
      const url = `https://api.github.com/repos/${repo}/forks`
      http.post(url).then(({ status, headers, data }) => {
        resolve(status === 202)
      }).catch(error => reject(error))
    })
  }),

  subscription: () => {
    const url = `https://api.github.com/repos/${repo}/subscription`
    return {
      get: () => new Promise((resolve, reject) => {
        http.get(url).then(({ status }) => {
          resolve(status === 200)
        }).catch(error => {
          reject(error)
        })
      }),
      put: () => new Promise((resolve, reject) => {
        http.put(url).then(({ status }) => {
          resolve(status === 200)
        }).catch(error => {
          reject(error)
        })
      }),
      delete: () => new Promise((resolve, reject) => {
        http.del(url).then(({ status }) => {
          resolve(status === 200)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },

  notifications: () => new Promise((resolve, reject) => {
    http.get(`https://api.github.com/repos/${repo}/notifications`).then(({ status, data }) => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  }),

  readme: () => {
    const url = `https://api.github.com/repos/${repo}/readme`
    return new Promise((resolve, reject) => {
      http.get(url).then(({ status, data }) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
})

module.exports = repos