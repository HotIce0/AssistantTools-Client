// pages/user/admin.js
var Util = require('../../utils/util.js')
var ATAPI = require('../../api/AssistantToolsAPI.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  updataYearTermNow: function(even){
    wx.showLoading({
      title: "服务器更新数据中",
    })
    ATAPI.getPersonalCourseTableData({
      latest: true,
      current: true,
      success: res => {
        wx.hideLoading()
        if (res.error) {
          Util.showModel("从学院网站更新现在的学年学期失败! ", '');
        } else {
          wx.showToast({
            title: "数据更新成功",
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: error => {
        wx.hideLoading()
        Util.showModel("从学院网站更新现在的学年学期失败! ", error);
      }
    })
  },
  updataSchoolStartDate: function(even){
    wx.showLoading({
      title: "服务器更新数据中",
    })
    ATAPI.updataSchoolStartDate({
      success: res => {
        wx.hideLoading()
        if(res.error){
          Util.showModel("从学院网站更新每学期的开学日期失败! ", res.error);
        }else{
          wx.showToast({
            title: "数据更新成功",
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: error => {
        wx.hideLoading()
        Util.showModel("从学院网站更新每学期的开学日期失败! ", error);
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