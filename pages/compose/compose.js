var app = getApp();
Page({
  data: {
    okBtnEnabled: '',
    okBtnDisbled: 'disabled',
    okBtnState: '',
    curNoteLen: 0,
    curPhotoCnt: 0,
    myFormData: {},
    config: null,
    openId: null,
    note:"这一刻的想法…",
    photoFiles: [],
    photoArr: [],
    photoKeyArr: [],
    myWeatherArr: ['天气','晴','多云','雨','雪'],
    mypos:'所在位置',
    picAddPhoto: "https://www.codohealth.com/life9/res/addphoto.png",
    /*//array: ["愉快", "超嗨", "平静", "忧伤"],
    index: 0,
    toast1Hidden: true,
    modalHidden: true,
    modalHidden2: true,
    notice_str: ''
    */
  },

  addPhotos: function(e) {
    //console.log(app.globalData.openId)
    var that = this
    wx.chooseImage({
      count: 9 - that.data.photoFiles.length,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        // console.log(res)
        var lastPhotos = that.data.photoFiles
        var curPhotos = []
        if (lastPhotos.length > 0) {
          curPhotos = lastPhotos.concat(tempFilePaths)
        } else {
          curPhotos = tempFilePaths
        }
        that.setData({
          photoFiles: curPhotos,
        })
        //that.data.photoArr = []
        wx.showLoading({
          title: '正在处理图片……',
        })
        for (var i = 0; i < curPhotos.length; i++) {
          //console.log(curPhotos[i]);
          wx.uploadFile({
            url: 'https://www.codohealth.com/life9/v1/api/upload',
            //url: 'https://www.codohealth.com/life9/v1/api/getnoteconfig',
            filePath: curPhotos[i],
            name: 'file',
            formData: {
              serial: i,
              openid: app.globalData.openId
            },
            success: function (res) {
              var data = JSON.parse(res.data.trim())
              //do something
              //console.log(i)
              //console.log(JSON.parse(res.data.trim()))
              //console.log(data)
              var idx = data.sn
              that.data.photoArr[idx] = data.hkey[0] +'-'+ data.hkey[1]
              //console.log(that.data.photoArr)
              if (that.data.photoArr.length === curPhotos.length) {
                wx.hideLoading()
              }
              that.setData({
                photoKeyArr: that.data.photoArr,
                curPhotoCnt: curPhotos.length,
              })
            }
          })
        }
      },
    })
  },
  getPos: function(e) {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        //console.log(res.name);
        that.setData({
          mypos: res.name
        })
      },
    })
  },

  chooseWeatherIcon: function (e) {
    var that = this
    wx.navigateTo({
      url: '../chooseicon/chooseicon?t=0',
      success: function (res) {

      },
      fail: function (res) { },
      complete: function (res) {
        //console.log('choose completed')
      },
    })
  },

  chooseMoodIcon: function(e) {
    //console.log(e)
    var that  = this
    wx.navigateTo({
      url: '../chooseicon/chooseicon?t=1',
      success: function(res) {
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  chooseTag: function (e) {
    //console.log('### CHOOSE TAG:',this)
    var that = this
    wx.navigateTo({
      url: '../chooseicon/chooseicon?t=2',
      success: function (res) {

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


  bindTextareaBlur: function(e) {
    //console.log("### blur:", e)
  },

  bindTextareaInput: function(e) {
    this.setData({
      curNoteLen: e.detail.value.length,
    })
    //console.log("### input:", this.data)
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //console.log('compose OnLoad')
    this.setData({
      openId: app.globalData.openId
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.setData({
      myFormData: app.globalData.userFormData,
      config: app.globalData.config,
      gtSignLeft: app.globalData.gtSignLeft,
      gtSignLeft4: app.globalData.gtSignLeft4,
      
      gtSignLeftConst: app.globalData.gtSignLeftConst,
    })
    //console.log('compose OnShow', this.data)
    //console.log('app.globalData.config', app.globalData.config)
    //console.log('app.globalData.userFormData', app.globalData.userFormData)
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  formSubmit: function (e) {
    var that = this
    that.setData({
      curNoteLen: 0,
      curPhotoCnt: 0,
    })
    var formData = e.detail.value
    if (formData.loc == '所在位置') {
      formData.loc = ''
    }
    if (formData.tag == '贴个标签') {
      formData.tag = ''
    }

    //console.log('SUBMIT')
    //console.log(e)
    wx.request({
      url: 'https://www.codohealth.com/life9/v1/api/newnote', 
      //url: 'https://www.codohealth.com/life9/v1/api/getparentingnotes',
      data: formData,
      method: 'POST',
      header: {
        //'Content-Type': 'application/json'
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = JSON.parse(res.data.trim())
        //console.log(data)
        if (data.sts === 'ok') {
          // TODO: reset form data
          that.setData({
            curNoteLen: 0,
            curPhotoCnt: 0,
            myFormData: {
              tag: '贴个标签',
              weatherIdx: 0,
              moodIdx: 0,
              tagIdxList: [],
            },
          })
          app.globalData.userFormData = that.data.myFormData
          app.globalData.reloadIndex = true
          wx.navigateBack()
          /*
          wx.redirectTo({
            url: '../index/index',
          })*/
        } else {
          wx.showModal({
            title: data.errTitle,
            content: data.errMsg,
            showCancel: false,
          })
        }
      }
    })
  }
})  