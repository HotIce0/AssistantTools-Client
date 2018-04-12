/**
 * 小程序配置文件
 */

// 主机域名
var host = 'http://localhost/AssistantTools/public';

var config = {
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/miniprogram/login`,
  }
};

module.exports = config;