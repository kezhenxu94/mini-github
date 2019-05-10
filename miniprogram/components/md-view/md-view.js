const WxParse = require('../../lib/wxParse/wxParse.js');

Component({
  properties: {
    md: {
      type: Object,
      value: {
        content: '',
        baseUrl: '',
      },
      observer: function (md) {
        if (md) {
          const { content = '', baseUrl = '' } = md
          WxParse.wxParse('article', 'md', content + '\n\n', this, 5, baseUrl)
          this.setData({
            loaded: true
          })
        }
      }
    },
    customClass: String
  },
  
  data: {
    loaded: false
  },

  data: {
    loaded: false
  },
  
  data: {
    loaded: false
  },

  data: {
    loaded: false
  },

  methods: {
    wxParseTagATap: function (event) {
      const url = event.currentTarget.dataset.src

      if (/^#/.test(url)) {
        return wx.showToast({
          title: '暂不支持页内锚点滚动',
          icon: 'none'
        })
      }

      if (/^https?:\/\/.+\.md$/i.test(url)) {
        return wx.navigateTo({
          url: `/pages/md/md?url=${url}`
        })
      }

      if (/\.md$/i.test(url)) {
        return wx.navigateTo({
          url: `/pages/md/md?url=${this.data.md.baseUrl}/${url}`
        })
      }

      const repoRegExp = /^https:\/\/(api.)?github.com\/(.*?\/.*?)(\/.*)?$/i
      if (repoRegExp.test(url)) {
        const repoFullName = url.replace(repoRegExp, '$2')
        const repoUrl = `/pages/repo-detail/repo-detail?repo=${repoFullName}`
        return wx.navigateTo({
          url: repoUrl,
        })
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
