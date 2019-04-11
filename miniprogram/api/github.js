const http = require('../api/http.js')

const user = require('user/index.js')
const users = require('users/index.js')
const repos = require('repos/index.js')
const search = require('search/index.js')

const utils = require('../utils/util.js')

function errorHandler() {
  wx.showToast({
    title: '网络异常, 稍后再试',
    icon: 'none'
  })
}

const token = () => utils.getCurrentToken() || ''

const params = (params) => Object.assign({
  'Authorization': token()
}, params)

const getUrl = ({
  url,
  headers = {
    'Authorization': token()
  },
  params
}) => new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: 'proxy',
    data: { url, headers, params }
  }).then(({ result: { headers = {}, data } }) => {
    console.log('headers = %o, data = %o', headers, data)
    resolve({ statusCode: 200, headers, body: data, data })
  }).catch(error => {
    console.log(error)
    errorHandler()
    reject(error)
  })
})

const getEventsByUrl = p => new Promise((resolve, reject) => {
  getUrl(p).then(({ headers, body, data }) => {
    const events = data.map(it => {
      it.created_at = utils.toReadableTime(it.created_at)
      it.org = {}
      it.actor = {
        login: it.actor.login,
        display_login: it.actor.display_login,
        avatar_url: it.actor.avatar_url + 's=50'
      }
      return it
    })
    const links = utils.parseLinks(headers.link || "")
    const nextUrl = links['rel="next"']
    if (nextUrl) {
      resolve({
        events,
        next: () => getEventsByUrl(params({
          url: nextUrl
        }))
      })
    } else {
      resolve({
        events,
        next: null
      })
    }
  }).catch(error => reject(error))
})

const events = () => {
  return {
    end: () => getEventsByUrl({
      url: 'https://api.github.com/events'
    })
  }
}

const getPulls = (filter) => {
  const user = utils.getCurrentUser() || {}
  const url = `https://api.github.com/search/issues?q=+type:pr+author:${user.login || ''}+is:${filter}`
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('使用此功能, 请先登录'))
    }
    wx.cloud.callFunction({
      name: 'proxy',
      data: {
        url,
        headers: {
          'Authorization': token()
        }
      }
    }).then(({ result: { data } }) => {
      console.log(data)
      const pulls = data.items.map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        it.updated_at = utils.toReadableTime(it.updated_at)
        return it
      })
      resolve(pulls)
    }).catch(error => {
      errorHandler()
      reject(error)
    })
  })
}

const getIssue = (url) => new Promise((resolve, reject) => {
  getUrl({ url }).then(({data}) => {
    const issue = data
    issue.updated_at = utils.toReadableTime(issue.updated_at)
    issue.created_at = utils.toReadableTime(issue.created_at)
    resolve(issue)
  }).catch(error => {
    errorHandler()
    reject(error)
  })
})

const trendings = (since, language) => new Promise((resolve, reject) => {
  const url = 'https://github-trending-api.now.sh/repositories'
  http.get(url, { params: { since, language } }).then(({ status, headers, data }) => {
    if (status !== 200) {
      reject(new Error(data))
    }
    const trends = data.map(it => {
      it.stargazers_count = it.stars
      it.full_name = `${it.author}/${it.name}`
      return it
    })
    resolve(trends)
  }).catch(error => {
    reject(error)
  })
})

const getRepo = (url) => new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: 'proxy',
    data: {
      url,
      headers: {
        'Authorization': token()
      }
    },
  }).then(({ result: { status, data, headers } }) => {
    const repo = data
    repo.created_at = utils.toReadableTime(repo.created_at)
    repo.updated_at = utils.toReadableTime(repo.updated_at)
    repo.pushed_at = utils.toReadableTime(repo.pushed_at)
    console.info({repo})
    resolve({
      repo
    })
  }).catch(error => {
    console.log(error)
    errorHandler()
    reject(error)
  })
})

const getFile = (url) => new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: 'proxy',
    data: {
      url,
      headers: {
        'Authorization': token()
      }
    },
  }).then(({ result: { status, data, headers } }) => {
    if (status !== 200) {
      reject(new Error(data))
    }
    resolve(data)
  }).catch(error => {
    console.log(error)
    errorHandler()
    reject(error)
  })
})

const searchRepos = (_url, q) => {
  const url = !_url ? `https://api.github.com/search/repositories` : _url

  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'proxy',
      data: {
        url,
        params: { q },
        headers: {
          'Authorization': token()
        }
      },
    }).then(({ result: { status, data, headers } }) => {
      console.log(data)
      const repos = data.items.map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        return it
      })
      const links = utils.parseLinks(headers.link || "")
      console.log(repos)
      resolve({
        repos,
        links
      })
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const searchUsers = (_url, q) => {
  const url = (!_url) ? `https://api.github.com/search/users` : _url
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'proxy',
      data: {
        url,
        params: { q },
        headers: {
          'Authorization': token()
        }
      },
    }).then(({ result: { status, data, headers } }) => {
      console.log(data)
      const users = data.items.map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        return it
      })
      const links = utils.parseLinks(headers.link || "")
      console.log(users)
      resolve({
        users,
        links
      })
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const getComments = (url) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'proxy',
      data: {
        url,
        headers: {
          'Authorization': token()
        }
      },
    }).then(({ result: { status, data, headers } }) => {
      console.log(headers)
      const comments = data
      comments.forEach(comment => {
        comment.updated_at = utils.toReadableTime(comment.updated_at)
        comment.created_at = utils.toReadableTime(comment.created_at)
      })
      const links = utils.parseLinks(headers.link || "")
      resolve({
        comments,
        links
      })
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

module.exports = {
  getPulls,
  getIssue,
  trendings,
  getRepo,
  getFile,
  searchRepos,
  searchUsers,
  getComments,
  events,
  users,
  user,
  repos,
  search
}