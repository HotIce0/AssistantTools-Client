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
    url: Config.service.getBindStatus,
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
 * 参数：
 * isStudent: bool类型
 * name
 * jobId
 * idCard
 * class_id(当用户为学生时填写)
 * college_id(当用户为教师时填写)
 */
var bind = function(options) {
  options = Utils.extend({}, defaultOptions, options);
  //调用服务器平台账号绑定接口
  var data = null;
  if(options.isStudent){
    data = {
      "name": options.name,
      "jobId": options.jobId,
      "idCard": options.idCard,
      "classID": options.class_id,
    };
  }else{
    data = {
      "name": options.name,
      "jobId": options.jobId,
      "idCard": options.idCard,
      "collegeID": options.college_id,
    };
  }
  Client.request({
    url: Config.service.bind,
    method: "POST",
    data: data,
    success: res => {
      var data = res.data;
      options.success(data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};

/**
 * 从服务器获取个人课表数据
 * 参数：
 * latest 是否获取最新数据(最新数据从学院网站爬取)
 * current: 是否是当前学期学年
 * year: 学年（可选）当current为否时，必填
 * term: 学期 (可选) 当current为否时，必填
 */
var getPersonalCourseTableData = function(options) {
  options = Utils.extend({}, defaultOptions, options);
  var data = new Object();
  if(options.latest){
    data.needLatest = 1;
  }
  if(!options.current){
    data.year = options.year;
    data.term = options.term;
  }
  //调用服务器课表获取接口(获取服务器上备份的课表数据)
  Client.request({
    url: Config.service.getCourseTableUrl,
    method: "POST",
    data: data,
    success: res => {
      var data = res.data;
      options.success(data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};

/**
 * 获取学院列表
 */
var getColleges = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  Client.request({
    url: Config.service.getColleges,
    success: res => {
      options.success(JSON.parse(res.data.colleges));
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};

/**
 * 获取专业列表
 * 参数：
 * college_id : 学院ID
 */
var getMajors = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  var urlParam = '?college_id=' + options.college_id.toString();
  Client.request({
    url: Config.service.getMajors + urlParam,
    success: res => {
      options.success(JSON.parse(res.data.majors));
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};

/**
 * 获取班级列表
 * 参数：
 * major_id : 专业ID
 */
var getClass = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  var urlParam = '?major_id=' + options.major_id.toString();
  Client.request({
    url: Config.service.getClass + urlParam,
    success: res => {
      options.success(JSON.parse(res.data.class));
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};

module.exports = {
  isBinded: isBinded,
  bind: bind,
  getPersonalCourseTableData: getPersonalCourseTableData,
  getColleges: getColleges,
  getMajors: getMajors,
  getClass: getClass,
};