// pages/tools/personal_course_table/personal_course_table.js

var ATAPI = require('../../../api/AssistantToolsAPI.js')
var Util = require('../../../utils/util.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parseCourses: null,
    swiperCurrent: 0,
    weekShow: [0, '一', '二', '三', '四', '五', '六', '日'],
    year: '2018',
    term: 0,
    terms: ['上学期', '下学期'],
    needLatest: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //Year Picker初始化
    var date = new Date();
    this.setData({
      year: date.getFullYear(),
    })

    //调用接口获取个人课表
    ATAPI.getPersonalCourseTableData({
      latest: false,
      current: false,
      year: app.globalData.currentYear,
      term: app.globalData.currentTerm,
      success: data => {
        if(data.error){
          Util.showModel("获取个人课表失败 : ", data.error);
        }else{
          var parseCourses = JSON.parse(data.courses);
          if (Object.keys(parseCourses).length === 0) {
            wx.showToast({
              title: "提示：您" + data.year + "年" + this.data.terms[data.term - 1] + "课程表数据不存在!",
              icon: 'none',
              duration: 2000
            })
          }
          //获取星期
          var date = new Date();
          var parseDay = [6, 0, 1, 2, 3, 4, 5];
          this.setData({
            term: data.term - 1,
            year: data.year,
            parseCourses: parseCourses,
            swiperCurrent: parseDay[date.getDay()],
          })
        }
      },
      fail: error => {
        Util.showModel("获取个人课表失败 : ", error);
      }
    });
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
  onShareAppMessage: function () {
  
  },

  bindYearPickerChange: function (event) {
    this.setData({
      year: event.detail.value,
    })
    this.formGetCourseData();
  },

  bindTermPickerChange: function (event) {
    this.setData({
      term: event.detail.value,
    })
    this.formGetCourseData();
  },
  switchNeedLatestChanged: function(event){
    this.setData({
      needLatest: event.detail.value,
    })
    this.formGetCourseData();
  },
  /**
   * 获取课程表信息。当学年，学期，获取最新更改时
   */
  formGetCourseData: function (){
    //调用接口获取个人课表
    ATAPI.getPersonalCourseTableData({
      latest: this.data.needLatest,
      current: false,
      year: parseInt(this.data.year),
      term: parseInt(this.data.term) + 1,
      success: data => {
        if (data.error) {
          Util.showModel("获取个人课表失败 : ", data.error);
        } else {
          var parseCourses = JSON.parse(data.courses);
          if (Object.keys(parseCourses).length === 0){
            wx.showToast({
              title: "提示：您" + data.year + "年" + this.data.terms[data.term - 1] + "课程表数据不存在!",
              icon: 'none',
              duration: 2000
            })
          }
          //获取星期
          var date = new Date();
          var parseDay = [6, 0, 1, 2, 3, 4, 5];
          this.setData({
            term: data.term - 1,
            year: data.year.toString(),
            parseCourses: parseCourses,
            swiperCurrent: parseDay[date.getDay()],
          })
        }
      },
      fail: error => {
        Util.showModel("获取个人课表失败 : ", error);
      }
    });
  }
})