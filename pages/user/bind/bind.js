// pages/user/bind/bind.js

var ATAPI = require('../../../api/AssistantToolsAPI.js')
var Util = require('../../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    colleges: null,
    collegeValue: 0,
    majors: null,
    majorValue: 0,
    class_s: null,
    classValue: 0,

    isStudent: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //更新Picker列表数据
    this.updatePickersData();
  },

  /**
   * 学院picker changed处理函数
   */
  pickerCollegeChanged: function(even){
    this.setData({
      collegeValue: even.detail.value,
      majorValue: 0,
      classValue: 0,
      class_s: null,
    })
    //更新Picker列表数据
    this.updatePickersData();
  },
  /**
   * 专业picker changed处理函数
   */
  pickerMajorChanged: function(even){
    this.setData({
      majorValue: even.detail.value,
      classValue: 0,
    })
    //更新班级列表
    this.updateClass();
  },
  /**
   * 班级picker changed处理函数
   */
  pickerClassChanged: function(even){
    this.setData({
      classValue: even.detail.value,
    })
  },

  /**
   * 更新Picker列表数据
   */
  updatePickersData: function(){
    //更新学院列表数据
    ATAPI.getColleges({
      success: colleges => {
        this.setData({
          colleges: colleges,
        })
        //更新专业列表数据
        ATAPI.getMajors({
          college_id: this.data.colleges[this.data.collegeValue].college_id,
          success: majors => {
            this.setData({
              majors: majors,
            })
            //确认专业信息存在
            if (!this.data.majors[this.data.majorValue])
              return;
            //更新班级列表数据
            ATAPI.getClass({
              major_id: this.data.majors[this.data.majorValue].major_id,
              success: class_s => {
                this.setData({
                  class_s: class_s,
                })
              },
              fail: error => {
                Util.showModel("获取班级列表失败: ", error);
              }
            });
          },
          fail: error => {
            Util.showModel("获取专业列表失败: ", error);
          }
        });
      },
      fail: error => {
        Util.showModel("获取学院列表失败: ", error);
      }
    })
  },
  /**
   * 更新学院列表数据
   */
  updateColleges: function(){
    ATAPI.getColleges({
      success: colleges => {
        this.setData({
          colleges: colleges,
        })
      },
      fail: error => {
        Util.showModel("获取学院列表失败: ", error);
      }
    })
  },
  /**
   * 更新专业列表数据
   */
  updateMajors: function(){
    //确认学院信息存在
    if (!this.data.colleges[this.data.collegeValue])
      return;
    ATAPI.getMajors({
      college_id: this.data.colleges[this.data.collegeValue].college_id,
      success: majors => {
        this.setData({
          majors: majors,
        })
      },
      fail: error => {
        Util.showModel("获取专业列表失败: ", error);
      }
    });
  },

  /**
 * 更新班级列表数据
 */
  updateClass: function () {
    //确认专业信息存在
    if (!this.data.majors[this.data.majorValue])
      return;
    ATAPI.getClass({
      major_id: this.data.majors[this.data.majorValue].major_id,
      success: class_s => {
        this.setData({
          class_s: class_s,
        })
      },
      fail: error => {
        Util.showModel("获取班级列表失败: ", error);
      }
    });
  },
  /**
   * 身份（角色）单选改变处理函数
   */
  roleRadioChange: function(even){
    var isStudent = even.detail.value == "教师" ? false : true;
    this.setData({
      isStudent: isStudent,
    })
  },

  /**
   * 微信用户绑定平台账号 的表单提交事件
   */
  doBind: function (event){
    //判断用户输入是否完整
    var inputComplete = true;
    var tip = '请输入 : ';
    if (inputComplete && !event.detail.value.name){
      inputComplete = false;
      tip += '姓名 ';
    }
    if (inputComplete && !event.detail.value.jobId) {
      inputComplete = false;
      tip += '学号或工号 ';
    }
    if (inputComplete && !event.detail.value.idCard) {
      inputComplete = false;
      tip += '身份证号码 ';
    }
    tip += '必须填写';
    if (!inputComplete) {
      //提示信息显示
      wx.showToast({
        title: tip,
        icon: "none",
      })
    } else {
      //获取college_id和class_id
      var college_id = this.data.colleges[this.data.collegeValue].college_id;
      var class_id = this.data.class_s[this.data.classValue].class_id;
      
      wx.showLoading({
        title: '服务器正在验证您的认证信息,请稍后...',
        mask: true,
        success: res => {
          //调用API向服务器请求平台账号绑定
          ATAPI.bind({
            isStudent: this.data.isStudent,
            name: event.detail.value.name,
            jobId: event.detail.value.jobId,
            idCard: event.detail.value.idCard,
            class_id: class_id,
            college_id: college_id,
            success: data => {
              wx.hideLoading();
              if (data.error) {
                //绑定失败

                //提取错误数据
                var strErrors = '';
                for(var key in data.error){
                  for (var keyError in data.error[key]){
                    strErrors += data.error[key][keyError];
                  }
                }
                //显示错误提示
                wx.showToast({
                  title: '绑定失败: ' + strErrors,
                  icon: "none",
                });
              } else {
                //绑定成功
                wx.showToast({
                  title: '绑定成功',
                  icon: "success",
                  duration: 1500,
                });

                //设置app中的全局变量userIsBinded = true
                app.globalData.userIsBinded = true;
                //跳转回用户页面
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/user/user',
                  })
                }, 1500);
              }
            },
            fail: error => {
              wx.hideLoading();
              Util.showModel("绑定失败", error);
            }
          });
        }
      })
    }
  },

});