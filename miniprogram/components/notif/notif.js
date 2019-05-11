const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

Component({
  properties: {
    notification: {
      type: Object,
      value: {}
    },
    theme: String
  },

  data: {
    iconUrl: ""
  },

  lifetimes: {
    attached() {
      this.setData({
        iconUrl: this.getIconUrl(this.data.notification)
      })
    }
  },

  methods: {
    unsubscribe: function (event) {

    },
    markAsRead: function (event) {},
    getIconUrl: function(notification) {
      const themeFolder = utils.iconFolder(this.data.theme);
      switch (notification.subject.type) {
        case 'PullRequest':
          return themeFolder + '/git-pull-request.svg'
        case 'Issue':
          return themeFolder + '/issue-opened.svg'
        case 'Commit':
          return themeFolder + '/git-commit.svg'
        case 'RepositoryVulnerabilityAlert':
          return themeFolder + '/alert.svg'
        case 'RepositoryInvitation':
          return themeFolder + '/mail.svg'
        default:
          return themeFolder + '/issue-opened.svg'
      }
    }
  },
})
