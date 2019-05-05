const WxParse = require('../../lib/wxParse/wxParse.js');

Component({
  properties: {
    placebolder: {
      type: String,
      value: 'Leave a comment'
    },
    defaultContent: {
      type: String,
      value: '',
      observer: function (dc) {
        if (dc) {
          this.setData({
            content: dc
          })
        }
      }
    }
  },

  data: {
    content: ''
  },

  methods: {
    updateContent: function (e) {
      this.setData({
        content: e.detail.value
      })
    },

    preview: function (e) {
      const content = this.data.content
      WxParse.wxParse('article', 'md', content + '\n\n', this, 5)
    },

    submit: function (e) {
      const content = this.data.content
      this.triggerEvent('submit', { content })
    }
  }
})
