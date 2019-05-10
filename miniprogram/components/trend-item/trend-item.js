const notifUtils = require('../../utils/notifications.js')

Component({
  properties: {
    repo: {
      type: Object,
      value: {}
    },
    theme: String
  },

  methods: {
    toUserPage: function (event) {
      const username = event.currentTarget.dataset.username
      wx.navigateTo({
        url: `/pages/user/user?username=${username}`
      })
    },
    formSubmit: function(e) {
      const formId = e.detail.formId
      const repo = this.data.repo.full_name

      notifUtils.report({
        formId,
        enabled: true,
        extra: { repo }
      })

      wx.navigateTo({
        url: `/pages/repo-detail/repo-detail?repo=${repo}`,
      })
    }
  }
})