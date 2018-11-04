const github = require('../../api/github.js')

Page({
  data: {
    username: undefined,
    users: []
  },

  onLoad: function(options) {
    const username = options.username
    const followers = options.followers
    const following = options.following
    this.setData({
      username
    })
    if (followers) {
      wx.setNavigationBarTitle({
        title: 'Followers'
      })
      this.loadFollowers()
    } else if (following) {
      wx.setNavigationBarTitle({
        title: 'Following'
      })
      this.loadFollowing()
    }
  },

  onReachBottom: function() {

  },

  loadFollowers: function() {
    const {
      username
    } = this.data
    wx.showNavigationBarLoading({})
    github.getFollowers(username).then(followers => {
      this.setData({
        users: followers
      })
      wx.hideNavigationBarLoading({})
    }).catch(error => wx.hideNavigationBarLoading({}))
  },

  loadFollowing: function() {
    const {
      username
    } = this.data
    wx.showNavigationBarLoading({})
    github.getFollowing(username).then(following => {
      this.setData({
        users: following
      })
      wx.hideNavigationBarLoading({})
    }).catch(error => wx.hideNavigationBarLoading({}))
  }
})