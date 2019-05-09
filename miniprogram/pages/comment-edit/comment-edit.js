const github = require('../../api/github.js')
const utils = require('../../utils/util.js')
const computedBehavior = require('../../lib/computed.js')

const theming = require('../../behaviours/theming.js');

Component({
  behaviors: [computedBehavior, theming],

  properties: {
    repo: {
      type: String,
      value: 'kezhenxu94/mini-github'
    },
    number: {
      type: Number,
      value: 23
    },
    mention: {
      type: String,
      value: null
    }
  },

  data: {
  },

  methods: {

    onLoad: function (options) {

    },

    submit: function (e) {
      const url = this.data.url
      const { content } = e.detail
      const { repo, number } = this.data
      wx.showLoading({
        title: 'Posting'
      })
      github.repos(repo).issues(number).comments().post(content).then(success => {
        wx.hideLoading()
        if (success) {
          wx.showToast({
            title: 'Posted'
          })
          wx.navigateBack({})
        } else {
          wx.showToast({
            title: 'Failed',
            icon: 'none'
          })
        }
      }).catch(error => {
        wx.hideLoading()
        wx.showToast({
          title: error.message,
          icon: 'none'
        })
      })
    }
  }
})