// pages/tips/lesson/content/content.js
import * as infoUtil from "../../../../utils/infoUtil";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      content: [],
      lectureId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'lectureId': JSON.parse(options.id)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getContent()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  getContent (){
    const getReq = new infoUtil.GetRequest('/knowledge?lectureId=' + this.data.lectureId);
    getReq.getReq(res => {
      console.log(res.data.data)
      this.setData({
        'content': res.data.data.knowledgeList
      })
      console.log(this.data.content)
    })
  }
})