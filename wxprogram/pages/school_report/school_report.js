// pages/school_report/school_report.js
import * as echarts from '../../ec-canvas/echarts';
const util = require('../../utils/util.js')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ecradar: {
      lazyLoad: true
    },
    school_list:[],
    list:[],
    uhide: 0,
    value1: '',
    value2: '',
    value3: '',
    value4: '',
    value5: '',
    maxvalue1: '', //max教育背景值
    maxvalue2: '', //max语言成绩值
    maxvalue3: '', //max学术考试值
    maxvalue4: '', //max实践几领导力值
    maxvalue5: '', //max科研论文值
    test: false,
    showloading:false,
    hs:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.showShareMenu({
      withShareTicket: true
    })
    const requestTask = wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests/getschool?device=4&uid='+ app.globalData.openid,
      method:'GET',
      data:{},
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        if(res.data.status==200){
          that.setData({
            showloading:true,
            hs:res.data.hs,
            school_list:res.data.data,
            list: res.data.data.school,
            value1: (res.data.data.data[0].totalScore),
            value2: (res.data.data.data[1].totalScore),
            value3: (res.data.data.data[2].totalScore),
            value4: (res.data.data.data[3].totalScore),
            value5: (res.data.data.data[4].totalScore),
            maxvalue1: (res.data.data.education),//教育
            maxvalue2: (res.data.data.language),//语言
            maxvalue3: (res.data.data.learning),//学术
            maxvalue4: (res.data.data.activity),//实践
            maxvalue5: (res.data.data.paper),//科研
          })   
        }
        that.barComponent = that.selectComponent('#mychart-dom-rabar');
        that.init_bar();
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
    let that = this
    if (res.from == "button") {
      //分享为按键中的求助即id=1
      if (res.target.id == 'sharebtn1') {
        return {
          title: app.convertHtmlToText(that.data.hs),
          path: 'pages/index/index',
          success: function (res) {
            //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android  
            //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets  
            //获取用户设备信息  
            wx.getSystemInfo({
              success: function (d) {
                //判断用户手机是IOS还是Android  
                if (d.platform == 'android') {
                  wx.getShareInfo({ //获取群详细信息  
                    shareTicket: res.shareTickets,
                    success: function (res) {
                      //这里写你分享到群之后要做的事情，比如增加次数什么的  
                      that.isTest()
                    },
                    fail: function (res) { //这个方法就是分享到的是好友，给一个提示  
                      wx.showModal({
                        title: '提示',
                        content: '分享好友无效，请分享群',
                      })
                    }
                  })
                }
                if (d.platform == 'ios') { //如果用户的设备是IOS  
                  if (res.shareTickets != undefined) {
                    wx.getShareInfo({
                      shareTicket: res.shareTickets,
                      success: function (res) {
                        //分享到群之后你要做的事情  
                        that.isTest()
                      }
                    })
                  } else { //分享到个人要做的事情，我给的是一个提示  
                    wx.showModal({
                      title: '提示',
                      content: '分享好友无效，请分享群',
                    })
                  }
                }
              }
            })
          }
        }
      }
      if (res.target.id == 'school_sharebtn2') {
        return {
          title: app.convertHtmlToText(that.data.hs),
          path: 'pages/index/index',
          imageUrl: '../../images/pic1.jpg',
          success: function (res) {
            //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android  
            //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets  
            //获取用户设备信息  
            wx.getSystemInfo({
              success: function (d) {
                //判断用户手机是IOS还是Android  
                if (d.platform == 'android') {
                  wx.getShareInfo({ //获取群详细信息  
                    shareTicket: res.shareTickets,
                    success: function (res) {
                      //这里写你分享到群之后要做的事情，比如增加次数什么的  
                      that.isTest2()
                    },
                    fail: function (res) { //这个方法就是分享到的是好友，给一个提示  
                      wx.showModal({
                        title: '提示',
                        content: '分享好友无效，请分享群',
                      })
                    }
                  })
                }
                if (d.platform == 'ios') { //如果用户的设备是IOS  
                  if (res.shareTickets != undefined) {
                    wx.getShareInfo({
                      shareTicket: res.shareTickets,
                      success: function (res) {
                        //分享到群之后你要做的事情  
                        that.isTest2()
                      }
                    })
                  } else { //分享到个人要做的事情，我给的是一个提示  
                    wx.showModal({
                      title: '提示',
                      content: '分享好友无效，请分享群',
                    })
                  }
                }
              }
            })
          }
        }
      }
    } else {
      return {
        title: app.convertHtmlToText(that.data.hs),
        path: '/pages/index/index'
      }
    }
  },
  ontap:function(e){
    var that=this
    var index = e.currentTarget.dataset.index;
    var list=that.data.list;
    list[index].flag=!list[index].flag
    that.setData({
      list:list
    })
  },
  init_bar: function () {
    this.barComponent.init((canvas, width, height) => {
      // 初始化图表
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      barChart.setOption(this.getBarOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return barChart;
    });
  },
  getBarOption: function () {
    //return 请求数据
    var that=this
    return {
      backgroundColor: "#f2f4f7",
      tooltip: { zlevel: -1, z: -1 },
      calculable: true,
      radar: {
        name: {
          textStyle: {
            color: '#666'
          }
        },
        indicator: [
          { name: '教育背景' + that.data.maxvalue1 + '分', max: that.data.maxvalue1 },
          { name: '语言成绩' + that.data.maxvalue2 + '分', max: that.data.maxvalue2 },
          { name: '学术考试' + that.data.maxvalue3 + '分', max: that.data.maxvalue3 },
          { name: '实践及领导力' + that.data.maxvalue4 + '分', max: that.data.maxvalue4 },
          { name: '科研论文' + that.data.maxvalue5 + '分', max: that.data.maxvalue5 }
        ],
        center: ['50%', '53%'],
        axisLine: {            // 坐标轴线
          show: true,       // 默认显示，属性show控制显示与否
          lineStyle: {
            width: 1,
            color: '#FC7FA7' // 图表背景网格线的颜色
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["#f2f4f7"]  // 图表背景网格的颜色
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            width: 2,
            color: '#FC7FA7' // 图表背景网格线的颜色
          }
        }
      },
      series: [{
        text: '你的能力模型',
        type: 'radar',
        itemStyle: {
          normal: {
            color: "#FD504E",
            lineStyle: {
              color: "#FC7FA7"
            },
            areaStyle: {
              opacity: 1, // 图表中各个图区域的透明度
              color: new echarts.graphic.LinearGradient( // 图表中各个图区域的颜色
                0, 0, 0, 1,
                [
                  { offset: 0.2, color: '#FAB592' },
                  { offset: 0.5, color: '#FB9C9C' },
                  { offset: 1, color: '#FC7FA7' }
                ]
              )
            }
          }
        },
        //这里的配置显示数值  
        label: {
          normal: {
            show: true,
            formatter: function (params) {
              return params.value;
            }
          }
        },
        data: [{
          value: [that.data.value1, that.data.value2, that.data.value3, that.data.value4, that.data.value5]
        }]
      }]
    };
  },
  isTest: function () {
    wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests/testnum?test_from=1&uid=' + app.globalData.openid,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == 200) {
          if (res.data.data.test <= 5) {
            wx.navigateTo({
              url: "../study_target/study_target"
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '测试次数不能大于五次',
            })
          }
        }
      }
    })
  },
  isTest2: function () {
    wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests/share?type=2&uid=' + app.globalData.openid,
      method:'GET',
      header:{
        'content-type': 'application/json'
      },
      success:function(res){
        if(res.data.status==200){
          wx.redirectTo({
            url: "../presentation/presentation?state=1' + '&report=0'"
          })
        }
       
      }
    })
   
  },
  checkyxbtn2:function(e){
    this.setData({
      test: (!this.data.test)
    });
  },
  //关闭隐藏js
  checkyxbtn: util.throttle( function (e) {
    var that=this
    wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests/share?type=1&uid=' + app.globalData.openid,
      method:'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res.data.data.share)
        if(res.data.data.share==1){
          that.setData({
            test: (!that.data.test)
          });
        }else{
          wx.redirectTo({
            url: "../presentation/presentation?state=1' + '&report=0'"
          })
        }
      }
    })

  },1000), 
})