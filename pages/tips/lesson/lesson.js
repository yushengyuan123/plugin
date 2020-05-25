// pages/tips/lesson/lesson.js
import * as infoUtil from "../../../utils/infoUtil";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lesson: [],
    classId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'classId': JSON.parse(options.id)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLesson()
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

  //获取分类
  getLesson(){
    const getReq = new infoUtil.GetRequest('/knowledge/lecture?classId=' + this.data.classId);
    getReq.getReq(res => {
      console.log(res.data.data)
      this.setData({
        'lesson': res.data.data.lectureList
      })
      console.log(this.data.lesson)
    })
  },

  route(event) {
    wx.navigateTo({
      url: './content/content?id=' + event.currentTarget.dataset.id
    })
  }
})