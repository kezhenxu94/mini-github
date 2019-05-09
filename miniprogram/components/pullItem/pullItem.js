const notifUtils = require('../../utils/notifications.js')

const theming = require('../../behaviours/theming.js')

Component({
  behaviors: [theming],

  properties: {
    pull: {
      type: Object,
      value: {}
    }
  },

  data: {},

  methods: {
    toPullDetail: function (event) {
      const formId = event.detail.formId
      const pull = this.data.pull

      notifUtils.report({
        formId,
        enabled: true,
        extra: { pull }
      })

      wx.navigateTo({
        url: `/pages/issue-detail/issue-detail?url=${pull.url}`
      })
    }
  }
})