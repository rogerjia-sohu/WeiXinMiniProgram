// pages/chooseicon/chooseicon.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: null, 
    infoList: [],
    infoIdxList: [],
    title: null,
    pageChooseType: null,// 0:weather, 1:mood, 2:tag
    urlPrefix: null,
    curId: 0,
    tagname: '',
    iconSelColor: '#9f9f9f',
    iconUnSelColor: '#fff',
    tagSelColor: '#ff7e00',
    tagUnSelColor: '#fff',
    tagBgColorList: [],
    tagTxtSelColor: '#fff',
    tagTxtUnSelColor: '#000',
    tagTxtColorList: [],
  },

  bindItemTap: function(e) {
    var that = this
    var id = e.target.id
    if (that.data.pageChooseType == 2) {
      // 标签
      var tagList = app.globalData.userFormData.tagIdxList
      that.setData({
        curId: id,
      })

      var taglen = tagList.length
      var maxFlag = false
      if (taglen > 0 && taglen <= 3) {
        var found = false
        var i = tagList.length
        while (i--) {
          if (tagList[i] == id) {
            found = true
            break
          }
        }
        if (found) {
          tagList.splice(i, 1)
        } else {
          if (taglen < 3) {
            tagList.push(parseInt(id))
          } else {
            maxFlag = true
            wx.showModal({
              title: '最多只可以选择三个标签',
              content: '如需选择其它标签，请先取消一个标签',
              showCancel: false,
            })
          }
        }
      } else if (taglen == 0) {
        tagList.push(parseInt(id))
      }

      var tag = app.globalData.userFormData.tag
      var len = tagList.length
      if (len) {
        tag = '';
        for (var i=0; i<len; i++) {
          tag += app.globalData.config.systag[tagList[i]].name
          if (i < (len-1)) {
            tag += '·'
          }
        }
        //infoList: app.globalData.config.systag
        app.globalData.userFormData.tag = tag
      } else {
        tag = '贴个标签'
      }
      that.setData({
        tagname: tag,
      })
      //console.log(that.data.tagname, that.data.tagname.length)
      //var wordcnt = that.data.tagname.length
      // - 左边 - 图片wid - 间隔 - gtsign宽 - (字数 x 16) - 右边
      //app.globalData.gtSignLeft4 = app.globalData.screenWidth - 16 -20 -10 -10 - (wordcnt+1) * 16
      //console.log(tagList)
      //console.log('app tagidxlist', app.globalData.userFormData)
//############################################
      var bgColorList = []
      var txtColorList = []
      var infoList = that.data.infoList
      //var idxList = that.data.infoIdxList
      var idxList = tagList
      if (idxList.length > 0) {
        //console.log('#SET DIFF COLOR')
        var len = infoList.length
        var idxlen = idxList.length
        for (var i = 0; i < len; i++) {
          bgColorList[i] = that.data.tagUnSelColor
          txtColorList[i] = that.data.tagTxtUnSelColor
          for (var j = 0; j < idxlen; j++) {
            if (i == idxList[j]) {
              bgColorList[i] = that.data.tagSelColor
              txtColorList[i] = that.data.tagTxtSelColor
              break
            }
          }
        }
      } else {
        var len = infoList.length
        //console.log('#SET SAME COLOR', len)
        for (var i = 0; i < len; i++) {
          bgColorList[i] = that.data.tagUnSelColor
          txtColorList[i] = that.data.tagTxtUnSelColor
        }
      }
      that.setData({
        tagBgColorList: bgColorList,
        tagTxtColorList: txtColorList,
      })
//############################################
    } else {
      // 天气、心情
      that.setData({
        curId: id,
      })
      //console.log(that)
    }
  },

  bindReturnTap: function (e) {
    var t = this.data.pageChooseType
    var id = this.data.curId
    if (t == 0) {
      app.globalData.userFormData.weatherIdx = id
    } else if (t == 1) {
      app.globalData.userFormData.moodIdx = id
    } else if (t == 2) {
      var tagList = app.globalData.userFormData.tagIdxList
      //app.globalData.userFormData.tagIdxList = id
    }
    //console.log(app.globalData.userFormData)
    wx.navigateBack({
      
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var chooseType = options.t
    this.setData({
      pageChooseType: chooseType,
      urlPrefix: app.globalData.config.urlprefix,
    })
    if (chooseType == 0) {
      // weather icon
      this.setData({
        infoList: app.globalData.config.weather,
        title: '选择天气',
      })
    } else if (chooseType == 1) {
      // mood icon
      this.setData({
        infoList: app.globalData.config.mood,
        title: '选择心情',
      })
    } else if (chooseType == 2) {
      // tag text button
      this.setData({
        infoList: app.globalData.config.systag,
        infoIdxList: app.globalData.userFormData.tagIdxList,
        title: '选择标签',
        config: app.globalData.config,
      })
    } 
    //console.log('LOAD chooseicon', this.data)
    
    wx.setNavigationBarTitle({
      title: this.data.title,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.pageChooseType == 2) {

      var bgColorList = []
      var txtColorList = []
      var infoList = this.data.infoList
      var idxList = this.data.infoIdxList
      if (idxList.length > 0) {
        //console.log('#SET DIFF COLOR')
        var len = infoList.length
        var idxlen = idxList.length
        for (var i=0; i < len; i++) {
          bgColorList[i] = this.data.tagUnSelColor
          txtColorList[i] = this.data.tagTxtUnSelColor
          for (var j = 0; j < idxlen; j++) {
            if (i == idxList[j]) {
              bgColorList[i] = this.data.tagSelColor
              txtColorList[i] = this.data.tagTxtSelColor
              break
            }
          }
        }
      } else {
        var len = infoList.length
        //console.log('#SET SAME COLOR', len)
        for (var i=0; i<len; i++) {
          bgColorList[i] = this.data.tagUnSelColor
          txtColorList[i] = this.data.tagTxtUnSelColor
        }
      }

    }
    
    this.setData({
      iconSizeXY: app.globalData.iconSizeXY,
      tagBtnMarginRight: app.globalData.tagBtnMarginRight,
      tagBgColorList: bgColorList,
      tagTxtColorList: txtColorList,
    })
    
    //console.log(this.data, app.globalData.config)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})