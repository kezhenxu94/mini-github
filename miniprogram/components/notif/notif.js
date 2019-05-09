const theming = require('../../behaviours/theming.js')

Component({
  behaviors: [theming],

  properties: {
    notification: {
      type: Object,
      value: {}
    }
  },

  data: {

  },

  methods: {
    unsubscribe: function (event) {

    },
    markAsRead: function (event) {}
  }
})
