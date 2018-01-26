//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    btnPlusLeft: 0,
    gtSignLeft: 0,
    gtSignLeft4: 0,
    rmTextLeft: 0,
    rmTextSize: 14*2 + 16*2,// 14px/char * 2 char + margin-right
    gtSignLeftConst: 0,
    gtSignRightMargin: 16*2+10,
    iOSgtSignLeftConst: 0,
    iOSgtSignRightMargin: 16*8 + 10,
    imgSizeXY: 100,
    iconSizeXY: 40,
    tagBtnWidth: 88,
    tagBtnMarginRightMax: 20,
    tagBtnMarginRight: 20,
    hidePdfBtn: true,
    slogan: '你记录的将是孩子未来最珍贵的礼物',
    userInfo: {},
    hasUserInfo: false,
    hasUserNote: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userNote: '',
    openId: '',
    noteList: [],
    config: null,
    pageStart: 0,
    pageCount: 8,
  },
  //事件处理函数
  /*
  goPlus: function () {
    wx.navigateTo({
      url: '../compose/compose'
    })
  },*/
  /*
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },*/
  
  bindImageTap: function (e) {
    var that = this
    var id = e.target.id
    var noteId = e.target.dataset.noteid
    var imgList = that.data.noteList[noteId].imageIdList.original
    var curImage = imgList[id]
    if (curImage) {
      wx.previewImage({
        current: curImage,
        urls: imgList,
      })
    }
  },

  bindDelNote: function(e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      confirmText: '删除',
      success: function (res) {
        if (res.confirm) {
          var id = e.currentTarget.id
          wx.request({
            url: '/v1/api/rmnote',
            data: {
              nid: id,
              oid: that.data.openId,
            }, 
            success: function (res) {
              //console.log(that.data)
              if (that.data.noteList.length == 0) {
                that.setData({
                  hasUserNote: false,
                })
              }
              //getCurrentPages()[getCurrentPages().length - 1].onLoad()
              app.globalData.reloadIndex = true
              getCurrentPages()[getCurrentPages().length - 1].onShow()
            }
          })
        }
      }
    })
  },

  bindScrollToLower: function(e) {
    var that = this
    that.setData({
      pageStart: that.data.noteList.length,
    })
    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: '/v1/api/parentingnotes',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        openid: that.data.openId,
        start: that.data.pageStart,
        count: that.data.pageCount,
      },
      success: function (res) {
        //console.log('SUCCESS', res)
        var nextNoteList = JSON.parse(res.data.trim())
        //app.globalData.noteList = that.data.noteList
        var len = nextNoteList.length
        if (len > 0) {
          app.globalData.noteList = app.globalData.noteList.concat(nextNoteList)

          ///////////////////////////////////
          var myNoteYear = []
          var myNoteDate = []
          var myNoteTime = []
          for (var i = 0; i < len; i++) {
            myNoteYear[i] = nextNoteList[i].createTime.substr(0, 4)
            myNoteDate[i] = nextNoteList[i].createTime.substr(0, 10).replace(/-/g, '/')
            myNoteTime[i] = nextNoteList[i].createTime.substr(11, 5)
          }
          var noteYearNext = that.data.noteYear.concat(myNoteYear)
          var noteYearDate = that.data.noteDate.concat(myNoteDate)
          var noteYearTime = that.data.noteTime.concat(myNoteTime)
          ///////////////////////////////////
          that.setData({
            noteList: app.globalData.noteList,
            noteYear: noteYearNext,
            noteDate: noteYearDate,
            noteTime: noteYearTime,
          })
        } else {
          that.setData({
            pageStart: 0,
          })
        }

        //console.log(that.data)
        if (getCurrentPages().length != 0) {
          getCurrentPages()[getCurrentPages().length - 1].onShow()
        }
      },
      complete: function() {
        //console.log('COMPLETE')
        wx.hideLoading()
      }
    })
  },

  onLoad: function () {
    //console.log('LOAD index', this.data)
    //console.log('SHOW index app.globalData', app.globalData)
    var that = this
    wx.showLoading({
      title: '加载中',
    })

    wx.getSystemInfo({
      success: function (res) {
        var tagMarginR = (res.screenWidth - 16 * 2 - that.data.tagBtnWidth * 3)/2
        if (tagMarginR > that.data.tagBtnMarginRightMax) {
          tagMarginR = that.data.tagBtnMarginRightMax
        }

        that.setData({
          btnPlusLeft: (res.screenWidth-60) / 2,
          gtSignLeft: (res.screenWidth - 16 - 88),
          gtSignLeft4: (res.screenWidth - 16 - 120),
          screenWidth: res.screenWidth,
          rmTextLeft: res.screenWidth - that.data.rmTextSize,
          // screenwidth  - left&right margin - imgmargin
          imgSizeXY: ((res.screenWidth - 16*2 - 2*3) / 3)*0.6,
          iconSizeXY: (res.screenWidth - 16*3) / 6,
          gtSignLeftConst: res.screenWidth - that.data.gtSignRightMargin,
          iOSgtSignLeftConst: res.screenWidth - that.data.iOSgtSignRightMargin,

          tagBtnMarginRight: tagMarginR
        })
        app.globalData.gtSignLeft = that.data.gtSignLeft
        app.globalData.gtSignLeft4 = that.data.gtSignLeft4
        app.globalData.screenWidth = that.data.screenWidth
        app.globalData.rmTextLeft = that.data.rmTextLeft
        app.globalData.imgSizeXY = that.data.imgSizeXY
        app.globalData.iconSizeXY = that.data.iconSizeXY
        app.globalData.gtSignLeftConst = that.data.gtSignLeftConst
        app.globalData.iOSgtSignLeftConst = that.data.iOSgtSignLeftConst
        app.globalData.tagBtnMarginRight = that.data.tagBtnMarginRight

        if (res.system.indexOf('iOS') >= 0) {
          app.globalData.gtSignLeftConst = that.data.iOSgtSignLeftConst
        }
        //console.log(app.globalData)
      },
    })

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res.code)
        //that.globalData.wxcode = res.code
        var wxcode = res.code
        wx.getUserInfo({
          success: function (res) {
            //that.data.userInfo = res.userInfo
            that.setData({
              userInfo: res.userInfo,
            })

            wx.request({
              url: '/v1/api/wxmp',
              method: 'POST',
              header: {
                //'Content-Type': 'application/json'
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: {
                op: 'login',
                //code: that.globalData.wxcode,
                code: wxcode,
                iv: res.iv,
                encryptedData: res.encryptedData
              },
              
              success: function (res) {
                var cfgData = JSON.parse(res.data.trim())
                //that.data.openId = res.data
                //that.data.openId = cfgData.openId
                //that.data.config = JSON.parse(cfgData.config.trim())
                //console.log(that.data.config.hidePdfBtn)
                app.globalData.config = JSON.parse(cfgData.config.trim())
                //console.log('###', app.globalData)
                that.setData({
                  openId: cfgData.openId,
                  config: JSON.parse(cfgData.config.trim()),
                  hidePdfBtn: JSON.parse(cfgData.config.trim()).hidePdfBtn,
                })
                wx.request({
                  url: '/v1/api/getparentingnotes',
                  method: 'POST',
                  header: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    openid: that.data.openId,
                    start: that.data.pageStart,
                    count: that.data.pageCount,
                  },
                  success: function (res) {
                    //console.log('res.data.trim()',res.data.trim())
                    //console.log('that.data', that.data)
                    that.data.noteList = JSON.parse(res.data.trim())
                    //console.log(that.data)
                    app.globalData.noteList = that.data.noteList
                    app.globalData.openId = that.data.openId.trim()
                    if (that.data.noteList.length) {
                      //console.log('OK')
                      //console.log(that.data.noteList[0])
                      var len = that.data.noteList.length

                      var myNoteYear = []
                      var myNoteDate = []
                      var myNoteTime = []
                      for (var i=0; i<len; i++){
                        myNoteYear[i] = that.data.noteList[i].createTime.substr(0, 4)
                        myNoteDate[i] = that.data.noteList[i].createTime.substr(0, 10).replace(/-/g, '/')
                        myNoteTime[i] = that.data.noteList[i].createTime.substr(11, 5)
                      }

                      that.setData({
                        noteList: app.globalData.noteList,
                        noteYear: myNoteYear,
                        noteDate: myNoteDate,
                        noteTime: myNoteTime,
                        hasUserNote: true, /* MUST set TRUE after debugging */
                      })
                    } else {
                      //console.log('TRIGGERED')
                      that.setData({
                        noteList: app.globalData.noteList,
                        noteYear: [],
                        noteDate: [],
                        noteTime: [],
                        hasUserNote: false,
                      })
                    }                    
                    if (getCurrentPages().length != 0) {
                      getCurrentPages()[getCurrentPages().length - 1].onShow()
                    }
                  }
                })

              },

              complete: function (res) {
                wx.hideLoading()
              }
            })

          }
        })
      }
    })
  },

  onReady: function () {
    // 页面渲染完成
    //console.log('index READY')
    //console.log(this.data)
  },

  onShow: function () {
    // 页面显示
    //console.log('SHOW index this.data',this.data)
    //console.log('SHOW index app.globalData', app.globalData)
    this.setData({
      rmTextLeft: app.globalData.rmTextLeft,
    })
    if (app.globalData.reloadIndex) {
      app.globalData.reloadIndex = false
      this.setData({
        pageStart: 0,
      })
      //console.log('RELOAD index by SHOW')
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
  },

  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  /*
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  */

  /**
    * 页面上拉触底事件的处理函数
    */
  onReachBottom: function () {
    var that = this
    //console.log('index ReachBottom')
    /*
    that.setData({
      pageStart: that.data.noteList.length,
    })
    //console.log('BOTTOM', that.data)

    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: '/v1/api/getparentingnotes',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        openid: that.data.openId,
        start: that.data.pageStart,
        count: that.data.pageCount,
      },
      success: function (res) {
        var nextNoteList = JSON.parse(res.data.trim())
        //app.globalData.noteList = that.data.noteList
        var len = nextNoteList.length
        if (len > 0) {
          app.globalData.noteList = app.globalData.noteList.concat(nextNoteList)
        
        ///////////////////////////////////
          var myNoteYear = []
          var myNoteDate = []
          var myNoteTime = []
          for (var i = 0; i < len; i++) {
            myNoteYear[i] = nextNoteList[i].createTime.substr(0, 4)
            myNoteDate[i] = nextNoteList[i].createTime.substr(0, 10).replace(/-/g, '/')
            myNoteTime[i] = nextNoteList[i].createTime.substr(11, 5)
          }
          var noteYearNext = that.data.noteYear.concat(myNoteYear)
          var noteYearDate = that.data.noteDate.concat(myNoteDate)
          var noteYearTime = that.data.noteTime.concat(myNoteTime)
        ///////////////////////////////////
          that.setData({
            noteList: app.globalData.noteList,
            noteYear: noteYearNext,
            noteDate: noteYearDate,
            noteTime: noteYearTime,
          })
        }

        wx.hideLoading()
        //console.log(that.data)
        if (getCurrentPages().length != 0) {
          getCurrentPages()[getCurrentPages().length - 1].onShow()
        }
      }
    })
    */
  },

  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
