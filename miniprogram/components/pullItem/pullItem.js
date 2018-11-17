Component({
  properties: {
    pull: {
      type: Object,
      value: {}
    }
  },

  data: {},

  methods: {
    toPullDetail: function() {
      const url = this.data.pull.url
      wx.navigateTo({
        url: '/pages/issue-detail/issue-detail?url=' + url
      })
    }
  }
})