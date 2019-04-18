const http = require('../api/http.js')
const pageable = require('../api/pageable.js')
const user = require('user/index.js')
const users = require('users/index.js')
const repos = require('repos/index.js')
const search = require('search/index.js')
const notifications = require('notifications/index.js')

const utils = require('../utils/util.js')

function errorHandler() {
  wx.showToast({
    title: '网络异常, 稍后再试',
    icon: 'none'
  })
}

const token = () => utils.getCurrentToken() || ''

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

const events = () => ({
  get: () => {
    const promise = http.get('https://api.github.com/events')
    return pageable.wrap(promise)
  }
})

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
    resolve({
      repo
    })
  }).catch(error => {
    console.log(error)
    errorHandler()
    reject(error)
  })
})

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
  getIssue,
  trendings,
  getRepo,
  getComments,
  events,
  users,
  user,
  repos,
  search,
  notifications
}