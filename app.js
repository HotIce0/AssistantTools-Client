var Client = require('./vendor/miniprogram-laravel-sdk/index.js')
var Session = require('./vendor/miniprogram-laravel-sdk/lib/session.js')
var Util = require('./utils/util.js')
var Config = require('./api/config.js')
var ATAPI = require('./api/AssistantToolsAPI.js')
//app.js
App({
  onLaunch: function () {
    //判断是否拥有用户信息授权
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          Util.showBusy("正在登陆中...");
          //用户信息已经授权,登陆到服务器
          Client.login({
            loginUrl: Config.service.loginUrl,
            success: userInfo => {
              wx.hideToast();
              this.globalData.userInfo = JSON.parse(userInfo);
              Util.showBusy("获取绑定状态中...");
              //获取用户绑定状态
              ATAPI.isBinded({
                success: res => {
                  wx.hideToast();
                  //存储绑定状态
                  this.globalData.userIsBinded = res;
                  //重新加载到首页
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                },
                fail: error => {
                  wx.hideToast();
                  Util.showModel("获取绑定状态失败", error);
                }
              });
            },
            fail: error => {
              wx.hideToast();
              Util.showModel("登陆失败", error);
            },
          });
        };
      }
    });
    //获取基础信息
    
  },
  globalData: {
    /* 用户信息 */
    userInfo: null,
    /* 微信用户是否已经绑定了(学生或老师)用户信息 */
    userIsBinded: false,
  },
})