var ATAPI = require('./../../../../api/AssistantToolsAPI.js')
var Util = require('./../../../../utils/util.js')

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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取,设置学年范围
    ATAPI.getYearTermRange({
      success: data => {
        this.setData({
          yearTermRange: data,
          startYear: data.start[0],
          endYear: data.end[0],
        })
      },
      fail: error => {
        Util.showModel("获取学年学期范围失败 : ", error);
      }
    })

  },

  bindYearPickerChange: function(even){
    this.setData({
      year: '' + even.detail.value,
    })
  },

  bindTermPickerChange: function (even) {
    //判断是否超过学年学期范围
    if (this.data.yearTermRange.end[0] == this.data.year){
      if ((parseInt(even.detail.value) + 1) > parseInt(this.data.yearTermRange.end[1])){
        Util.showModel("提示", "学期超过范围!");
        return ;
      }
    } else if (this.data.yearTermRange.start[0] == this.data.year){
      if ((parseInt(even.detail.value) + 1) < parseInt(this.data.yearTermRange.start[1])) {
        Util.showModel("提示", "学期超过范围!");
        return;
      }
    }
    this.setData({
      term: '' + even.detail.value,
    })
  },

  bindWeekthPickerChange: function (even) {
    this.setData({
      weekth: '' + even.detail.value,
    })
  },

  bindWeekPickerChange: function (even) {
    this.setData({
      week: '' + even.detail.value,
    })
  },
  /**
   * 更新考勤记录数据
   */
  updateAttendanceRecord: function(){
    ATAPI.getAttendanceRecord({
      year: this.data.year,
      term: parseInt(term) + 1,
      weekth: this.weekths[weekth],
      week: this.weeks[week],
      success: data => {
        console.log(data)
      },
      fail: error => {
        Util.showModel("获取考勤记录失败", error);
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
  onShareAppMessage: function () {

  }

  
})