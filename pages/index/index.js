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
    outputConfig: {},
    isauth: true,
    exportbtnDis: false,
    exportbtnText: "分享图片"
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
    this.setData({
      choose,
      outputConfig: {
        avatarposi: this.data.CONFIG[id].avatarposi,
        nicknameposi: this.data.CONFIG[id].nicknameposi
      }
    })
    console.log(this.data.choose)
    console.log(this.data.outputConfig)
  },
  bindReChoose: function() {
    this.setData({
      choose: null
    })
  },
  openSetting() {
    wx.openSetting();
    this.setData({
      exportbtnDis: false,
      exportbtnText: "分享图片",
      isauth: true
    });
  },
  bindExport: function() {
    console.info(this.data.userInfo)
    wx.getImageInfo({
      src: this.data.userInfo.avatarUrl,
      success: res => {
        app.globalData.INDEX.avatarTemp = res.path
        wx.getImageInfo({
          src: app.globalData.INDEX.data.URL_PREFIX + app.globalData.INDEX.data.choose,
          success: res => {
            app.globalData.INDEX.chooseTemp = res.path
            var outputConfig = app.globalData.INDEX.data.outputConfig
            outputConfig.backgroundsize = { width: res.width, height: res.height }
            app.globalData.INDEX.setData({
              outputConfig
            })
            app.globalData.INDEX.createOutputImage()
          }
        })
      }
    })
  },
  createOutputImage: function() {
    var context = wx.createCanvasContext('outputImg')
    context.drawImage(this.chooseTemp, 0, 0);
    context.drawImage(this.avatarTemp, this.data.outputConfig.avatarposi[0], this.data.outputConfig.avatarposi[1]);
    context.setTextAlign("center")
    context.fillText(this.data.userInfo.nickName, this.data.outputConfig.nicknameposi[0], this.data.outputConfig.nicknameposi[0])

    context.draw(true, function () {
      wx.canvasToTempFilePath({
        canvasId: "outputImg",
        quality: 1,
        destWidth: app.globalData.INDEX.data.outputConfig.backgroundsize.width,
        destHeight: app.globalData.INDEX.data.outputConfig.backgroundsize.height,
        success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success() {
              console.log("Saved")
              app.globalData.INDEX.setData({
                exportbtnDis: true,
                exportbtnText: "已保存"
              });
            },
            fail(res) {
              console.log(res.errMsg)
              wx.getSetting({
                success(res) {
                  if (!res.authSetting['scope.writePhotosAlbum']) {
                    needauth()
                    wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {
                        app.globalData.INDEX.setData({
                          exportbtnDis: false,
                          exportbtnText: "分享图片"
                        });
                      },
                      fail() {
                        console.error("Authorization Failed")
                        app.globalData.INDEX.setData({
                          isauth: false
                        });
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })
    })


  }
})