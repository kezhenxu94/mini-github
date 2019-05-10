const http = require('../../api/http.js')

let url = null
let path = null
let title = null
let baseUrl = null

const theming = require('../../behaviours/theming.js')

Component({
  behaviors: [theming],

  data: {
    md: {}
  },


  methods: {

    onLoad: function (options) {
      url = decodeURIComponent(options.url)
      title = url.replace(/.*?([^/]+\.md)$/i, '$1')
      wx.setNavigationBarTitle({
        title
      })
      path = encodeURIComponent(title)
      baseUrl = url.replace(/([^/]+\.[mM][dD])$/, '')
      wx.startPullDownRefresh({})
    },

    onPullDownRefresh: function () {
      if (!url) {
        return wx.stopPullDownRefresh()
      }

      http.get(`${baseUrl}/${path}`).then(({ data, status }) => {
        wx.stopPullDownRefresh()
        if (status !== 200) {
          wx.showToast({
            title: String(status),
            icon: 'none'
          })
          return
        }
        this.setData({
          md: {
            content: data,
            baseUrl: baseUrl
          }
        })
      })
    },

    onShareAppMessage: function () {
      return {
        title,
        url
      }
    }
  }
})