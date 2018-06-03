// pages/tools/attendance-record/attendance_record.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menus: [
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //能进行本班考勤的权限 12
    if (app.globalData.permission[12]) {
      this.setData({
        menus: this.data.menus.concat([{
          url: './inquire_record/inquire_record',
          imgUrl: '../../../images/attendance_record.png',
          chName: '查询本班考勤记录',
          hasNews: false,
          newsCount: 0,
        }])
      })
    }
    //查询考勤统计数据的权限 11
    if (app.globalData.permission[11]) {
      this.setData({
        menus: this.data.menus.concat([{
          url: './attendance_record_show/attendance_record_show',
          imgUrl: '../../../images/statistics.png',
          chName: '考勤情况统计',
          hasNews: false,
          newsCount: 1,
        }])
      })
    }
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