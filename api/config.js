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
    //GET获取绑定状态，接口地址
    getBindStatus: `${host}/api/bind/getBindStatus`,
    //POST绑定平台账号，接口地址
    bind: `${host}/api/bind/bind`,
    //POST获取个人课程表，数据接口地址
    getCourseTableUrl: `${host}/api/courseTable/getPersonalCourseTable`,
    //GET获取学院列表，数据接口地址
    getColleges: `${host}/api/basicInfo/colleges`,
    //GET获取专业列表，数据接口地址
    getMajors: `${host}/api/basicInfo/majors`,
    //GET获取班级列表，数据接口地址
    getClass: `${host}/api/basicInfo/class`,
    //GET获取学年学期范围，数据接口地址
    getYearTermRange: `${host}/api/basicInfo/getYearTermRange`,
    //POST获取考勤记录，数据接口
    getAttendanceRecord: `${host}/api/attendanceRecord/getAttendanceRecord`,
  }
};

module.exports = config;