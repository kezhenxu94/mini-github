module.exports = Behavior({
  data: {
    theme: wx.getStorageSync('theme')
  },

  created: function () {
    const theme = this.data.theme
    this.updateTheme(theme)
  },

  methods: {

    onShow: function () {
      wx.getStorage({
        key: 'theme',
        success: res => {
          const theme = res.data
          if (theme !== this.data.theme) {
            this.setData({ theme })
            this.updateTheme(theme)
          }
        },
      })
    },
    
    updateTheme(theme) {
      switch (theme) {
        case 'oled': {
          wx.setTabBarStyle({
            backgroundColor: '#000000',
            color: '#ffffff',
            selectedColor: '#ffffff',
            borderStyle: 'white'
          })
          wx.setBackgroundColor({
            backgroundColor: '#000000',
            backgroundColorTop: '#000000',
            backgroundColorBottom: '#000000'
          })
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#000000'
          })
          wx.setBackgroundTextStyle({
            textStyle: 'light'
          })
          break
        }
        case 'light': {
          wx.setTabBarStyle({
            backgroundColor: '#ffffff',
            color: '#000000',
            selectedColor: '#000000',
            borderStyle: 'black'
          })
          wx.setBackgroundColor({
            backgroundColor: '#ffffff',
            backgroundColorTop: '#ffffff',
            backgroundColorBottom: '#ffffff'
          })
          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff'
          })
          wx.setBackgroundTextStyle({
            textStyle: 'dark'
          })
          break
        }
        case 'dark': {
          wx.setTabBarStyle({
            backgroundColor: '#24292e',
            color: '#ffffff',
            selectedColor: '#ffffff',
            borderStyle: 'white'
          })
          wx.setBackgroundColor({
            backgroundColor: '#24292e',
            backgroundColorTop: '#24292e',
            backgroundColorBottom: '#24292e'
          })
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#24292e'
          })
          wx.setBackgroundTextStyle({
            textStyle: 'light'
          })
          break
        }
      }
    }
  }
});