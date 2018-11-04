Component({
  properties: {
    user: {
      type: Object,
      value: {}
    }
  },
  data: {

  },
  methods: {
    onTapEmail: function() {
      this.copyToClipBoard(this.data.user.email)
    },

    onTapBlog: function() {
      this.copyToClipBoard(this.data.user.blog)
    },

    copyToClipBoard: function(content) {
      wx.setClipboardData({
        data: content,
        success(res) {
          wx.getClipboardData()
        }
      })
    }
  }
})