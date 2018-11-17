Component({
  properties: {
    user: {
      type: Object,
      value: {}
    }
  },

  data: {
  },

  methods: {
    toUserDetail: function () {
      const username = this.data.user.login
      wx.navigateTo({
        url: `/pages/user/user?username=${username}`
      })
    }
  }
})
