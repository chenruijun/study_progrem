// pages/report/report.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //pageLoading 
  },
  //事件处理函数
  bindViewTap: function () {

  },
  // 点击水波纹效果
  containerTap: function (res) {
    var x = res.touches[0].pageX;
    var y = res.touches[0].pageY + 85;
    this.setData({
      rippleStyle: ''
    });
    this.setData({
      rippleStyle: 'top:' + y + 'px;left:' + x + 'px;-webkit-animation: ripple 0.4s linear;animation:ripple 0.4s linear;'
    });
  },
  getUserInfo: function (e) {
    if (!this.pageLoading) {
      this.pageLoading = !0;
      var that = this
      app.globalData.userInfo = e.detail.userInfo
      var user = app.globalData.userInfo;//用户基本信息
      if (user) {
        wx.request({
          //后台接口地址
          url: 'https://api.bailitop.com/wechat/v2/showtests/getuser',
          method: 'POST',
          data: {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            seesionKey: app.globalData.session_key
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',    // default as json
          },
          success: function (res) {
            wx.navigateTo({
              url: '../study_target/study_target'
            })
            app.globalData.getinfos = true
          }
        })

      } else {
        that.setData({
          showModel: false
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.pageLoading = !1;
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
  onShareAppMessage: function (res) {
    return {
      title: '快来看看你的实力能击败多少对手',
      path: '/pages/index/index',
      imageUrl: '../../images/pic1.jpg',
      success: function (res) {
      }
    }

  },
})





