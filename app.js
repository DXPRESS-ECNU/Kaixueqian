//app.js
App({
  onLaunch: function () {
    // Download CONFIG file
    var fs = wx.getFileSystemManager()
    wx.downloadFile({
      url:  this.globalData.URL_PREFIX + 'config.json',
      success: res => {
        console.log(res.tempFilePath)
        this.globalData.CONFIG = JSON.parse(fs.readFileSync(res.tempFilePath, "utf8").toString())
        console.log(this.globalData.CONFIG)
        if (this.downloadConfigCallback){
          this.downloadConfigCallback()
        }
      },
      fail: console.error
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    URL_PREFIX: "https://miniprogram-1301390525.file.myqcloud.com/Kaixueqian/",
    CONFIG : null,
    INDEX: null
  }
})