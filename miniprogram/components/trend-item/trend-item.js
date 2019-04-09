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
    toRepoDetail: function() {
      var repo = this.data.repo
      var url = `/pages/repo-detail/repo-detail?url=https://api.github.com/repos/${repo.full_name}`
      wx.navigateTo({
        url
      })
    },
    toUserPage: function (event) {
      const username = event.currentTarget.dataset.username
      wx.navigateTo({
        url: `/pages/user/user?username=${username}`
      })
    }
  }
})