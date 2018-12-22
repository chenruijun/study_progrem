// pages/study_major/study_major.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    major: [],
    select_major:'',
    select_country:'',
    select_id:'',
    id:'',
    showloading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      select_country:options.select_country,
    })
    //console.log(this.data.select_country)
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
            major: (res.data.data.major[that.data.select_country]),
            select_major: res.data.data.major[that.data.select_country][0].title,
            select_id: res.data.data.major[that.data.select_country][0].formId,
            id: res.data.data.major[that.data.select_country][0].id
          })
        }
      }
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
  major_test: util.throttle(function(e){ 
      var that=this
       wx.redirectTo({
          url: '../major_average/major_average?country=' + that.data.select_country +"&major=" + that.data.select_major+"&major_id="+that.data.country_id+"&form_id="+that.data.select_id,
         })
   
  },1000),
  bindchange:function(e){
    var index = e.detail.value
    this.setData({
      select_major: this.data.major[index].title,
      select_id: this.data.major[index].formId,
      id: this.data.major[index].id
    })
  }
})