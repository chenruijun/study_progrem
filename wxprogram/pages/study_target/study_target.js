// pages/study_target/study_target.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    country: [],
    select_country: '',
    id: '',
    showloading: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const requestTask = wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showforms',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == 200) {
          that.setData({
            showloading: true,
            country: (res.data.data.form),
            select_country: (res.data.data.form[0]),
          })
        }

      }
    })
  },
  major: util.throttle(function () {
    wx.navigateTo({
      url: '../study_major/study_major?select_country=' + this.data.select_country,
    })
  },1000),
  bindchange: function (e) {
    var index = e.detail.value
    var text = e.currentTarget.dataset.text
    this.setData({
      select_country: this.data.country[index],
    })
  },
  onShow: function () {
  },
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