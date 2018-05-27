var ATAPI = require('./../../../../api/AssistantToolsAPI.js')
var constants = require('./../../../../vendor/miniprogram-laravel-sdk/lib/constants.js')
var Session = require('./../../../../vendor/miniprogram-laravel-sdk/lib/session.js')
var utils = require('./../../../../vendor/miniprogram-laravel-sdk/lib/utils.js');
var Config = require('./../../../../api/config.js')
var Util = require('./../../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode: null,
    attendance_record_id: null,
    attendanceRecord: null,
    files: [],
    hasMobileBag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取mode
    var navigateBarTitle = options.mode == 'alter' ? "考勤信息修改" : "考勤信息录入";
    wx.setNavigationBarTitle({
      title: navigateBarTitle,
    })
    //设置mode和attendance_record_id
    this.setData({
      mode: options.mode,
      attendance_record_id: options.attendance_record_id,
    })
    //从缓存中取出考勤记录数据,并查找到本条考勤记录
    wx.getStorage({
      key: 'attendanceRecords',
      success: res => {
        for (var index in res.data) {
          if (res.data[index].attendance_record_id == options.attendance_record_id) {
            //如果图片地址不为空，则下载图片数据
            if (res.data[index].mobile_detail_picture_file_name){
              ATAPI.getDownloadImgFileUrl({
                filePath: res.data[index].mobile_detail_picture_file_name,
                success: res => {
                  var url = res.data;
                  //从服务器下载图片
                  ATAPI.downloadFile({
                    url: url,
                    success: res => {
                      if (res.statusCode == 200){
                        this.setData({
                          files: [res.tempFilePath]
                        })
                      }else{
                        Util.showModel("从服务器下载图片失败,请重试!", res.errMsg)
                      }
                    },
                    fail: error => {
                      Util.showModel("从服务器下载图片失败,请重试!", error)
                    }
                  })
                },
                fail: error => {
                  Util.showModel("从服务器获取图片地址失败,请重试!", error)
                }
              })
            }
            this.setData({
              attendanceRecord: res.data[index],
              hasMobileBag: res.data[index].mobile_num === null ? false : true,
            })
            break;
          }
        }
      }
    })
  },
  /**
   * 选择图片
   */
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: res.tempFilePaths,
        });
      }
    })
  },
  /**
   * 预览图片
   */
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  /**
   * 考勤记录表单提交
   */
  submitAttendanceRecord: function (options) {
    var values = options.detail.value;
    //判断用户输入是否完整
    var inputComplete = true;
    var tip = '请输入 : ';

    if (inputComplete && !values.leavers_num) {
      inputComplete = false;
      tip += '旷课人数';
    }

    if (inputComplete && !values.absenteeism_num) {
      inputComplete = false;
      tip += '请假人数';
    }

    tip += '必须填写';

    if (!inputComplete) {
      //提示信息显示
      wx.showToast({
        title: tip,
        icon: "none",
      })
      return false;
    }

    if (values.leavers_num != 0 && values.leavers_detail == '') {
      wx.showToast({
        title: "旷课情况必须填写!",
        icon: "none",
      })
      return false;
    }

    if (values.absenteeism_num != 0 && values.absenteeism_detail == '') {
      wx.showToast({
        title: "请假情况必须填写!",
        icon: "none",
      })
      return false;
    }

    //有手机袋
    if (this.data.hasMobileBag) {
      if (!values.mobile_num) {
        wx.showToast({
          title: "请输入手机上交台数!",
          icon: "none",
        })
        return false;
      }
      if (this.data.files.length == 0) {
        wx.showToast({
          title: "请上传手机情况图片!",
          icon: "none",
        })
        return false;
      }
    }

    //上传数据
    if (this.data.hasMobileBag) {
      Util.showBusy("正在上传图片数据中...");
      //上传手机图片
      ATAPI.uploadFile({
        filePath: this.data.files[0],
        name: 'imgfile',
        success: res => {
          wx.hideToast();
          Util.showBusy("正在提交考勤数据中...");
          //提交考勤信息
          this.doSubmitAttendanceRecord(JSON.parse(res.data).data, values);
        },
        fail: error => {
          wx.hideToast();
          Util.showModel("图片上传失败请重试!", error)
        }
      })
    } else {
      Util.showBusy("正在提交考勤数据中...");
      //提交考勤信息
      this.doSubmitAttendanceRecord(null, values);
    }
  },
  /**
   * 提交考勤记录数据
   * imgFilePath(手机情况图片上传到服务器上后返回的地址)
   * values(表单的值)
   */
  doSubmitAttendanceRecord(imgFilePath, values) {
    ATAPI.saveAttendanceRecord({
      attendance_record_id: this.data.attendanceRecord.attendance_record_id,
      leavers_num: values.leavers_num,
      leave_detail: values.leavers_detail,
      absenteeism_num: values.absenteeism_num,
      absenteeism_detail: values.absenteeism_detail,
      mobile_num: values.mobile_num,
      img_file_path: imgFilePath,

      success: data => {
        wx.hideToast();
        wx.showToast({
          title: '考勤数据保存成功!',
          icon: 'success',
          duration: 2000
        })
        //返回考勤详情页面
        wx.navigateBack({});
      },
      fail: error => {
        wx.hideToast();
        Util.showModel("考勤数据保存失败,请重试!", error)
      }
    })
  },
  /**
   * 是否有手机袋
   */
  hasMobileBagChange: function (even) {
    this.setData({
      hasMobileBag: even.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})