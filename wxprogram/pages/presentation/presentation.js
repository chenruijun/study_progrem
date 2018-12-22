// pages/Presentation/Presentation.js
import NumberAnimate from "../../utils/NumberAnimate";
import * as echarts from '../../ec-canvas/echarts';
const util = require('../../utils/util.js')
const app = getApp();
Page({
  data: {
    ecradar: {
      lazyLoad: true
    }, // 延迟加载
    value1: '', //教育背景值
    value2: '', //语言成绩值
    value3: '', //学术考试值
    value4: '', //实践几领导力值
    value5: '', //科研论文值
    maxvalue1: '', //max教育背景值
    maxvalue2: '', //max语言成绩值
    maxvalue3: '', //max学术考试值
    maxvalue4: '', //max实践几领导力值
    maxvalue5: '', //max科研论文值
    country: '', //国家
    major: '', //专业
    score: '', //得分
    ratio: '', //占比
    summary: '', // 竞争目标概述
    jy_score: '', //教育背景得分
    angle: 0,
    animationData: {},
    avatarUrl: '', //头像
    nickName: '', //昵称
    showView: "ture",
    showView2: "ture",
    showView3: "ture",
    list: [],
    school: [], //学校
    yy_text: [],
    sj_text: [],
    phonecode: '',
    yzcode: '',
    getText: '获取验证码',
    getChange: true,
    zhengTrue: false,
    disabled: false,
    report: '',
    state: '',
    showloading: false,
    hs: '',
    ett1: [],
    ett2: [],
    test: false
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
      backgroundColor: "#F2F4F7",
      tooltip: {
        zlevel: 1,
        z: 1
      },
      calculable: true,
      radar: {
        name: {
          textStyle: {
            color: '#666'
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
            color: ["#F2F4F7"] // 图表背景网格的颜色
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

  //显示手机信息采集弹窗
  showModal: function() {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    });
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.opacity(0).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
  },
  // 登录手机验证
  bindKeyInput: function(e) { //获取提交phone的json数据
    this.setData({
      phonecode: e.detail.value
    })
  },
  yanzhengInput: function(e) { //获取提交验证码的json数据
    this.setData({
      yzcode: e.detail.value
    })
  },
  formSubmit: function(e) { //查看详细报告提交验证函数
    var that = this;
    var yanzheng = that.data.yzcode; //用户输入的验证码
    var phone = that.data.phonecode; //用户输入的手机号
    var user = wx.getStorageSync('user');
    that.setData({
      yanzheng: yanzheng,
      zhengTrue: false,
    })
    var myreg = /^1\d{10}$/; //手机正则式
    if (phone == '') { //判断验证手机号为空
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (!myreg.test(phone)) { //判断验证手机号
      wx.showToast({
        title: '手机号码有误！',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else if (yanzheng == '') { //判断验证码是否为空
      wx.showToast({
        title: '请输入验证码！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.request({
      url: 'https://api.bailitop.com/wechat/v2/userduanxins?',
      data: {
        phone: phone,
        code: yanzheng,
        openid: app.globalData.openid,
        test_from: that.data.state
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.status == 200) {
          wx.showToast({
            title: '验证成功',
            icon: 'success',
            duration: 1000
          })
          that.setData({
            zhengTrue: true
          })
          // 测评报告页面判断跳转
          if (that.data.state == 1) {
            //关闭手机信息采集弹窗
            if (that.data.zhengTrue == true) {
              that.setData({
                showView2: (!that.data.showView2)
              });
              // 页面滚动js
              wx.pageScrollTo({
                scrollTop: 530,
                duration: 300
              })
              // 隐藏遮罩层
              var animation = wx.createAnimation({
                duration: 200,
                timingFunction: "linear",
                delay: 0
              })
              that.animation = animation
              animation.translateY(300).step()
              that.setData({
                animationData: animation.export(),
              })
              setTimeout(function() {
                animation.translateY(0).step()
                that.setData({
                  animationData: animation.export(),
                  showModalStatus: false
                })
              }.bind(this), 200)
            }
          }
          // 选校报告页面判断跳转
          if (that.data.state == 2) {
            wx.redirectTo({
              url: '../school_report/school_report',
            })
          }
        }
        if (res.data.message == '已是最新的手机号') {
          that.setData({
            zhengTrue: false,
          })
          wx.showModal({
            content: '手机号已存在请更换手机号重新验证',
            showCancel: false,
          })
        }
        if (res.data.message == '验证码有误') {
          that.setData({
            zhengTrue: false,
          })
          wx.showToast({
            title: '验证码输入错误',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  // 获取验证码按钮事件验证
  yanzhengBtn: function(e) {
    var n = 59;
    var that = this;
    var myreg = /^1\d{10}$/; //手机正则式
    var getChange = that.data.getChange
    var phone = that.data.phonecode;
    if (phone == '') { //验证手机号为空
      wx.showToast({
        title: '请输入手机号！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (!myreg.test(phone)) {
      wx.showToast({
        title: '手机号码有误！',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (getChange) {
        that.setData({
          disabled: true
        })
        this.setData({
          getChange: false
        })
        var time = setInterval(function() {
          var str = '(' + n + ')' + '重新获取'
          that.setData({
            getText: str
          })
          if (n <= 0) {
            that.setData({
              getChange: true,
              getText: '重新获取',
              disabled: false
            })
            clearInterval(time);
          }
          n--;
        }, 1000);
        wx.request({
          url: 'https://api.bailitop.com/system/v2/messages/5?',
          data: {
            pnum: phone
          },
          header: {
            'content-type': 'application/json'
          },
          success: function(res) {
            if (res.data.status == 200) {
              wx.showToast({
                title: '短信发送成功',
                icon: 'success',
                duration: 2000
              })
            }
          }
        })
      }
    }
  },
  // 循环遍历竞争目标概述文字调取
  onTap: function(e) {
    var index = e.currentTarget.dataset.index; //取出“点的是第几个标题”
    var list = this.data.list;
    var data = list[index];
    data.flag = !data.flag; //toggle
    this.setData({
      list: list,
    });
  },
  //关闭隐藏js
  checkyxbtn: util.throttle(function(e) {
    var that = this;
    wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests/share?type=1&uid=' + app.globalData.openid,
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.status == 200) {
          if (res.data.data.share == 1) {
            that.setData({
              test: (!that.data.test)
            });
          } else {
            wx.redirectTo({
              url: '../school_report/school_report',
            })
          }
        }
      }
    })
  },1000),
  checkyxbtn2: function(e) {
    this.setData({
      test: (!this.data.test)
    });

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
      if (res.target.id == 'report_sharebtn2') {
        that.setData({
          test: (!that.data.test)
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
    } else {
      return {
        title: app.convertHtmlToText(that.data.hs),
        path: '/pages/index/index'
      }
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
      success: function (res) {
        if (res.data.status == 200) {
          wx.redirectTo({
            url: '../school_report/school_report',
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // 获取传入参数
    that.setData({
      state: options.state,
      report: options.report
    })
    // 分享到群展示启用
    wx.showShareMenu({
      withShareTicket: true
    })
    // 接口数据调用
    const requestTask = wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests?uid=' + app.globalData.openid + '&device=4',
      method: "GET",
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        if (res.data.status == 200) {
          that.setData({
            showloading: true,
            avatarUrl: (res.data.data.avatar_url), //头像
            nickName: (res.data.data.nick_name), //昵称
            country: (res.data.data.target), //国家
            major: (res.data.data.intention), //专业
            score: (res.data.data.score), //得分
            ratio: (res.data.data.proportion), //占比
            summary: app.convertHtmlToText(res.data.data.describe), //概述
            school: (res.data.data.data[0].data), //大学
            list: (res.data.data.data),
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
            yy_text: (res.data.data.data[1].data),
            sj_text: (res.data.data.data[3].data),
            hs: (res.data.hs),
            ett1: (res.data.data.data[4].data),
            ett2: (res.data.data.data[2].data)
          })
          // 得分数字累加效果
          let num = that.data.score;
          let n = new NumberAnimate({
            from: num,
            speed: 2000,
            decimals: 0,
            refreshTime: 100,
            onUpdate: () => {
              that.setData({
                num: n.tempValue
              });
            }
          });
          if (res.data.data.phone == 1) {
            that.setData({
              showView2: false
            })
          } else {
            that.setData({
              showView2: true
            })
          }
        }
        // 启动Echart图表构造方法
        that.barComponent = that.selectComponent('#mychart-dom-rabar');
        that.init_bar();
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 重力感应js效果
    var _this = this;
    wx.onAccelerometerChange(function(res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (_this.data.angle !== angle) {
        _this.setData({
          angle: angle
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
  
});