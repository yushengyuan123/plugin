// pages/tips/tips.js
import * as infoUtil from '../../utils/infoUtil.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      classList: [],
      lesson: [],
      focus: 1
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
    this.getClass()
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

  },

  //获取分类
  getClass(){
    const getReq = new infoUtil.GetRequest('/knowledge/class');
    getReq.getReq(res => {
      console.log(res.data.data)
      this.setData({
        'classList': res.data.data.classList
      })
      console.log(this.data.classList)
    })
    const getLecture = new infoUtil.GetRequest('/knowledge/lecture?classId=1');
    getLecture.getReq(res => {
      this.setData({
        'lesson': res.data.data.lectureList
      })
    })
  },

  router(event) {
    wx.navigateTo({
      url: './content/content?id=' + event.currentTarget.dataset.id
    })
  },

  //切话顶部导航栏
  switch(event) {
    console.log(event.currentTarget.dataset.id)
    this.setData({
      'focus': event.currentTarget.dataset.id
    })
    const getReq = new infoUtil.GetRequest('/knowledge/lecture?classId=' + event.currentTarget.dataset.id);
    getReq.getReq(res => {
      console.log(res.data.data)
      this.setData({
        'lesson': res.data.data.lectureList
      })
      console.log(this.data.lesson)
    })
  }
})