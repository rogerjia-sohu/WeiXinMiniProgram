//app.js
App({
  onLaunch: function () {
    var that = this
    //console.log('LAUNCH')
    // 展示本地存储能力
    /*
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    */

    // 登录
   /* wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res.code)
        //that.globalData.wxcode = res.code
        var wxcode = res.code
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo

            wx.request({
              url: 'https://www.codohealth.com/life9/v1/api/wxmp',
              data: {
                op: 'login',
                //code: that.globalData.wxcode,
                code: wxcode,
                iv: res.iv,
                encryptedData: res.encryptedData
              },
              success: function (res) {
                //console.log(res.data)
                that.globalData.openId = res.data
                wx.request({
                  url: 'https://www.codohealth.com/life9/v1/api/getparentingnotes',
                  data: {
                    openid: that.globalData.openId
                  },
                  success: function (res) {
                    that.globalData.noteList = JSON.parse(res.data.trim())
                  }
                })
              }
            })

          }
        })
      }
    })*/
    

/*
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
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
*/

  },

  globalData: {
    userInfo: null,
    openId: null,
    noteList: null,
    //slogan: '你记录的将是孩子未来最珍贵的礼物',
    initAttempt: 0,
    userFormData: {
      tag: "贴个标签",
      weatherIdx: 0,
      moodIdx: 0,
      tagIdxList: [],
    },
    reloadIndex: false,
  }
})