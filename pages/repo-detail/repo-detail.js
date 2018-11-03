const github = require('../../api/github.js')
const utils = require('../../utils/util.js')
const WxParse = require('../../lib/wxParse/wxParse.js')

Page({
  data: {
    url: undefined,
    repo: {}
  },

  onLoad: function (options) {
    var url = options.url
    this.setData({ url })
    this.reloadData()
  },

  onShareAppMessage: function () {

  },

  tryGetReadMe: function (repo, complete) {
    let readMeUrl = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/README.md`

    github.getFile(readMeUrl, readMeContent => {
      WxParse.wxParse('article', 'md', readMeContent, this)
      complete()
    }, error => {
      readMeUrl = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/readme.md`
      github.getFile(readMeUrl, readMeContent => {
        WxParse.wxParse('article', 'md', readMeContent, this)
        complete()
      }, error => complete())
    })
  },

  reloadData: function () {
    wx.showNavigationBarLoading({})
    github.getRepo(this.data.url, res => {
      const { repo } = res
      this.setData({ repo })
      this.tryGetReadMe(repo, () => wx.hideNavigationBarLoading({}))
    }, error => wx.hideNavigationBarLoading({}))
  }
})