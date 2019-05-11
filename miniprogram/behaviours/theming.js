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
          setDarkTabBarItems()
          break
        }
        case 'light': {
          wx.setTabBarStyle({
            backgroundColor: '#ffffff',
            color: '#000000',
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
          setLightTabBarItems()
          break
        }
        case 'dark': {
          wx.setTabBarStyle({
            backgroundColor: '#24292e',
            color: '#ffffff',
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
          setDarkTabBarItems()
          break
        }
      }
    }
  }
});

function setDarkTabBarItems() {
  wx.setTabBarItem({
    index: 0,
    iconPath: 'octicons/tab/dark/github.png',
  })
  wx.setTabBarItem({
    index: 1,
    iconPath: 'octicons/tab/dark/issue.png',
  })
  wx.setTabBarItem({
    index: 2,
    iconPath: 'octicons/tab/dark/flame.png',
  })
  wx.setTabBarItem({
    index: 3,
    iconPath: 'octicons/tab/dark/pr.png',
  })
  wx.setTabBarItem({
    index: 4,
    iconPath: 'octicons/tab/dark/account.png',
  })
}

function setLightTabBarItems() {
  wx.setTabBarItem({
    index: 0,
    iconPath: 'octicons/tab/light/github.png',
  })
  wx.setTabBarItem({
    index: 1,
    iconPath: 'octicons/tab/light/issue.png',
  })
  wx.setTabBarItem({
    index: 2,
    iconPath: 'octicons/tab/light/flame.png',
  })
  wx.setTabBarItem({
    index: 3,
    iconPath: 'octicons/tab/light/pr.png',
  })
  wx.setTabBarItem({
    index: 4,
    iconPath: 'octicons/tab/light/account.png',
  })
}