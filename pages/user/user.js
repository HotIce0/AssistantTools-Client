// pages/user/user.js
var client = require('../../vendor/miniprogram-laravel-sdk/index.js');
var Util = require('../../utils/util.js');
var Config = require('../../config.js');
//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    }
  },
  /* 获取用户信息并登陆到服务器 */
  getUserInfo: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      })
    }else{
      //登陆到服务器
      wx.showLoading({
        title: '登陆中',
        mask: true,
        success: res => {
          client.login({
            loginUrl: Config.service.loginUrl,
            success: userInfo => {
              //存储用户信息
              app.globalData.userInfo = JSON.parse(userInfo);
              wx.hideLoading();
              this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true,
              })
              //访问接口判断，微信用户是否已经绑定（学生或老师）用户
            },
            fail: function (error) {
              Util.showModel("登陆失败", error)
              wx.hideLoading();
            },
          });
        }
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