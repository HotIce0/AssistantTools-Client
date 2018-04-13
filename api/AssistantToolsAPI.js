var Config = require('./config.js')
var Client = require('./../vendor/miniprogram-laravel-sdk/index.js')
var Utils = require('./../vendor/miniprogram-laravel-sdk/lib/utils.js')
/**
 * 初始化API，设置登陆地址。用于调用Client.request时，登陆Session失效，能自动根据Client.setLoginUrl设置的地址重新登陆
 */
var initialize = function () {
  Client.setLoginUrl(Config.service.loginUrl);
}();

var noop = function noop() { };
var defaultOptions = {
  success: noop,
  fail: noop,
};

/**
 * 判断微信用户是否已经绑定平台账号
 */
var isBinded = function(options) {
  options = Utils.extend({}, defaultOptions, options);
  //调用绑定状态查询接口
  Client.request({
    url: Config.service.host + '/api/bind/getBindStatus',
    success: res => {
      var bindstatus = res.data.bindstatus;
      options.success(bindstatus);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};
/**
 * 绑定平台账号
 */
var bind = function(options) {
  options = Utils.extend({}, defaultOptions, options);
  //调用服务器平台账号绑定接口
  Client.request({
    // /miniprogram/bind/bind
    url: Config.service.host + '/api/bind/bind',
    method: "POST",
    data: {
      "userName": options.userName,
      "password": options.password,
    },
    success: res => {
      var data = res.data;
      options.success(data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};

module.exports = {
  isBinded: isBinded,
  bind: bind,
};