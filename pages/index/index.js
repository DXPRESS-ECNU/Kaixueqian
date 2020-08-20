//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    CONFIG: {},
    URL_PREFIX: null,
    choose: null,
    shareJson: null,
    exportbtnMode: 1
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    app.globalData.INDEX = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (app.globalData.CONFIG) {
      this.setData({
        CONFIG: app.globalData.CONFIG,
        URL_PREFIX: app.globalData.URL_PREFIX
      })
    } else {
      app.downloadConfigCallback = () => {
        this.setData({
          CONFIG: app.globalData.CONFIG,
          URL_PREFIX: app.globalData.URL_PREFIX
        })
      }
    }
    wx.onUserCaptureScreen((res) => {
      if (this.data.choose) {
        wx.showToast({
          title: '点击分享图片可以包含你的头像哦',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      this.bindExport()
    }
  },
  bindGetTicket: function(event) {
    var id = event.currentTarget.dataset.index
    var items = this.data.CONFIG[id].items
    var choose = items[Math.floor(Math.random() * items.length)]
    this.shareJson = this.data.CONFIG[id].share
    this.setData({
      choose : encodeURI(choose)
    })
    console.log(this.data.choose)
    console.log(this.data.outputConfig)
  },
  bindReChoose: function() {
    this.setData({
      exportbtnMode: 1,
      outputConfig: null,
      choose: null
    })
  },
  openSetting() {
    wx.openSetting();
    this.setData({
      exportbtnMode: 1,
      isauth: true
    });
  },
  bindExport: function() {
    console.info(this.data.userInfo)
    this.shareJson = JSON.parse(JSON.stringify(this.shareJson).replace("{{background}}", this.data.URL_PREFIX + this.data.choose).replace("{{avatar}}", this.data.userInfo.avatarUrl).replace("{{nickname}}", this.data.userInfo.nickName))
    this.setData({
      shareJson: this.shareJson
    })
  },
  bindSaveImage: function(event) {
    console.log(event)

    wx.saveImageToPhotosAlbum({
      filePath: event.detail.path,
      success() {
        console.log("Saved")
        app.globalData.INDEX.setData({
          exportbtnMode: 2
        })
      },
      fail(res) {
        console.log(res.errMsg)
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']) {
              app.globalData.INDEX.setData({
                exportbtnMode: 3
              })
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  app.globalData.INDEX.setData({
                    exportbtnMode: 1
                  })
                },
                fail() {
                  console.error("Authorization Failed")
                  app.globalData.INDEX.setData({
                    exportbtnMode: 3
                  })
                }
              })
            }
          }
        })
      }
    })

  }
})