Component({
  properties: {
    contributor: {
      type: Object,
      value: {}
    }
  },

  data: {

  },

  methods: {
    toUserDetail: function () {
      const username = this.data.contributor.login
      wx.navigateTo({
        url: `/pages/user/user?username=${username}`
      })
    }
  }
})
