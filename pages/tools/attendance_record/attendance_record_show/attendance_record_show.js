var ATAPI = require('../../../../api/AssistantToolsAPI.js')
var Util = require('./../../../../utils/util.js')
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

    yearTermRange: null,
    year: "2017",
    term: 0,
    terms: [
      "上学期",
      "下学期",
    ],
    weekth: 0,//周次
    weekths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    //考勤统计数据
    collegesAttendanceStatistic: [],
    collegeAttendanceStatistic: [],
    majorAttendanceStatistic: [],
    classAttendanceStatistic: null,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //更新Picker列表数据
    this.updatePickersData();
    //获取并设置 学年，学期范围
    ATAPI.getYearTermRange({
      success: data => {
        this.setData({
          yearTermRange: data,
          startYear: data.start[0],
          endYear: data.end[0],
        })
        //设置当前的学年、学期、周次、星期初始值
        this.setData({
          year: app.globalData.currentYear.toString(),
          term: app.globalData.currentTerm - 1,
          weekth: app.globalData.currentWeekth - 1,
        })
      },
      fail: error => {
        Util.showModel("获取学年学期范围失败 : ", error);
      }
    })
  },

  bindYearPickerChange: function (even) {
    if (this.isYearTermOverRange(even.detail.value, this.data.term)) {
      this.setData({
        year: '' + even.detail.value,
      })
    }
  },
  bindTermPickerChange: function (even) {
    if (this.isYearTermOverRange(this.data.year, even.detail.value)) {
      this.setData({
        term: '' + even.detail.value,
      })
    }
  },

  bindWeekthPickerChange: function (even) {
    this.setData({
      weekth: '' + even.detail.value,
    })
  },
  /**
   * 判断是否超过学年学期范围
   */
  isYearTermOverRange(year, term) {
    if (this.data.yearTermRange.end[0] == year) {
      if ((parseInt(term) + 1) > parseInt(this.data.yearTermRange.end[1])) {
        Util.showModel("提示", "该学期考勤记录暂时无法查看!");
        return false;
      }
    } else if (this.data.yearTermRange.start[0] == year) {
      if ((parseInt(term) + 1) < parseInt(this.data.yearTermRange.start[1])) {
        Util.showModel("提示", "该学期考勤记录暂时无法查看!");
        return false;
      }
    }
    return true;
  },

  query: function () {
    wx.showActionSheet({
      itemList: [
        '查询所有学院的考勤数据',
        '查询<' + this.data.colleges[this.data.collegeValue].college_name + '>考勤数据',
        '查询<' + this.data.majors[this.data.majorValue].major_name + '>专业考勤数据',
        '查询<' + this.data.class_s[this.data.classValue].class_name + '>班考勤数据'
      ],
      success: res => {
        if (!res.cancel) {
          //清空上次的考勤统计数据
          this.setData({
            collegesAttendanceStatistic: [],
            collegeAttendanceStatistic: [],
            majorAttendanceStatistic: [],
            classAttendanceStatistic: null,
          })
          //查询考勤统计数据
          if (res.tapIndex == 0) {
            //获取所有id
            var ids = [];
            for (var index in this.data.colleges)
              ids.push(this.data.colleges[index].college_id);

            ATAPI.queryAttendanceRecordStatisticalData({
              year: this.data.year,
              term: parseInt(this.data.term) + 1,
              weekth: this.data.weekths[this.data.weekth],
              queryType: res.tapIndex + 1,
              ids: JSON.stringify(ids),
              success: res => {
                if (res.error) {
                  Util.showModel("查询考勤统计数据失败 : ", JSON.stringify(res.error));
                  return;
                } else {
                  this.setData({
                    collegesAttendanceStatistic: JSON.parse(res.data),
                  })
                }
              },
              fail: error => {
                Util.showModel("查询考勤统计数据失败 : ", error);
                return;
              }
            })

          } else if (res.tapIndex == 1) {
            //获取所有id
            var ids = [];
            for (var index in this.data.majors)
              ids.push(this.data.majors[index].major_id);

            ATAPI.queryAttendanceRecordStatisticalData({
              year: this.data.year,
              term: parseInt(this.data.term) + 1,
              weekth: this.data.weekths[this.data.weekth],
              queryType: res.tapIndex + 1,
              ids: JSON.stringify(ids),
              success: res => {
                if (res.error) {
                  Util.showModel("查询考勤统计数据失败 : ", JSON.stringify(res.error));
                  return;
                } else {
                  this.setData({
                    collegeAttendanceStatistic: JSON.parse(res.data),
                  })
                }
              },
              fail: error => {
                Util.showModel("查询考勤统计数据失败 : ", error);
                return;
              }
            })

          } else if (res.tapIndex == 2) {
            //获取所有id
            var ids = [];
            for (var index in this.data.class_s)
              ids.push(this.data.class_s[index].class_id);

            ATAPI.queryAttendanceRecordStatisticalData({
              year: this.data.year,
              term: parseInt(this.data.term) + 1,
              weekth: this.data.weekths[this.data.weekth],
              queryType: res.tapIndex + 1,
              ids: JSON.stringify(ids),
              success: (res) => {
                if (res.error) {
                  Util.showModel("查询考勤统计数据失败 : ", JSON.stringify(res.error));
                } else {
                  this.setData({
                    majorAttendanceStatistic: JSON.parse(res.data),
                  })
                }
              },
              fail: error => {
                Util.showModel("查询考勤统计数据失败 : ", error);
              }
            })
          } else if (res.tapIndex == 3) {
            ATAPI.queryAttendanceRecordStatisticalData({
              year: this.data.year,
              term: parseInt(this.data.term) + 1,
              weekth: this.data.weekths[this.data.weekth],
              queryType: res.tapIndex,
              ids: JSON.stringify([this.data.class_s[this.data.classValue].class_id]),
              success: res => {
                if (res.error) {
                  Util.showModel("查询考勤统计数据失败 : ", JSON.stringify(res.error));
                } else {
                  this.setData({
                    classAttendanceStatistic: JSON.parse(res.data)[0],
                  })
                }
              },
              fail: error => {
                Util.showModel("查询考勤统计数据失败 : ", error);
              }
            })
          }
          console.log(this.data)

        }
      }
    });
  },


  /**
     * 学院picker changed处理函数
     */
  pickerCollegeChanged: function (even) {
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
  pickerMajorChanged: function (even) {
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
  pickerClassChanged: function (even) {
    this.setData({
      classValue: even.detail.value,
    })
  },

  /**
   * 更新Picker列表数据
   */
  updatePickersData: function () {
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
  updateColleges: function () {
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
  updateMajors: function () {
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