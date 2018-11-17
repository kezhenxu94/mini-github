Component({
  properties: {
    issue: {
      type: Object,
      value: {}
    }
  },

  data: {},

  methods: {
    toIssueDetail: function(event) {
      var issue = this.data.issue
      var url = issue.url
      wx.navigateTo({
        url: '/pages/issue-detail/issue-detail?url=' + url
      })
    }
  }
})