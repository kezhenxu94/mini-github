const {
  state
} = require('../../pages/store/index.js');

const Api = {
  request(options) {
    return new Promise((resolve, reject) => {
      const params = {
        success: function (res) {
          if (res.data && (!res.data.errno || res.data.errno === 0)) {
            resolve(res);
          } else {
            reject(res);
          }
        },
        fail: reject
      };
      if (options.url && options.url.match(state.domain)) {
        const cookie = wx.getStorageSync('cookie');
        params.header = {
          cookie,
        };
      }
      for (const key in options) {
        if (!key.match(/success|fail|complete/gi)) {
          params[key] = options[key];
        }
      }
      wx.request(params);
    })
  },
  downloadFile(options) {
    return new Promise((resolve, reject) => {
      const params = {
        success: resolve,
        fail: reject
      };
      for (const key in options) {
        if (!key.match(/success|fail|complete/gi)) {
          params[key] = options[key];
        }
      }
      wx.downloadFile(params);
    })
  },
  saveFile(options) {
    return new Promise((resolve, reject) => {
      const params = {
        success: resolve,
        fail: reject
      };
      for (const key in options) {
        if (!key.match(/success|fail|complete/gi)) {
          params[key] = options[key];
        }
      }
      wx.saveFile(params);
    })
  },
  proxy(apiName, options) {
    return new Promise((resolve, reject) => {
      const params = {
        success: resolve,
        fail: reject
      };
      for (const key in options) {
        if (!key.match(/success|fail|complete/gi)) {
          params[key] = options[key];
        }
      }
      wx[apiName](params);
    })
  }
};

module.exports = Api;