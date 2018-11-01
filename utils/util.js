const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const getCurrentUser = () => {
  let user = wx.getStorageSync('user')
  return user
}

const isSignedIn = () => wx.getStorageSync('user') != undefined && wx.getStorageSync('user').token != undefined

const parseLinks = (header) => {
  if (header.length == 0) {
    throw new Error("input must not be of zero length")
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
  formatTime: formatTime,
  getCurrentUser: getCurrentUser,
  isSignedIn: isSignedIn,
  parseLinks: parseLinks
}
