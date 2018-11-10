const Bmob = require('bmob.js')
const utils = require('../utils/util.js')
Bmob.initialize('a6ca02364643e5214d51a84ac10e2ff6', '3cee74cb07ef58620c4cc04909edd3d3')

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

const getUrl = params => new Promise((resolve, reject) => {
  Bmob.functions('proxy', params).then(res => {
    console.log(res)
    const { statusCode, headers, body } = res
    if (statusCode !== 200) {
      reject(new Error(body))
    }
    resolve({ statusCode, headers, body })
  }).catch(error => {
    errorHandler()
    reject(error)
  })
})

const getRepos = params => new Promise((resolve, reject) => {
  getUrl(params).then(({ body }) => {
    const repos = JSON.parse(body)
    resolve(repos.map(it => {
      it.created_at = utils.toReadableTime(it.created_at)
      return it
    }))
  }).catch(error => {
    errorHandler()
    reject(error)
  })
})

const getEventsByUrl = p => new Promise((resolve, reject) => {
  getUrl(p).then(({ headers, body }) => {
    const events = JSON.parse(body).map(it => {
      it.created_at = utils.toReadableTime(it.created_at)
      it.org = {}
      it.actor = {
        login: it.actor.login,
        display_login: it.actor.display_login,
        avatar_url: it.actor.avatar_url
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
      url: `https://api.github.com/events`
    })
  }
}

const users = (username) => {
  return {
    repos: () => getRepos(params({
      url: `https://api.github.com/users/${username}/repos`
    })),
    starred: () => getRepos(params({
      url: `https://api.github.com/users/${username}/starred`
    })),
    receivedEvents: () => getEventsByUrl({
      url: `https://api.github.com/users/${username}/received_events`
    }),
    end: () => new Promise((resolve, reject) => {
      getUrl(params({
        url: `https://api.github.com/users/${username}`
      })).then(({ body }) => {
        const user = JSON.parse(body)
        user.created_at = utils.toReadableTime(user.created_at)
        resolve(user)
      }).catch(error => {
        errorHandler()
        reject(error)
      })
    })
  }
}

const user = () => {
  return {
    issues: ({ filter = 'all' }) => new Promise((resolve, reject) => {
      getUrl(params({
        url: `https://api.github.com/user/issues?filter=${filter}`
      })).then(({ body }) => {
        const issues = JSON.parse(body).map(it => {
          it.created_at = utils.toReadableTime(it.created_at)
          return it
        })
        resolve(issues)
      }).catch(error => {
        errorHandler()
        reject(error)
      })
    }),
    following: (username) => {
      return {
        get: () => new Promise((resolve, reject) => {
          Bmob.functions('proxy', params({
            url: `https://api.github.com/user/following/${username}`
          })).then(res => {
            const { statusCode, headers, body } = res
            if (statusCode === 204) {
              resolve(true)
            }
            resolve(false)
          }).catch(error => {
            errorHandler()
            reject(error)
          })
        }),
        put: () => new Promise((resolve, reject) => {
          Bmob.functions('proxy', params({
            url: `https://api.github.com/user/following/${username}`,
            method: 'PUT'
          })).then(res => {
            const { statusCode, headers, body } = res
            if (statusCode === 204) {
              resolve(true)
            }
            resolve(false)
          }).catch(error => {
            errorHandler()
            reject(error)
          })
        }),
        delete: () => new Promise((resolve, reject) => {
          Bmob.functions('proxy', params({
            url: `https://api.github.com/user/following/${username}`,
            method: 'DELETE'
          })).then(res => {
            const { statusCode, headers, body } = res
            if (statusCode === 204) {
              resolve(true)
            }
            resolve(false)
          }).catch(error => {
            errorHandler()
            reject(error)
          })
        })
      }
    },
    end: () => new Promise((resolve, reject) => {
      getUrl(params({
        url: `https://api.github.com/user`
      })).then(({ body }) => {
        const user = JSON.parse(body)
        user.created_at = utils.toReadableTime(user.created_at)
        resolve(user)
      }).catch(error => {
        errorHandler()
        reject(error)
      })
    })
  }
}

const getPulls = (filter) => {
  const user = utils.getCurrentUser() || {}
  const token = utils.getCurrentToken() || ''
  const url = `https://api.github.com/search/issues?q=+type:pr+author:${user.login || ''}+is:${filter}`
  const params = {
    url: url,
    _: new Date(),
    token: token
  }
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('使用此功能, 请先登录'))
    }
    Bmob.functions('proxy', params).then(res => {
      console.log(res)
      if (res.statusCode !== 200) {
        reject(new Error(data.message))
      }
      const data = JSON.parse(res.body)
      const pulls = data.items.map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        it.updated_at = utils.toReadableTime(it.updated_at)
        return it
      })
      resolve(pulls)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const getIssue = (url) => new Promise((resolve, reject) => {
  getUrl(params({ url })).then(res => {
    const { body } = res
    const issue = JSON.parse(body)
    issue.updated_at = utils.toReadableTime(issue.updated_at)
    issue.created_at = utils.toReadableTime(issue.created_at)
    resolve(issue)
  }).catch(error => {
    errorHandler()
    reject(error)
  })
})

const getTrends = (since, lang) => {
  const params = {
    since: since,
    lang: lang
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('trend', params).then(res => {
      console.log(res)
      if (res.statusCode !== 200) {
        reject(new Error(data.message))
      }
      const trends = JSON.parse(res.body).map(it => {
        it.stargazers_count = it.stars
        it.full_name = `${it.author}/${it.name}`
        return it
      })
      resolve(trends)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const getComments = (url) => {
  const token = utils.getCurrentToken() || ''
  const params = {
    url: url,
    _: new Date(),
    token: token
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(function(res) {
      console.log(res)
      if (res.statusCode !== 200) {
        reject(new Error(data.message))
      }
      const comments = JSON.parse(res.body)
      comments.forEach(comment => {
        comment.updated_at = utils.toReadableTime(comment.updated_at)
        comment.created_at = utils.toReadableTime(comment.created_at)
      })
      const headers = res.headers
      const links = utils.parseLinks(headers.link || "")
      resolve({
        comments,
        links
      })
    }).catch(function(error) {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const getRepo = (url) => {
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(res => {
      console.log(res)
      if (res.statusCode !== 200) {
        reject(new Error(res.message))
      }
      const repo = JSON.parse(res.body)
      repo.created_at = utils.toReadableTime(repo.created_at)
      repo.updated_at = utils.toReadableTime(repo.updated_at)
      repo.pushed_at = utils.toReadableTime(repo.pushed_at)
      resolve({
        repo
      })
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const getFile = (url) => {
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(res => {
      console.log(res)
      if (res.statusCode !== 200) {
        reject(new Error(res.body))
      }
      resolve(res.body)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const getRepoIssues = ({
  full_name
}) => {
  const url = `https://api.github.com/repos/${full_name}/issues`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(res => {
      console.log(res)
      if (res.statusCode !== 200) {
        reject(new Error(res.body))
      }
      const issues = JSON.parse(res.body).filter(it => {
        return it.pull_request === undefined
      }).map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        return it
      })
      resolve(issues)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const getRepoPulls = ({
  full_name
}) => {
  const url = `https://api.github.com/repos/${full_name}/pulls`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(res => {
      if (res.statusCode !== 200) {
        reject(new Error(res.body))
      }
      const pulls = JSON.parse(res.body).map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        return it
      })
      console.log(pulls)
      resolve(pulls)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const searchRepos = (_url, q) => {
  const url = !_url ? `https://api.github.com/search/repositories` : _url
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token,
    q
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(res => {
      if (res.statusCode !== 200) {
        reject(new Error(res.body))
      }
      const headers = res.headers
      const data = JSON.parse(res.body)
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
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token,
    q
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(res => {
      if (res.statusCode !== 200) {
        reject(new Error(res.body))
      }
      const headers = res.headers
      const data = JSON.parse(res.body)
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

const getFollowers = (username) => {
  const url = `https://api.github.com/users/${username}/followers`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(res => {
      if (res.statusCode !== 200) {
        reject(new Error(res.body))
      }
      const followers = JSON.parse(res.body).map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        return it
      })
      console.log(followers)
      resolve(followers)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const getFollowing = (username) => {
  const url = `https://api.github.com/users/${username}/following`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(res => {
      if (res.statusCode !== 200) {
        reject(new Error(res.body))
      }
      const followers = JSON.parse(res.body).map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        return it
      })
      console.log(followers)
      resolve(followers)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const checkStar = (repoFullName) => {
  const url = `https://api.github.com/user/starred/${repoFullName}`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(res => {
      if (res.statusCode === 204) {
        resolve(true)
      }
      resolve(false)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const star = (repoFullName) => {
  const url = `https://api.github.com/user/starred/${repoFullName}`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token,
    method: 'PUT',
    headers: {
      'Content-Length': 0
    }
  }
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('使用此功能, 请先登录'))
    }
    Bmob.functions('proxy', params).then(res => {
      console.log(res)
      if (res.statusCode === 204) {
        resolve(true)
      }
      resolve(false)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const unstar = (repoFullName) => {
  const url = `https://api.github.com/user/starred/${repoFullName}`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token,
    method: 'DELETE',
    headers: {
      'Content-Length': 0
    }
  }
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('使用此功能, 请先登录'))
    }
    Bmob.functions('proxy', params).then(res => {
      console.log(res)
      if (res.statusCode === 204) {
        resolve(true)
      }
      resolve(false)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const checkWatching = (repoFullName) => {
  const url = `https://api.github.com/repos/${repoFullName}/subscription`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(res => {
      if (res.statusCode === 200) {
        resolve(true)
      }
      resolve(false)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const startWatching = (repoFullName) => {
  const url = `https://api.github.com/repos/${repoFullName}/subscription`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token,
    method: 'PUT',
    headers: {
      'Content-Length': 0
    }
  }
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('使用此功能, 请先登录'))
    }
    Bmob.functions('proxy', params).then(res => {
      console.log(res)
      if (res.statusCode === 200) {
        resolve(true)
      }
      resolve(false)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}


const stopWatching = (repoFullName) => {
  const url = `https://api.github.com/repos/${repoFullName}/subscription`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token,
    method: 'DELETE',
    headers: {
      'Content-Length': 0
    }
  }
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('使用此功能, 请先登录'))
    }
    Bmob.functions('proxy', params).then(res => {
      console.log(res)
      if (res.statusCode === 200) {
        resolve(true)
      }
      resolve(false)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const fork = function(repoFullName) {
  const url = `https://api.github.com/repos/${repoFullName}/forks`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token,
    method: 'POST'
  }
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('使用此功能, 请先登录'))
    }
    Bmob.functions('proxy', params).then(res => {
      console.log(res)
      if (res.statusCode === 202) {
        resolve(true)
      }
      resolve(false)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

const createComment = (repoFullName, issueNum, content) => {
  const url = `https://api.github.com/repos/${repoFullName}/issues/${issueNum}/comments`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token,
    method: 'POST',
    body: {
      body: content
    }
  }
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('使用此功能, 请先登录'))
    }
    Bmob.functions('proxy', params).then(res => {
      console.log(res)
      if (res.statusCode === 201) {
        resolve(true)
      }
      resolve(false)
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
  getTrends,
  getComments,
  getRepo,
  getFile,
  getRepoIssues,
  getRepoPulls,
  searchRepos,
  searchUsers,
  getFollowers,
  getFollowing,
  checkStar,
  star,
  unstar,
  checkWatching,
  startWatching,
  stopWatching,
  fork,
  createComment,
  events,
  users,
  user
}