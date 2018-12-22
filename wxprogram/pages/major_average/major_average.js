const app = getApp();
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showloading: false,
    average: '0',
    currentItem: -1,
    zimu: [],
    sum: '',
    first: [],
    option: [],
    xh_index: 1,
    yxValue: '',
    majorForNow: '',
    yuanxiaoSource: [],
    majorSource: [],
    bindyxSource: [],
    bindmajorSource: [],
    state: true,
    sel_list: true,
    state1: true,
    hover: true,
    hover1: true,
    country: '',
    major: '',
    id: '',
    major_id: '',
    text_major: false,
    select_options: false,
    read_school: false,
    addclass: false,
    disabled: true,
    disabled1: true,
    fuzhi: false,
    sendData: [],
    country_option: '',
    pid: '',
    school: '',
    jzl: '',
    ab_school: '',
    show_option:[],
  },
  onLoad: function (options) {
    var that = this
    if (that.data.fuzhi == false) {
      that.setData({
        country: options.country,
        major: options.major,
        form_id: options.form_id,
        major_id: options.major_id
      })
    }
    wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests/chinauniversity',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == 200) {
          that.setData({
            yuanxiaoSource: (res.data.data)
          })
          wx.setStorageSync('storage', that.data.yuanxiaoSource)
        }

      }
    })
   wx.request({
      url: 'https://api.bailitop.com/wechat/v2/showtests/chinamajor',
      method: "GET",
      header: {
        'content-type': 'application/json'
      },

      success: function (res) {
        if (res.data.status == 200) {
          that.setData({
            majorSource: (res.data.data)
          })
          wx.setStorageSync('major', that.data.majorSource)
        }
      }
    })
    const requestTask = wx.request({
      url: 'https://api.bailitop.com/wechat/v2/dos/1?form=' + that.data.form_id, 
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == 200) {
          that.setData({
            showloading: true,
            xh_index: that.data.xh_index,
            zimu: (res.data.data.content[that.data.xh_index]),
            option: (res.data.data.content),
            sum: (res.data.data.sNum),
            jzl: (res.data.data.Jzl)

          })
          if (that.data.zimu.type == 2) {
            if (that.data.zimu.inputType == "院校") {
              that.setData({
                read_school: true,
                select_options: false,
                text_major: false
              })
            }
            if (that.data.zimu.inputType == "专业") {
              that.setData({
                read_school: false,
                select_options: false,
                text_major: true
              })
            }
          } else {
            that.setData({
              read_school: false,
              select_options: true,
              text_major: false
            })
          }
        }
      }
    })
    
  },
  //当键盘输入时，触发院校input事件
  bindyx: function (e) {
    var that=this
    
    var prefix = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    wx.getStorage({
      key: 'storage',
      success: function(res) {
        if (prefix != "") {
          res.data.forEach(function (e) {
            if (e.title.indexOf(prefix) != -1) {
              newSource.push(e)
            }
          })
        }
        if (newSource.length != 0) {
          that.setData({
            bindyxSource: newSource,
            state: false,
            sel_list: false

          })
        } else {
          that.setData({
            bindyxSource: []
          })
        }
      },
    })
    
  },
  itemtap: function (e) {
    this.setData({
      bindyxSource: [],
      hover: false,
      disabled: false,
      sel_list: true,
      country_option: e.target.dataset.type,
      pid: e.target.dataset.pid,
      school: e.target.dataset.text,
    })
  },
  //当键盘输入时，触发专业input事件
  bindmajor: function (e) {
    var that=this
    var prefix = e.detail.value//用户实时输入值
    var newSourcemajor = []//匹配的结果
    wx.getStorage({
      key: 'major',
      success: function (res) {
        if (prefix != "") {
          res.data.forEach(function (e) {
            if (e.title.indexOf(prefix) != -1) {
              newSourcemajor.push(e)
            }
          })
        }
        if (newSourcemajor.length != 0) {
          that.setData({
            bindmajorSource: newSourcemajor,
            state1: false
          })
        } else {
          that.setData({
            bindmajorSource: []
          })
        }
      }
    })
    
  },
  itemtap1: function (e) {
    this.setData({
      majorForNow: e.target.dataset.text,
      bindmajorSource: [],
      hover1: false,
      disabled1: false,
    })
  },
  get_option: util.throttle(function (e) {
    var that = this
    var option = e.currentTarget.dataset.text
    var id = e.currentTarget.dataset.id
    var pid = e.currentTarget.dataset.pid
    var content = that.data.option
    var page_index = that.data.xh_index
    that.data.sendData.push({ id, pid, option })
    var index = e.currentTarget.dataset.index
    var okData = JSON.stringify(this.data.sendData)
    if (that.data.xh_index < that.data.sum) {
      that.setData({
        currentItem: index,
        addclass: true,
        fuzhi: true,
      })
        that.setData({
          xh_index: content[page_index].page,
        }) 
        that.setData({
          show_option: content[that.data.xh_index].option,
          zimu: content[that.data.xh_index]
        })
        setTimeout(function () {
          //要延时执行的代码 
          that.setData({
            addclass: false
          })
        }, 200)
    } else {
        that.setData({
          currentItem: index,
          addclass: true
        })
      setTimeout(function () {
      wx.redirectTo({
        url: '../guide/guide?country=' + that.data.country + "&major=" + that.data.major + "&jzl=" + that.data.jzl
      })
      },100)
      const requestTask = wx.request({
        url: 'https://api.bailitop.com/wechat/v2/dos',
        method: "POST",
        data: { form: that.data.form_id, major: that.data.major, uid: app.globalData.openid, selected: okData,device: 4 },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.status == 200) {
          }
        }
      })
    }
  },500),
  read_save: util.throttle(function () {
    var that = this
    var content = that.data.option
    var index = that.data.xh_index
    that.setData({
      fuzhi: true,
      xh_index: content[index].page,
      read_school: false,
      select_options: false,
      text_major: true
    })
    that.setData({
      zimu: content[that.data.xh_index],
    })

  },8000),
  read_ab_save: util.throttle(function (e) {
    var that = this
    var content=that.data.option
    var index = that.data.xh_index
    that.setData({
      fuzhi: true,
      country_option: '海外院校',
      ab_school: '海外院校',
      pid: e.currentTarget.dataset.id,
      xh_index: content[index].page,
      read_school: false,
      select_options: false,
      text_major: true
    })
    that.setData({
      zimu: content[that.data.xh_index],
    })
  },8000),
  read1_save: util.throttle( function () {
    var that = this
    var content = that.data.option
    var zimu=that.data.zimu
    var index = that.data.xh_index
    that.setData({
      fuzhi: true,
      xh_index: content[index].page,
      read_school: false,
      select_options: true,
      text_major: false,
    })
    that.setData({
      zimu: content[that.data.xh_index],
      show_option: content[that.data.xh_index].option
    })
    var option = this.data.country_option
    if (option == '海外院校') {
      var school = this.data.ab_school
    } else {
      var school = this.data.school
    }
    var majorForNow = this.data.majorForNow
    var pid = this.data.pid
    this.data.sendData.push({ id: '0', option, pid, school, majorForNow })
  },8000),
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