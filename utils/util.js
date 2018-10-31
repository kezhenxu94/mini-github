const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const getCurrentUser = () => {
  let user = wx.getStorageSync('user')
  return user
}

module.exports = {
  formatTime: formatTime,
  getCurrentUser: getCurrentUser
}
