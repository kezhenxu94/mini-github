const WxParse = require('../../lib/wxParse/wxParse.js');

Component({
  properties: {
    md: {
      type: Object,
      value: {
        content: '',
        baseUrl: '',
      },
      observer: function ({ content = '', baseUrl }) {
        WxParse.wxParse('article', 'md', content + '\n\n', this, 5, baseUrl);
      }
    }
  },

  data: {
  },

  methods: {
    wxParseTagATap: function (event) {
      const url = event.currentTarget.dataset.src
      if (/^https?:\/\/.+\.md$/.test(url)) {
        wx.navigateTo({
          url: `/pages/md/md?url=${url}`
        })
        return
      }
      if (/\.md$/.test(url)) {
        wx.navigateTo({
          url: `/pages/md/md?url=${this.data.md.baseUrl}/${url}`
        })
        return
      }
      const repoRegExp = /^https:\/\/(api.)?github.com\/(.*?\/.*?)(\/.*)?$/
      if (repoRegExp.test(url)) {
        const repoFullName = url.replace(repoRegExp, '$2')
        const repoUrl = `/pages/repo-detail/repo-detail?repo=${repoFullName}`
        wx.navigateTo({
          url: repoUrl,
        })
        return
      }
      wx.setClipboardData({
        data: url,
        success() {
          wx.showToast({
            title: '链接已复制',
            duration: 2000,
          })
        },
      })
    }
  }
})
