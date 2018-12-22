var app = getApp();
const util = require('../../utils/util.js')
import * as echarts from '../../ec-canvas/echarts';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showloading: false,
    ecradar: {
      lazyLoad: true // 延迟加载
    },
    showModel: false,
    test: false,
    share: false,
    pic: false,
    dsiabled: false,
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
    hs: '',
    openid: '',
    showbtn: false,
    phone: '',
    sharebtn: false,
    sharebtn2: false
  },
  // Echart图表js---start
  init_bar: function() {
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
  getBarOption: function() {
    //return 请求数据
    return {
      backgroundColor: "#fff",
      tooltip: {
        zlevel: -1,
        z: -1
      },
      calculable: true,
      radar: {
        name: {
          textStyle: {
            color: '#666',
          } 
        },
        indicator: [{
            name: '教育背景' + this.data.maxvalue1 + '分',
            max: this.data.maxvalue1
          },
          {
            name: '语言成绩' + this.data.maxvalue2 + '分',
            max: this.data.maxvalue2
          },
          {
            name: '学术考试' + this.data.maxvalue3 + '分',
            max: this.data.maxvalue3
          },
          {
            name: '实践及领导力' + this.data.maxvalue4 + '分',
            max: this.data.maxvalue4
          },
          {
            name: '科研论文' + this.data.maxvalue5 + '分',
            max: this.data.maxvalue5
          }
        ],
        center: ['50%', '53%'],
        axisLine: { // 坐标轴线
          show: true, // 默认显示，属性show控制显示与否
          lineStyle: {
            width: 1,
            color: '#FC7FA7' // 图表背景网格线的颜色
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ["#fff"] // 图表背景网格的颜色
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
                0, 0, 0, 1, [{
                    offset: 0.2,
                    color: '#FAB592'
                  },
                  {
                    offset: 0.5,
                    color: '#FB9C9C'
                  },
                  {
                    offset: 1,
                    color: '#FC7FA7'
                  }
                ]
              )
            }
          }
        },
        //这里的配置显示数值  
        label: {
          normal: {
            show: true,
            formatter: function(params) {
              return params.value;
            }
          }
        },
        data: [{
          value: [this.data.value1, this.data.value2, this.data.value3, this.data.value4, this.data.value5]
        }]
      }]
    };
  },
  // Echart图表js---end
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    app.getOpenid().then(function(res) {
      if (res.status == 200) {
        that.setData({
          openid: wx.getStorageSync('openid'),
        })
        //console.log(that.data.openid)
        that.islogin()
        var initiator = decodeURIComponent(options.initiator)
        var initiators = options.initiator
        if (initiators && that.data.openid) {
          wx.request({
            //后台接口地址
            url: 'https://api.bailitop.com/wechat/v2/showforms/setnm',
            method: 'GET',
            data: {
              initiators: initiators,
              openid: wx.getStorageSync('openid'),
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded', // default as json
            }
          })
        }
      } else {
        // console.log(res.data);
      }
    });
    wx.getSetting({
      success: (res) => {
        //判断用户已经授权。不需要弹框
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            showModel: true
          })
        } else {
          wx.checkSession({
            success: function() {
              //session_key 未过期，并且在本生命周期一直有效
              that.setData({
                showModel: false
              })
            },
            fail: function() {
              // session_key 已经失效，需要重新执行登录流程
              that.setData({
                showModel: true
              })
            }
          })
        }
      }
    })

    // options 中的 scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    let isIphoneX = app.globalData.isIphoneX;
    that.setData({
      isIphoneX: isIphoneX
    })
  },
  getUserInfo: function(e) {
    var that = this
    app.globalData.userInfo = e.detail.userInfo
    var user = app.globalData.userInfo; //用户基本信息
    console.log(user)
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
          'content-type': 'application/x-www-form-urlencoded', // default as json
        },
        success: function(res) {
          that.setData({
            showModel: false,
          })
          app.globalData.getinfos = true
          that.barComponent = that.selectComponent('#mychart-dom-rabar');
          that.init_bar();
        }
      })
    } else {
      that.setData({
        showModel: false,
      })
      app.globalData.getinfos = false
      that.barComponent = that.selectComponent('#mychart-dom-rabar');
      that.init_bar();
    }

  },
  onShow: function(e) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this
    if (that.data.openid != '') {
      that.islogin()
    }
  },
  // 点击水波纹效果
  containerTap: function(res) {
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let that = this
    if (res.from == "button") {
      //分享为按键中的求助即id=1
      if (res.target.id == 'sharebtn1') {
        return {
          title: app.convertHtmlToText(that.data.hs),
          path: 'pages/index/index',
          imageUrl: '../../images/pic1.jpg',
          success: function(res) {
            //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android  
            //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets  
            //获取用户设备信息  
            wx.getSystemInfo({
              success: function(d) {
                //判断用户手机是IOS还是Android  
                if (d.platform == 'android') {
                  wx.getShareInfo({ //获取群详细信息  
                    shareTicket: res.shareTickets,
                    success: function(res) {
                      //这里写你分享到群之后要做的事情，比如增加次数什么的  
                      that.isTest(),
                        app.globalData.getphone = 1
                    },
                    fail: function(res) { //这个方法就是分享到的是好友，给一个提示  
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
                      success: function(res) {
                        //分享到群之后你要做的事情  
                        that.isTest(),
                          app.globalData.getphone = 1
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
      if (res.target.id == 'sharebtn2') {
        that.setData({
          sharebtn2: (!that.data.sharebtn2)
        });
        return {
          title: app.convertHtmlToText(that.data.hs),
          path: 'pages/index/index',
          imageUrl: '../../images/pic1.jpg',
          success: function(res) {
            //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android  
            //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets  
            //获取用户设备信息  
            wx.getSystemInfo({
              success: function(d) {
                //判断用户手机是IOS还是Android  
                if (d.platform == 'android') {
                  wx.getShareInfo({ //获取群详细信息  
                    shareTicket: res.shareTickets,
                    success: function(res) {
                      //这里写你分享到群之后要做的事情，比如增加次数什么的  
                      that.isTest2()
                    },
                    fail: function(res) { //这个方法就是分享到的是好友，给一个提示  
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
                      success: function(res) {
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
      if (res.target.id == 'sharebtn3') {
        that.setData({
          sharebtn: (!that.data.sharebtn)
        });
        return {
          title: app.convertHtmlToText(that.data.hs),
          path: 'pages/index/index',
          imageUrl: '../../images/pic1.jpg',
          success: function(res) {
            //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android  
            //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets  
            //获取用户设备信息  
            wx.getSystemInfo({
              success: function(d) {
                //判断用户手机是IOS还是Android  
                if (d.platform == 'android') {
                  wx.getShareInfo({ //获取群详细信息  
                    shareTicket: res.shareTickets,
                    success: function(res) {
                      //这里写你分享到群之后要做的事情，比如增加次数什么的  
                      that.isTest3()
                    },
                    fail: function(res) { //这个方法就是分享到的是好友，给一个提示  
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
                      success: function(res) {
                        //分享到群之后你要做的事情  
                        that.isTest3()
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
        title: '快来看看你的实力能击败多少对手',
        path: '/pages/index/index',
        imageUrl: '../../images/pic1.jpg'
      }
    }
  },
  muban: function() {
    wx.navigateTo({
      url: '../report/report',
    })
  },
  xuanxiao: function() {
    wx.navigateTo({
      url: '../choose_school/choose_school',
    })
  },
  see_bg: util.throttle(function() {
    var that = this
    if (app.globalData.getinfos == false) {
      that.setData({
        showModel: true,
      })
    } else if (that.data.phone == 1) {
      wx.request({
        url: 'https://api.bailitop.com/wechat/v2/showtests/share?type=1&uid=' + app.globalData.openid,
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          if (res.data.status == 200) {
            if (res.data.data.share == 1) {
              if (res.data.data.test_from == 1) {
                wx.navigateTo({
                  url: '../presentation/presentation?state=1' + '&report=0',
                })
              } else {
                that.setData({
                  sharebtn: (!that.data.sharebtn)
                });
              }
            } else {
              wx.navigateTo({
                url: '../presentation/presentation?state=1' + '&report=0',
              })
            }
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../presentation/presentation?state=1' + '&report=0',
      })
    } 
  }, 1000),
  see_bg2: util.throttle(function() {
    var that = this
    if (app.globalData.getinfos == false) {
      that.setData({
        showModel: true,
      })
    } else if (that.data.phone == 1) {
      wx.request({
        url: 'https://api.bailitop.com/wechat/v2/showtests/share?type=1&uid=' + app.globalData.openid,
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
          if (res.data.status == 200) {
            if (res.data.data.share == 1) {
             if (res.data.data.test_from == 2) {
                wx.navigateTo({
                  url: '../school_report/school_report?state=2' + '&report=0',
                })
              } else {
                that.setData({
                  sharebtn2: (!that.data.sharebtn2)
                });
              }
            }
            else {
              wx.navigateTo({
                url: '../school_report/school_report?state=2' + '&report=0',
              })
            } 
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../presentation/presentation?state=2' + '&report=0',
      })
    } 
  }, 1000),
  go_test: function() {
    var that = this
    if (app.globalData.getinfos == false) {
      that.setData({
        showModel: true,
      })
    } else {
      wx.navigateTo({
        url: '../study_target/study_target',
      })
    }
  },
  isTest: function() {
    wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests/testnum?test_from=1&uid=' + app.globalData.openid,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
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
  isTest2: function() {
    wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests/share?type=2&uid=' + app.globalData.openid,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.status == 200) {
          wx.navigateTo({
            url: '../school_report/school_report',
          })
        }
      }
    })
  },
  isTest3: function() {
    wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests/share?type=2&uid=' + app.globalData.openid,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.status == 200) {
          wx.navigateTo({
            url: '../presentation/presentation?state=1' + '&report=0',
          })
        }
      }
    })
  },
  islogin: function() {
    var that = this
    wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests?uid=' + that.data.openid + '&device=4',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.status == 200) {
          that.setData({
            showloading: true,
            test: false,
            share: true,
            pic: false,
            dsiabled: true,
            value1: (res.data.data.data[0].totalScore),
            value2: (res.data.data.data[1].totalScore),
            value3: (res.data.data.data[2].totalScore),
            value4: (res.data.data.data[3].totalScore),
            value5: (res.data.data.data[4].totalScore),
            maxvalue1: (res.data.data.education), //教育
            maxvalue2: (res.data.data.language), //语言
            maxvalue3: (res.data.data.learning), //学术
            maxvalue4: (res.data.data.activity), //实践
            maxvalue5: (res.data.data.paper), //科研
            hs: (res.data.hs),
            phone: (res.data.data.phone)
          })
          if (res.data.data.phone == 1) {
            that.setData({
              showbtn: true
            })
          }
          // 启动Echart图表构造方法
          that.barComponent = that.selectComponent('#mychart-dom-rabar');
          that.init_bar();
        } else if (res.data.status == 404) {
          that.setData({
            test: true,
            share: false,
            pic: true,
            dsiabled: false,
            showloading: true
          })
        }
      }
    })
  },
  //关闭隐藏js
  checkyxbtn2: function(e) {
    this.setData({
      sharebtn2: (!this.data.sharebtn2)
    });
  },
  checkyxbtn3: function(e) {
    this.setData({
      sharebtn: (!this.data.sharebtn)
    });
  },
})