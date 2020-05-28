// pages/battle/finish/finish.js
import {rollBack} from "../../../utils/router";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    correctNumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'correctNumber': JSON.parse(options.correctNum)
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

  playAgain () {
    rollBack()
  }
})