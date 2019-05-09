const github = require('../../api/github.js')
const utils = require('../../utils/util.js')

Component({
  data: {
    activeNames: [],
    notifications: [],
    loading: null,
    watchingRepos: [],
    notifications: {
      all: [],
      unread: [],
      participating: []
    },
    theme: wx.getStorageSync('theme')
  },
  properties: {
    theme: String
  },
  methods: {
    onChange(event) {
      const name = event.detail
      const params = {}
      this.setData({
        activeNames: name,
        loading: name
      })
      params.all = name === "All"
      params.participating = name === "Participating"
      if (['All', 'Unread', 'Participating'].indexOf(name) >= 0) {
        github.notifications().get(params).then(({ notifications }) => {
          if (notifications && notifications.length > 0) {
            notifications.forEach(it => {
              it.updated_at = utils.toReadableTime(it.updated_at)
            })
          }
          const nn = this.data.notifications
          nn[name.toLowerCase()] = notifications
          this.setData({
            notifications: nn,
            loading: 'none'
          })
        })
      } else {
        github.repos(name).notifications().then(notifications => {
          if (notifications && notifications.length > 0) {
            notifications.forEach(it => {
              it.updated_at = utils.toReadableTime(it.updated_at)
            })
          }
          const nn = this.data.notifications
          nn[name.toLowerCase()] = notifications
          this.setData({
            notifications: nn,
            loading: 'none'
          })
        })
      }
    },
    loadWatchingRepos () {
      github.user().subscriptions().then(repos => {
        const sorted = repos.sort((a, b) => a.updated_at > b.updated_at ? -1 : 1)
        this.setData({
          watchingRepos: repos
        })
      })
    }
  },
  lifetimes: {
    created () {
      this.loadWatchingRepos()
    }
  },
  created () {
    this.loadWatchingRepos()
  }
})