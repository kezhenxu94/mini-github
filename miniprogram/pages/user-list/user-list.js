const github = require('../../api/github.js')
const theming = require('../../behaviours/theming.js')

Component({
  behaviors: [theming],

  data: {
    username: undefined,
    users: []
  },

  methods: {

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
      github.users(username).followers().then(({ followers }) => {
        this.setData({
          users: followers.map(it => {
            it.avatar_url += '&s=50'
            return it
          })
        })
        wx.hideNavigationBarLoading({})
      }).catch(error => wx.hideNavigationBarLoading({}))
    },

    loadFollowing: function() {
      const {
        username
      } = this.data
      wx.showNavigationBarLoading({})
      github.users(username).following().then(({ following }) => {
        this.setData({
          users: following.map(it => {
            it.avatar_url += '&s=50'
            return it
          })
        })
        wx.hideNavigationBarLoading({})
      }).catch(error => wx.hideNavigationBarLoading({}))
    }
  }
})