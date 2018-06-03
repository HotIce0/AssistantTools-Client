var Config = require('./config.js')
var Client = require('./../vendor/miniprogram-laravel-sdk/index.js')
var Utils = require('./../vendor/miniprogram-laravel-sdk/lib/utils.js')
var constants = require('./../vendor/miniprogram-laravel-sdk/lib/constants.js')
var Session = require('./../vendor/miniprogram-laravel-sdk/lib/session.js')
var utils = require('./../vendor/miniprogram-laravel-sdk/lib/utils.js');
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
 * 无参数
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
 * college_id : 学院ID(必须)
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
 * GET获取班级列表
 * 参数：
 * major_id : 专业ID(必须)
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

/**
 * GET获取学年学期范围
 * 无参数
 */
var getYearTermRange = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  Client.request({
    url: Config.service.getYearTermRange,
    success: res => {
      options.success(res.data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};

/**
 * GET获取当前学年学期
 * 无参数
 */
var getCurrentYearTerm = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  Client.request({
    url: Config.service.getCurrentYearTerm,
    success: res => {
      options.success(res.data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};

/**
 * GET获取当前周次和星期
 * 无参数
 */
var getCurrentWeekthWeek = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  Client.request({
    url: Config.service.getCurrentWeekthWeek,
    success: res => {
      options.success(res.data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};

/**
 * POST获取考勤信息
 * 参数：
 * year(必须)
 * term(必须)
 * weekth(必须)
 * week(必须)
 */
var getAttendanceRecord = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  //调用服务器考勤信息获取接口
  Client.request({
    url: Config.service.getAttendanceRecord,
    method: "POST",
    data: {
      year: options.year,
      term: options.term,
      weekth: options.weekth,
      week: options.week,
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

/**
 * 生成考勤信息
 * 参数:
 * year 学年(必须)
 * term 学期(必须)
 */
var generateAttendanceRecord = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  //调用服务器考勤信息生成接口
  Client.request({
    url: Config.service.generateAttendanceRecord,
    method: "POST",
    data: {
      year: options.year,
      term: options.term,
    },
    success: res => {
      var data = res.data;
      options.success(data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
}

/**
 * 考勤记录数据是否存在
 * 参数:
 * year 学年(必须)
 * term 学期(必须)
 */
var isAttendanceRecordExist = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  //调用服务器考勤数据是否存在 数据接口
  Client.request({
    url: Config.service.isAttendanceRecordExist,
    method: "POST",
    data: {
      year: options.year,
      term: options.term,
    },
    success: res => {
      var data = res.data;
      options.success(data.data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
}

/**
 * 图片上传接口
 */
var uploadFile = function(options){
  options = Utils.extend({}, defaultOptions, options);
  //构建认证头
  var buildAuthHeader = function buildAuthHeader(session) {
    var header = {};
    if (session) {
      header[constants.WX_HEADER_SKEY] = session;
    }
    return header;
  };
  var authHeader = buildAuthHeader(Session.get());
  var originHeader = options.header || {};
  return wx.uploadFile({
    url: Config.service.uploadImgFile,
    filePath: options.filePath,
    name: options.name,
    header: utils.extend({}, authHeader, originHeader),
    formData: options.formData,
    success: res => {
      options.success(res);
    },
    fail: error => {
      options.fail(error);
    }
  })
}

/**
 * 图片地址，转化为url
 * 参数:
 * filePath
 */
var getDownloadImgFileUrl = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  //调用服务器考勤信息生成接口
  Client.request({
    url: Config.service.getDownloadImgFileUrl,
    method: "POST",
    data: {
      filePath: options.filePath
    },
    success: res => {
      var data = res.data;
      options.success(data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
}

/**
 * 图片下载接口
 */
var downloadFile = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  //构建认证头
  var buildAuthHeader = function buildAuthHeader(session) {
    var header = {};
    if (session) {
      header[constants.WX_HEADER_SKEY] = session;
    }
    return header;
  };
  var authHeader = buildAuthHeader(Session.get());
  var originHeader = options.header || {};
  return wx.downloadFile({
    url: options.url,
    header: utils.extend({}, authHeader, originHeader),
    success: res => {
      options.success(res);
    },
    fail: error => {
      options.fail(error);
    }
  })
}


/**
 * 提交考勤数据
 * 参数:
 * attendance_record_id
 * leavers_num
 * leave_detail
 * absenteeism_num
 * absenteeism_detail
 * mobile_num
 * imgFilePath
 */
var saveAttendanceRecord = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  //调用服务器考勤信息生成接口
  Client.request({
    url: Config.service.saveAttendanceRecord,
    method: "POST",
    data: {
      attendance_record_id: options.attendance_record_id,
      leavers_num: options.leavers_num,
      leave_detail: options.leave_detail,
      absenteeism_num: options.absenteeism_num,
      absenteeism_detail: options.absenteeism_detail,
      mobile_num: options.mobile_num,
      img_file_path: options.img_file_path,
    },
    success: res => {
      var data = res.data;
      options.success(data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
}

/**
 * 更新学年学期开学时间
 * 无参数
 */
var updataSchoolStartDate = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  Client.request({
    url: Config.service.updataSchoolStartDate,
    success: res => {
      options.success(res.data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};

/**
 * 获取拥有的权限的
 * 无参数
 */
var getPermissions = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  Client.request({
    url: Config.service.getPermissions,
    success: res => {
      options.success(res.data);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
};

/**
 * 查询考勤统计
 * 参数:
 * year(必须)
 * term(必须)
 * weekth(必须)
 * queryType(必须)1 查询指定学院的考勤统计信息,2 查询指定专业的考勤统计信息,3 查询指定班级的考勤统计信息
 * ids(必须)
 */
var queryAttendanceRecordStatisticalData = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  //调用服务器查询考勤统计接口
  Client.request({
    url: Config.service.queryAttendanceRecordStatisticalData,
    method: "POST",
    data: {
      year: options.year,
      term: options.term,
      weekth: options.weekth,
      queryType: options.queryType,
      ids: options.ids,
    },
    success: res => {
      var data = res.data;
      options.success(data, options.key);
    },
    fail: function (error) {
      options.fail(error);
    }
  });
}


module.exports = {
  isBinded: isBinded,
  bind: bind,
  getPersonalCourseTableData: getPersonalCourseTableData,
  getColleges: getColleges,
  getMajors: getMajors,
  getClass: getClass,
  getYearTermRange: getYearTermRange,
  getCurrentYearTerm: getCurrentYearTerm,
  getCurrentWeekthWeek: getCurrentWeekthWeek,
  getAttendanceRecord: getAttendanceRecord,
  generateAttendanceRecord: generateAttendanceRecord,
  isAttendanceRecordExist: isAttendanceRecordExist,
  uploadFile: uploadFile,
  saveAttendanceRecord: saveAttendanceRecord,
  getDownloadImgFileUrl: getDownloadImgFileUrl,
  downloadFile: downloadFile,
  updataSchoolStartDate: updataSchoolStartDate,
  getPermissions: getPermissions,
  queryAttendanceRecordStatisticalData, queryAttendanceRecordStatisticalData,
};