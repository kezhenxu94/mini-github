const github = require('../api/github.js')

const signIn = token => new Promise((resolve, reject) => {
  wx.setStorageSync('token', token)
  github.user().get().then(user => {
    wx.setStorage({
      key: 'user',
      data: user
    })

    resolve({ token, user })
  }).catch(reject)
})

module.exports = {
  signIn
}