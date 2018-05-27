// pages/tools/index.js
//获取应用实例
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gridTools: [],
    app: app,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取个人课程表的权限 1
    if (app.globalData.permission[1]) {
      this.setData({
        gridTools: this.data.gridTools.concat([{
          url: '/pages/tools/personal_course_table/personal_course_table',
          chName: '我的课程表',
          imgUrl: '../../images/course.png',
        }])
      })
    }
    //能考勤的基础权限 10
    if (app.globalData.permission[10]) {
      this.setData({
        gridTools: this.data.gridTools.concat([{
          url: '/pages/tools/attendance_record/attendance_record',
          chName: '考勤',
          imgUrl: '../../images/attendance.png',
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