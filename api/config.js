/**
 * 小程序配置文件
 */

// 主机域名
var host = 'http://192.168.0.100/AssistantTools/public';

var config = {
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/api/login`,
    //GET获取绑定状态接口地址
    getBindStatus: `${host}/api/bind/getBindStatus`,
    //POST绑定平台账号，接口地址
    bind: `${host}/api/bind/bind`,
    //POST获取个人课程表数据接口地址
    getCourseTableUrl: `${host}/api/courseTable/getPersonalCourseTable`,
  }
};

module.exports = config;