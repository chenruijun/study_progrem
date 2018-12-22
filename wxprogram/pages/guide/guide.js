// pages/guide/guide.js
import NumberAnimate from "../../utils/NumberAnimate";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    country: '',
    major: '',
    num: '',
    numComplete: '',
    showloading: false,
    disabled: true
  },
  //事件处理函数
  bindViewTap: function() {
    if (app.globalData.getphone == 0) {
      wx.redirectTo({
        url: '../presentation/presentation?state=1' + '&report=0'
      })
    } else {
      wx.redirectTo({
        url: '../presentation/presentation?state=1' + '&report=1'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this
    that.setData({
      showloading: true,
      country: options.country,
      major: options.major,
      num: options.jzl
    })
    // 数字累加效果
    let n = new NumberAnimate({
      from: that.data.num,
      speed: 3000,
      decimals: 0,
      refreshTime: 100,
      onUpdate: () => {
        that.setData({
          num: n.tempValue
        });
      },
      onComplete: () => {
        that.setData({
          numComplete: "+"
        });
      }
    });
    setTimeout(function() {
      that.setData({
        disabled: false
      })
    }, 5000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return {
      title: '快来看看你的实力能击败多少对手',
      path: '/pages/index/index',
      imageUrl: '../../images/pic1.jpg',
      success: function(res) {}
    }

  },
  // 点击水波纹效果
  containerTap: function(res) {
    // console.log(res.touches[0]);
    var x = res.touches[0].pageX;
    var y = res.touches[0].pageY + 85;
    this.setData({
      rippleStyle: ''
    });
    this.setData({
      rippleStyle: 'top:' + y + 'px;left:' + x + 'px;-webkit-animation: ripple 0.4s linear;animation:ripple 0.4s linear;'
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
})