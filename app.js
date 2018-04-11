var client = require('./vendor/miniprogram-laravel-sdk/index.js');
var Session = require('./vendor/miniprogram-laravel-sdk/lib/session.js');
var Util = require('./utils/util.js');
var Config = require('./config.js');
//app.js
App({
  onLaunch: function () {
    //判断是否拥有用户信息授权
    wx.getSetting({
      success: res => {
        if(res.authSetting["scope.userInfo"]){
          //用户信息已经授权,登陆到服务器
          wx.showLoading({
            title: '登陆中',
            mask: true,
            success: res => {
              client.login({
                loginUrl: Config.service.loginUrl,
                success: userInfo => {
                  this.globalData.userInfo = JSON.parse(userInfo);
                  wx.hideLoading();
                },
                fail: function (error) {
                  Util.showModel("登陆失败", error)
                  wx.hideLoading();
                },
              });
            }
          })
        }
      }
    })
    //登陆到服务器
    // wx.showLoading({
    //   title: '登陆中',
    //   mask: true,
    //   success: res => {
    //     client.login({
    //       loginUrl: Config.service.loginUrl,
    //       success: userInfo => {
    //         this.globalData.userInfo = JSON.parse(userInfo);
    //         wx.hideLoading();
    //       },
    //       fail: function (error) {
    //         Util.showModel("登陆失败", error)
    //         wx.hideLoading();
    //       },
    //     });
    //   }
    // })
    
    
    
    

    // client.setLoginUrl('http://localhost/AssistantTools/public/miniprogram/login');
    // //请求测试
    // client.request({
    //   url: 'http://localhost/AssistantTools/public/miniprogram/textRequest',
    //   success: function (res) {
    //     console.log(res);
    //   },
    //   fail: function (error) {
    //   }
    // });
  },
  globalData: {
    /* 用户信息 */
    userInfo: null,
    /* 微信用户是否已经绑定了(学生或老师)用户信息 */
    userIsBinded: false,
  },
})