var Client = require('./vendor/miniprogram-laravel-sdk/index.js')
var Session = require('./vendor/miniprogram-laravel-sdk/lib/session.js')
var Util = require('./utils/util.js')
var Config = require('./api/config.js')
var ATAPI = require('./api/AssistantToolsAPI.js')
//app.js
App({
  onLaunch: function () {
    // while(true){
    //   wx.request({
    //     method: 'POST',//http://bkjw.hnist.cn/jsxsd/xk/LoginToXk
    //     url: 'http://uia.hnist.cn/sso/login?service=http://bkjw.hnist.cn/jsxsd/',//' or 1=1 #
    //     data: {
    //       username: "14162400891",//MDA3MzJnYW5qaW5n
    //     },
    //     header: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     success: res => {
    //       console.log(res.data)
    //     },
    //     fail: error => {
    //       console.log(error)
    //     }
    //   })
    //   console.log('sao');
    // }
    // wx.request({
    //   method: 'POST',//http://bkjw.hnist.cn/jsxsd/xk/LoginToXk
    //   url: 'http://uia.hnist.cn/sso/login?service=http://bkjw.hnist.cn/jsxsd/',//' or 1=1 #
    //   data: {
    //     username: "14162400891",//MDA3MzJnYW5qaW5n
    //   },
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   success: res => {
    //     console.log(res.data)
    //   },
    //   fail: error => {
    //     console.log(error)
    //   }
    // })

    //判断是否拥有用户信息授权
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          //用户信息已经授权,登陆到服务器
          Client.login({
            loginUrl: Config.service.loginUrl,
            success: userInfo => {
              this.globalData.userInfo = JSON.parse(userInfo);
              //获取用户绑定状态
              ATAPI.isBinded({
                success: res => {
                  //存储绑定状态
                  this.globalData.userIsBinded = res;
                  //重新加载到首页
                  wx.reLaunch({
                    url: '/pages/index/index',
                  })
                },
                fail: error => {
                  Util.showModel("获取绑定状态失败", error);
                }
              });
            },
            fail: error => {
              Util.showModel("登陆失败", error);
            },
          });
        }else{
          wx.showTabBar({})
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