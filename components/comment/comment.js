const WxParse = require('../../lib/wxParse/wxParse.js')

Component({
  properties: {
    comment: {
      type: Object,
      value: {},
      observer: function(comment) {
        if (comment.body) {
          WxParse.wxParse('article', 'md', comment.body, this)
          this.setData({
            loaded: true
          })
        }
      }
    }
  },
  data: {
    loaded: false
  },
  methods: {
    wxParseTagATap: function(event) {
      const url = event.currentTarget.dataset.src
      wx.setClipboardData({
        data: url,
      })
    },

    toUserPage: function () {
      const username = this.data.comment.user.login
      wx.navigateTo({
        url: `/pages/user/user?username=${username}`
      })
    }
  }
})