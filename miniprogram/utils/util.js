const moment = require('../lib/moment.js')

const getCurrentUser = () => wx.getStorageSync('user')

const getCurrentToken = () => (getCurrentUser() || {}).token || wx.getStorageSync('token')

const isSignedIn = () => getCurrentToken() && getCurrentUser().plan

const extractRepoName = (repo_url) => repo_url.replace(/^https:\/\/api.github.com\/repos\/(.*?\/.*?)(\/.*)?$/, '$1')

const extractIssueNumber = issueUrl => issueUrl.replace(/^https:\/\/api.github.com\/repos\/.*\/issues\/(\d+)$/, '$1')

const parseGitHubUrl = url => {
  let m = url.match(/https?:\/\/github\.com\/([^/]+)\/?([^/]+)?(\/(issues|pulls?)\/(\d+))?/)

  if (m && m.length > 0) {
    const owner = m[1]
    const repo = m[2]
    const issueNumber = m[5]
    return {
      owner, repo, issueNumber
    }
  }

  m = url.match(/https?:\/\/api\.github\.com\/repos\/([^/]+)\/?([^/]+)?(\/(issues|pulls?)\/(\d+))?/)

  if (m && m.length > 0) {
    const owner = m[1]
    const repo = m[2]
    const issueNumber = m[5]
    return {
      owner, repo, issueNumber
    }
  }
}

const toReadableTime = time => {
  let then = moment(time)
  let now = moment()
  if (now.diff(then, 'days') <= 7) {
    return then.fromNow()
  }
  return then.format('YYYY/MM/DD')
}

const parseLinks = (header) => {
  if (header.length == 0) {
    return {}
  }
  const links = {}

  const parts = header.split(',')
  parts.map(p => {
    const section = p.split(';')
    if (section.length != 2) {
      throw new Error("section could not be split on ';'")
    }
    const url = section[0].replace(/<(.*)>/, '$1').trim()
    const name = section[1].replace(/<(.*)>/, '$1').trim()

    links[name] = url
  })

  return links
}

const ensureSignedIn = () => {
  if (isSignedIn()) return true

  wx.showModal({
    title: '请先登录',
    content: '此功能需要登陆, 是否先去登陆',
    confirmText: '先去登陆',
    cancelText: '暂不登陆',
    success(res) {
      if (res.confirm) {
        wx.navigateTo({
          url: '/pages/login/login',
        })
      }
    }
  })
  return false
}

const asEvent = (object = {}) => {
  try {
    object.created_at = toReadableTime(object.created_at)
    object.org = {}
    object.actor = {
      login: object.actor.login,
      display_login: object.actor.display_login,
      avatar_url: object.actor.avatar_url + 's=50'
    }
  } catch (error) {
    console.error(error)
  }
  return object
}


module.exports = {
  getCurrentUser,
  getCurrentToken,
  isSignedIn,
  parseLinks,
  toReadableTime,
  extractRepoName,
  extractIssueNumber,
  ensureSignedIn,
  asEvent,
  parseGitHubUrl
}