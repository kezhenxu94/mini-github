const WxParse = require('../../lib/wxParse/wxParse.js')

Component({
  properties: {
    comment: {
      type: Object,
      value: {},
      observer: function (comment) {
        if (comment.body) {
          WxParse.wxParse('article', 'md', comment.body, this)
          this.setData({ loaded: true })
        }
      }
    }
  },
  data: {
    loaded: false
  }
})
