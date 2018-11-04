const github = require('../../api/github.js')

Component({
  properties: {
    user: {
      type: Object,
      value: {}
    }
  },
  methods: {
    onTapEmail: function() {
      this.copyToClipBoard(this.data.user.email)
    },

    onTapBlog: function() {
      this.copyToClipBoard(this.data.user.blog)
    },

    copyToClipBoard: function(content) {
      wx.setClipboardData({
        data: content,
        success(res) {
          wx.getClipboardData()
        }
      })
    },

    toFollowers: function() {
      const username = this.data.user.login
      wx.navigateTo({
        url: `/pages/user-list/user-list?username=${username}&followers=true`,
      })
    },

    toFollowing: function () {
      const username = this.data.user.login
      wx.navigateTo({
        url: `/pages/user-list/user-list?username=${username}&following=true`,
      })
    }
  }
})