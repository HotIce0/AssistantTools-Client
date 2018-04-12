// pages/user/bind/bind.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 微信用户绑定平台账号 的表单提交事件
   */
  doBind: event => {
    //判断用户输入是否完整
    var inputComplete = true;
    var tip = "";
    if (!event.detail.value.jobId && !event.detail.value.idCardNo){
      tip = '请输入用户名和密码';
      inputComplete = false;
    } else if (!event.detail.value.jobId){
      tip = '请输入用户名';
      inputComplete = false;
    } else if (!event.detail.value.idCardNo){
      tip = '请输入密码';
      inputComplete = false;
    }
    if(!inputComplete){
      //提示信息显示
      wx.showToast({
        title: tip,
        icon: "none",
      })
    } else {
      //调用API向服务器请求平台账号绑定
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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