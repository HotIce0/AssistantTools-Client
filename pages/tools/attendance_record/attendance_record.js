// pages/tools/attendance-record/attendance_record.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menus: [
      {
        url: './inquire_record/inquire_record',
        imgUrl: '../../../images/attendance_record.png',
        chName: '查询本班考勤记录',
        hasNews: false,
        newsCount: 0,
      },
      {
        url: './attendance_record_show/attendance_record_show',
        imgUrl: '../../../images/statistics.png',
        chName: '考勤情况统计',
        hasNews: true,
        newsCount: 1,
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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