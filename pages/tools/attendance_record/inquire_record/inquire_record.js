var ATAPI = require('./../../../../api/AssistantToolsAPI.js')
var Util = require('./../../../../utils/util.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    yearTermRange: null,
    year: "2017",
    term: 0,
    terms: [
      "上学期",
      "下学期",
    ],
    weekth: 0,//周次
    weekths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    week: 0,
    weeks: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    sections: ['无用', '一', '二', '三', '四', '五'],
    attendanceRecords: null,
    isFirstLoad: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取并设置 学年，学期范围
    ATAPI.getYearTermRange({
      success: data => {
        this.setData({
          yearTermRange: data,
          startYear: data.start[0],
          endYear: data.end[0],
        })
        //设置当前的学年、学期、周次、星期初始值
        this.setData({
          year: app.globalData.currentYear.toString(),
          term: app.globalData.currentTerm - 1,
          weekth: app.globalData.currentWeekth - 1,
          week: app.globalData.currentWeek - 1,
          isFirstLoad: false,
        })

        //更新考勤记录
        this.updateAttendanceRecord();
      },
      fail: error => {
        Util.showModel("获取学年学期范围失败 : ", error);
      }
    })
  },

  bindYearPickerChange: function (even) {
    if (this.isYearTermOverRange(even.detail.value, this.data.term)) {
      this.setData({
        year: '' + even.detail.value,
      })
      //更新考勤记录
      this.updateAttendanceRecord();
    }
  },

  bindTermPickerChange: function (even) {
    if (this.isYearTermOverRange(this.data.year, even.detail.value)) {
      this.setData({
        term: '' + even.detail.value,
      })
      //更新考勤记录
      this.updateAttendanceRecord();
    }
  },

  bindWeekthPickerChange: function (even) {
    this.setData({
      weekth: '' + even.detail.value,
    })
    //更新考勤记录
    this.updateAttendanceRecord();
  },

  bindWeekPickerChange: function (even) {
    this.setData({
      week: '' + even.detail.value,
    })
    //更新考勤记录
    this.updateAttendanceRecord();
  },
  /**
   * 判断是否超过学年学期范围
   */
  isYearTermOverRange(year, term) {
    if (this.data.yearTermRange.end[0] == year) {
      if ((parseInt(term) + 1) > parseInt(this.data.yearTermRange.end[1])) {
        Util.showModel("提示", "该学期考勤记录暂时无法查看!");
        return false;
      }
    } else if (this.data.yearTermRange.start[0] == year) {
      if ((parseInt(term) + 1) < parseInt(this.data.yearTermRange.start[1])) {
        Util.showModel("提示", "该学期考勤记录暂时无法查看!");
        return false;
      }
    }
    return true;
  },
  /**
   * 更新考勤记录数据
   */
  updateAttendanceRecord: function () {
    //考勤记录是否存在
    ATAPI.isAttendanceRecordExist({
      year: this.data.year,
      term: parseInt(this.data.term) + 1,
      success: isExist => {
        if (isExist) {
          //如果存在就去获取考勤记录数据
          ATAPI.getAttendanceRecord({
            year: this.data.year,
            term: parseInt(this.data.term) + 1,
            weekth: this.data.weekths[this.data.weekth],
            week: parseInt(this.data.week) + 1,
            success: data => {
              //考勤记录数据处理
              //数据存储到缓存，用于修改，保存页面使用
              wx.setStorageSync("attendanceRecords", data.data)
              this.setData({
                attendanceRecords: data.data
              })

            },
            fail: error => {
              Util.showModel("获取考勤记录失败", error);
            }
          })
        } else {
          //如果不存在，就询问用户是否需要生成考勤数据
          wx.showModal({
            title: '提示',
            content: this.data.year + '年' + this.data.terms[this.data.term] + '的考勤数据不存在，是否要生成考勤数据?',
            success: res => {
              if (res.confirm) {
                ATAPI.generateAttendanceRecord({
                  year: this.data.year,
                  term: parseInt(this.data.term) + 1,
                  success: data => {
                    if (data.error) {
                      Util.showModel("生成考勤记录数据失败 : ", data.error);
                    } else {
                      wx.showToast({
                        title: '考勤记录生成成功!',
                        icon: 'success',
                        duration: 2000
                      })

                      //再次更新考勤记录
                      this.updateAttendanceRecord();
                    }
                  },
                  fail: error => {
                    Util.showModel("生成考勤记录数据失败,请重试!", error);
                  }
                })
              } else if (res.cancel) {

              }
            }
          })
        }
      },
      fail: error => {
        Util.showModel("判断是否存在考勤记录失败", error);
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
    //只要不是第一次加载
    if (!this.data.isFirstLoad){
      //更新考勤记录
      this.updateAttendanceRecord();
    }
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