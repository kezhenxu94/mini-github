const notificationUtils = require('../../utils/notifications.js')
const theming = require('../../behaviours/theming.js')

Component({
  behaviors: [theming],

  data: {
    enableNotification: false
  },

  methods: {
    onShareAppMessage: function() {

    },

    onChangeNotification: function(e) {
      this.setData({
        enableNotification: e.detail
      })
    },

    formSubmit: function(e) {
      const enableNotification = this.data.enableNotification
      const formId = e.detail.formId

      notificationUtils.report({
        formId,
        extra: {
          settings: {
            enableNotification
          }
        }
      })
    },

    logout: function (e) {
      const formId = e.detail.formId

      notificationUtils.report({ formId })

      wx.showModal({
        title: '确认退出',
        content: '确认退出登陆状态吗? 退出后无法查看自己关注的事件, Issue, Pull Request; 也无法进行交互类型的操作(Star, Watch, Fork, Follow等)',
        success: function (res) {
          if (res.confirm) {
            wx.clearStorageSync()
            wx.reLaunch({
              url: '/pages/me/me'
            })
          }
        }
      })
    },

    about: function (e) {
      const formId = e.detail.formId

      notificationUtils.report({ formId })

      wx.navigateTo({
        url: '/pages/about/about'
      })
    },

    feedback: function (e) {
      const formId = e.detail.formId

      notificationUtils.report({ formId })

      wx.previewImage({
        urls: ['cloud://github-production.6769-github-production/kezhenxu94.jpg']
      })
    },

    changeTheme: function (e) {
      const formId = e.detail.formId

      notificationUtils.report({ formId })

      const themes = ['Light', 'Dark', 'Black']

      wx.showActionSheet({
        itemList: themes,
        success: res => {
          let theme = null
          switch (res.tapIndex) {
            case 0:
              theme = 'light'
              break;
            case 1:
              theme = 'dark'
              break
            case 2:
              theme = 'oled'
              break
          }
          wx.setStorageSync('theme', theme)
          this.setData({ theme })
          this.updateTheme(theme)

          wx.showModal({
            content: '改变主题后如果遇到主题颜色不一致的情况, 请完全退出小程序再重新进入',
            showCancel: false,
            confirmText: '我知道了'
          })
        },
        fail: res => {
        }
      })
    }
  }
})