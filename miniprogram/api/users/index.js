const http = require('../http.js')
const util = require('../../utils/util.js')

const token = () => utils.getCurrentToken() || ''

function asRepository(object = {}) {
  object.created_at = util.toReadableTime(object.created_at)
  return object
}

function asEvent(object = {}) {
  object.created_at = util.toReadableTime(object.created_at)
  object.org = {}
  object.actor = {
    login: object.actor.login,
    display_login: object.actor.display_login,
    avatar_url: object.actor.avatar_url + 's=50'
  }
  return object
}

function getEventsByUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url).then(({ status, headers, data }) => {
      if (status !== 200) reject(new Error(data))
      const events = data.map(it => asEvent(it))
      const links = util.parseLinks(headers.link || "")
      const nextUrl = links['rel="next"']
      if (nextUrl) {
        resolve({
          events,
          next: () => getEventsByUrl(nextUrl)
        })
      } else {
        resolve({ events, next: null })
      }
    }).catch(error => reject(error))
  })
}

function getReposByUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url).then(({ status, headers, data }) => {
      if (status !== 200) reject(new Error(data))
      const repos = data.map(it => asRepository(it))
      const links = util.parseLinks(headers.link || "")
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

const users = (username) => {
  return {
    repos: () => {
      const url = `https://api.github.com/users/${username}/repos`
      return getReposByUrl(url)
    },
    starred: () => {
      const url = `https://api.github.com/users/${username}/starred`
      return getReposByUrl(url)
    },
    receivedEvents: () => {
      const url = `https://api.github.com/users/${username}/received_events`
      return getEventsByUrl(url)
    },
    followers: () => new Promise((resolve, reject) => {
      const url = `https://api.github.com/users/${username}/followers`
      http.get(url).then(({ status, headers, data }) => {
        if (status !== 200) reject(new Error(data))
        resolve({ followers: data })
      }).catch(error => reject(error))
    }),
    following: () => new Promise((resolve, reject) => {
      const url = `https://api.github.com/users/${username}/following`
      http.get(url).then(({ status, headers, data }) => {
        if (status !== 200) reject(new Error(data))
        resolve({ following: data })
      }).catch(error => reject(error))
    }),
    end: () => new Promise((resolve, reject) => {
      const url = `https://api.github.com/users/${username}`
      http.get(url).then(({ status, headers, data }) => {
        if (status !== 200) reject(new Error(data))
        const user = data
        user.created_at = util.toReadableTime(user.created_at)
        resolve(user)
      }).catch(error => reject(error))
    })
  }
}

module.exports = users