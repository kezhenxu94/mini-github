const moment = require('../lib/moment.js')

const getCurrentUser = () => wx.getStorageSync('user')

const getCurrentToken = () => (getCurrentUser() || {}).token

const isSignedIn = () => getCurrentToken() != undefined

const extractRepoName = (repo_url) => repo_url.replace(/https:\/\/api.github.com\/repos\//, '')

const toReadableTime = (time) => {
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

  return links;
}

module.exports = {
  getCurrentUser,
  getCurrentToken,
  isSignedIn,
  parseLinks,
  toReadableTime,
  extractRepoName
}
