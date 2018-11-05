const Bmob = require('bmob.js')
const utils = require('../utils/util.js')
Bmob.initialize('a6ca02364643e5214d51a84ac10e2ff6', '3cee74cb07ef58620c4cc04909edd3d3')

function errorHandler() {
  wx.showToast({
    title: '网络异常, 请稍后再试',
    icon: 'none'
  })
}

function getToken(username, password) {
  let str = username + ':' + password
  return 'Basic ' + wx.arrayBufferToBase64(new Uint8Array([...str].map(char => char.charCodeAt(0))))
}

function getRepos(params) {
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', params).then(res => {
      console.log(res)
      if (res.statusCode !== 200) {
        reject(new Error(res.body))
      }
      const repos = JSON.parse(res.body).map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        return it
      })
      console.log(repos)
      resolve(repos)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

let login = ({
  username,
  password
}) => {
  let url = 'https://api.github.com/user'
  let token = getToken(username, password)
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', {
      url: url,
      _: new Date(),
      token: token
    }).then(res => {
      console.log(res)
      const statusCode = res.statusCode
      const data = JSON.parse(res.body)
      if (statusCode !== 200) {
        reject(new Error(data.message))
      }
      const user = data
      user.created_at = utils.toReadableTime(user.created_at)
      user.token = token
      resolve(user)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

let getGlobalEvents = (link) => {
  const user = utils.getCurrentUser()
  const token = utils.getCurrentToken() || ''
  let url = 'https://api.github.com/events'
  if (user) {
    url = `https://api.github.com/users/${user.login}/received_events`
  }
  if (link) {
    url = link
  }
  return new Promise((resolve, reject) => {
    Bmob.functions('proxy', {
      url: url,
      token: token
    }).then(function(res) {
      console.log(res)
      let data = JSON.parse(res.body)
      if (res.statusCode !== 200) {
        reject(new Error(data.message))
      }
      data = data.map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        // 简化数据, 翻页数据越来越大
        it.org = {}
        it.actor = {
          login: it.actor.login,
          display_login: it.actor.display_login,
          avatar_url: it.actor.avatar_url
        }
        return it
      })
      const headers = res.headers
      resolve({
        data: data,
        links: utils.parseLinks(headers.link || "")
      })
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

let getIssues = (filter) => {
  const url = 'https://api.github.com/user/issues?filter=' + (filter || 'all')
  const token = utils.getCurrentToken() || ''
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new Error('使用此功能, 请先登录'))
    }
    Bmob.functions('proxy', {
      url: url,
      _: new Date(),
      token: token
    }).then(res => {
      console.log(res)
      if (res.statusCode !== 200) {
        reject(new Error(data.message))
      }
      const data = JSON.parse(res.body).map(it => {
        it.created_at = utils.toReadableTime(it.created_at)
        return it
      })
      resolve(data)
    }).catch(error => {
      console.log(error);
      errorHandler()
      reject(error)
    })
  })
}

let getPulls = (filter) => {
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
      console.log(error);
      errorHandler()
      reject(error)
    })
  })
}

let getIssue = (url) => {
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
        reject(new Error(res.message))
      }
      const issue = JSON.parse(res.body)
      issue.updated_at = utils.toReadableTime(issue.updated_at)
      issue.created_at = utils.toReadableTime(issue.created_at)
      resolve(issue)
    }).catch(error => {
      console.log(error);
      errorHandler()
      reject(error)
    })
  })
}

let getTrends = (since, lang) => {
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
      console.log(error);
      errorHandler()
      reject(error)
    })
  })
}

let getComments = (url) => {
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

let getRepo = (url) => {
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

let getFile = (url) => {
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

let getRepoIssues = ({
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

let getRepoPulls = ({
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

let getUserRepos = (username) => {
  const url = `https://api.github.com/users/${username}/repos`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token
  }
  return getRepos(params)
}

let getStarredRepos = (username) => {
  const url = `https://api.github.com/users/${username}/starred`
  const token = utils.getCurrentToken() || ''
  const params = {
    url,
    token
  }
  return getRepos(params)
}

let getUser = (username) => {
  const url = `https://api.github.com/users/${username}`
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
      const user = JSON.parse(res.body)
      user.created_at = utils.toReadableTime(user.created_at)
      console.log(user)
      resolve(user)
    }).catch(error => {
      console.log(error)
      errorHandler()
      reject(error)
    })
  })
}

let searchRepos = (_url, q) => {
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

let searchUsers = (_url, q) => {
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

let getFollowers = (username) => {
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

let getFollowing = (username) => {
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

let checkStar = (repoFullName) => {
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

let star = (repoFullName) => {
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

let unstar = (repoFullName) => {
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

let checkWatching = (repoFullName) => {
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

let startWatching = (repoFullName) => {
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


let stopWatching = (repoFullName) => {
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

let fork = function (repoFullName) {
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

let createComment = (repoFullName, issueNum, content) => {
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
  login,
  getGlobalEvents,
  getIssues,
  getPulls,
  getIssue,
  getTrends,
  getComments,
  getRepo,
  getFile,
  getRepoIssues,
  getRepoPulls,
  getUserRepos,
  getStarredRepos,
  getUser,
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
  createComment
}