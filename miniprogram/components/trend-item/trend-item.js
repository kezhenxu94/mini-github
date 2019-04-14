Component({
  properties: {
    repo: {
      type: Object,
      value: {}
    }
  },

  data: {
  },

  methods: {
    toUserPage: function (event) {
      const username = event.currentTarget.dataset.username
      wx.navigateTo({
        url: `/pages/user/user?username=${username}`
      })
    }
  }
})