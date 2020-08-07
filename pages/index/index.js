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
    exportbtnText: "分享图片"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  click(e) {
    wx.getSystemInfo({
      success: (result) => {
        var i = Math.max(0, Math.floor((e.changedTouches[0].pageX/result.windowWidth-0.02) * 4))
        wx.navigateTo({
          url: '../share/index?pic=' + i,
        })
      },
    })
  },
  bindGetTicket: function(event) {
    var id = event.currentTarget.dataset.index
    var items = this.data.CONFIG[id].items
    var choose = items[Math.floor(Math.random() * items.length)]
    this.setData({
      choose,
      outputConfig: {avatarposi: this.data.CONFIG[id].avatarposi, nicknameposi: this.data.CONFIG[id].nicknameposi}
    })
    console.log(this.data.choose)
    console.log(this.data.outputConfig)
  },
  bindReChoose: function() {
    this.setData({
      choose : null
    })
  }
})
