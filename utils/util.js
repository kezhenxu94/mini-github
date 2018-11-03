const getCurrentUser = () => wx.getStorageSync('user')

const getCurrentToken = () => (getCurrentUser() || {}).token

const isSignedIn = () => getCurrentToken() != undefined

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
  getCurrentUser,
  getCurrentToken,
  isSignedIn,
  parseLinks
}
