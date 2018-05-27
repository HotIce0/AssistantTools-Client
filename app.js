var Client = require('./vendor/miniprogram-laravel-sdk/index.js')
var Session = require('./vendor/miniprogram-laravel-sdk/lib/session.js')
var Util = require('./utils/util.js')
var Config = require('./api/config.js')
var ATAPI = require('./api/AssistantToolsAPI.js')
//app.js
App({
  onLaunch: function () {
    this.login();
  },
  globalData: {
    //权限的最大个数
    permissionMaxNum: 30,
    /* 用户信息 */
    userInfo: null,
    /* 微信用户是否已经绑定了(学生或老师)用户信息 */
    userIsBinded: false,
    /* 当前学年数据 */
    currentYear: null,
    /* 当前学期数据 */
    currentTerm: null,
    /* 当前周次数据 */
    currentWeekth: null,
    /* 当前星期数据 */
    currentWeek: null,
    /* 当前用户拥有的权限 */
    userPermissions: [],
    /**
     * 经过处理的权限
     */
    permission: [],
  },
  hasPermission: function (permission) {
    for (var key in this.globalData.userPermissions) {
      if (permission == this.globalData.userPermissions[key])
        return true;
    }
    return false;
  },
  /**
   * 对权限进行处理(方便视图上权限控制)
   */
  permission: function(){
    var permission = [];
    for (var i = 0; i < this.globalData.permissionMaxNum; i++){
      if(this.hasPermission(i)){
        this.globalData.permission[i] = true;
      }else{
        this.globalData.permission[i] = false;
      }
    }
  },login: function () {
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
                  if (this.globalData.userIsBinded) {
                    //如果绑定了账号，就获取拥有的权限
                    ATAPI.getPermissions({
                      success: res => {
                        this.globalData.userPermissions = JSON.parse(res.data)
                        this.permission();
                      },
                      fail: error => {
                        Util.showModel("获取权限数据失败 ", error);
                      }
                    })
                  }
                  Util.showBusy("获取基础信息中...");
                  //获取当前的学年，学期
                  ATAPI.getCurrentYearTerm({
                    success: data => {
                      if(data.error){
                        Util.showModel("获取当前学年学期数据失败 ", data.error);
                      }else{
                        this.globalData.currentYear = parseInt(data.data[0]);
                        this.globalData.currentTerm = parseInt(data.data[1]);
                      }
                    },
                    fail: error => {
                      Util.showModel("获取当前学年学期数据失败 ", error);
                    },
                  })
                  //获取当前的周次和星期
                  ATAPI.getCurrentWeekthWeek({
                    success: data => {
                      if (data.error) {
                        Util.showModel("获取当前周次和星期数据失败 ", data.error);
                      } else {
                        this.globalData.currentWeekth = parseInt(data.data[0]);
                        this.globalData.currentWeek = parseInt(data.data[1]);
                      }
                    },
                    fail: error => {
                      Util.showModel("获取当前周次和星期数据失败 ", error);
                    },
                  })
                  wx.hideToast();
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
  }
})