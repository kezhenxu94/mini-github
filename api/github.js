const Bmob = require('../lib/bmob.js')
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
}, onSuccess) => {
  let url = 'https://api.github.com/user'
  let token = getToken(username, password)
  Bmob.functions('proxy', {
    url: url,
    _: new Date(),
    token: token
  }).then(res => {
    console.log(res)
    const statusCode = res.statusCode
    const data = JSON.parse(res.body)
    if (statusCode !== 200) {
      return onError(new Error(data.message))
    }
    const user = data
    user.created_at = utils.toReadableTime(user.created_at)
    user.token = token
    onSuccess(user)
  }).catch(error => {
    console.log(error)
    errorHandler()
  })
}

let getGlobalEvents = (link, onSuccess, onError) => {
  const user = utils.getCurrentUser()
  const token = utils.getCurrentToken() || ''
  let url = 'https://api.github.com/events'
  if (user) {
    url = `https://api.github.com/users/${user.login}/received_events`
  }
  if (link) {
    url = link
  }
  Bmob.functions('proxy', {
    url: url,
    token: token
  }).then(function(res) {
    console.log(res)
    let data = JSON.parse(res.body)
    if (res.statusCode !== 200) {
      return onError(new Error(data.message))
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
    return onSuccess({
      data: data,
      links: utils.parseLinks(headers.link || "")
    })
  }).catch(function(error) {
    console.log(error);
    errorHandler()
    onError(error)
  });
}

let getIssues = (filter, onSuccess, onError) => {
  const url = 'https://api.github.com/user/issues?filter=' + (filter || 'all')
  const token = utils.getCurrentToken() || ''
  if (!token) {
    return onError(new Error('使用此功能, 请先登录'))
  }
  Bmob.functions('proxy', {
    url: url,
    _: new Date(),
    token: token
  }).then(function(res) {
    console.log(res)
    if (res.statusCode !== 200) {
      return onError(new Error(data.message))
    }
    const data = JSON.parse(res.body).map(it => {
      it.created_at = utils.toReadableTime(it.created_at)
      return it
    })
    return onSuccess(data)
  }).catch(function(error) {
    console.log(error);
    errorHandler()
  })
}

let getPulls = (filter, onSuccess, onError) => {
  const user = utils.getCurrentUser() || {}
  const token = utils.getCurrentToken() || ''
  const url = `https://api.github.com/search/issues?q=+type:pr+author:${user.login || ''}+is:${filter}`
  if (!token) {
    return onError(new Error('使用此功能, 请先登录'))
  }
  const params = {
    url: url,
    _: new Date(),
    token: token
  }
  Bmob.functions('proxy', params).then(function(res) {
    console.log(res)
    if (res.statusCode !== 200) {
      return onError(new Error(data.message))
    }
    const data = JSON.parse(res.body)
    const pulls = data.items.map(it => {
      it.created_at = utils.toReadableTime(it.created_at)
      it.updated_at = utils.toReadableTime(it.updated_at)
      return it
    })
    return onSuccess(pulls)
  }).catch(function(error) {
    console.log(error);
    errorHandler()
  })
}

let getIssue = (url, onSuccess, onError) => {
  const token = utils.getCurrentToken() || ''
  const params = {
    url: url,
    _: new Date(),
    token: token
  }
  Bmob.functions('proxy', params).then(function(res) {
    console.log(res)
    if (res.statusCode !== 200) {
      return onError(new Error(data.message))
    }
    const issue = JSON.parse(res.body)
    issue.updated_at = utils.toReadableTime(issue.updated_at)
    issue.created_at = utils.toReadableTime(issue.created_at)
    return onSuccess(issue)
  }).catch(function(error) {
    console.log(error);
    errorHandler()
  })
}

let getTrends = (since, lang, onSuccess, onError) => {
  const params = {
    since: since,
    lang: lang
  }
  Bmob.functions('trend', params).then(function(res) {
    console.log(res)
    if (res.statusCode !== 200) {
      return onError(new Error(data.message))
    }
    const trends = JSON.parse(res.body).map(it => {
      it.stargazers_count = it.stars
      it.full_name = `${it.author}/${it.name}`
      return it
    })
    return onSuccess(trends)
  }).catch(function(error) {
    console.log(error);
    errorHandler()
  })
}

let getComments = (url, onSuccess, onError) => {
  const token = utils.getCurrentToken() || ''
  const params = {
    url: url,
    _: new Date(),
    token: token
  }
  Bmob.functions('proxy', params).then(function(res) {
    console.log(res)
    if (res.statusCode !== 200) {
      return onError(new Error(data.message))
    }
    const comments = JSON.parse(res.body)
    comments.forEach(comment => {
      comment.updated_at = utils.toReadableTime(comment.updated_at)
      comment.created_at = utils.toReadableTime(comment.created_at)
    })
    const headers = res.headers
    const links = utils.parseLinks(headers.link || "")
    return onSuccess({
      comments,
      links
    })
  }).catch(function(error) {
    console.log(error)
    errorHandler()
    onError(error)
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
  getUser
}