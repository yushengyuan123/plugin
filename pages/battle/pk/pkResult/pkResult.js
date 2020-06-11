// pages/battle/pk/pkResult/pkResult.js
import * as infoUtil from "../../../../utils/infoUtil";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: [
      {"number":1, "result":0},
      {"number":2, "result":1},
      {"number":3, "result":0},
      {"number":4, "result":0},
      {"number":5, "result":1},
      {"number":6, "result":1},
      {"number":7, "result":0},
      {"number":8, "result":0},
      {"number":9, "result":1},
      {"number":10, "result":0},
      {"number":11, "result":1},
      {"number":12, "result":1},
      {"number":13, "result":1},
      {"number":14, "result":0},
      {"number":15, "result":0},
      {"number":16, "result":1},
      {"number":17, "result":0},
      {"number":18, "result":1},
      {"number":19, "result":0},
      {"number":20, "result":1},
    ],
    //正确的题数
    number: 0,
    myList: [],
    opponentList: [],
    startX: '',
    endX: '',
    index: 0,
    leftValue: 0,
    isShow: true,
    my: [],
    opponent: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.animationShow()
    this.getResult()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //组件浮现动画
  animationShow() {
    setTimeout(() => {
      this.setData({
        'isShow': false
      })
    }, 5000)
  },

  getResult() {
    const req =  new infoUtil.GetRequest('/question/getCompeteResult')
    req.sendRequest(res => {
      const response = res.data
      this.setData({
        'myList': response.data.opponentResult.userResult,
        'opponentList': response.data.opponentResult.competeResult,
        'number': this.correctRate(response.data.opponentResult.userResult),
        'my': response.data.userList[0],
        'opponent': response.data.userList[1]
      })
    })
  },

  correctRate(data) {
    let correctNum = 0
    for (let i = 0; i < data.length; i++) {
      if (!data[i].result) {
        correctNum++
      }
    }
    return correctNum
  },

  playAgain() {
    wx.reLaunch({
      url: '/pages/battle/battle'
    })
  },

  touchStart(e) {
    //记录滑动开始的位置
    this.setData({
      'startX': e.touches[0].clientX
    })
  },

  touchEnd(e) {
    const {windowWidth} = wx.getSystemInfoSync();
    this.setData({
      'endX': e.changedTouches[0].clientX
    })
    //大于0说明向左滑动，小于0说明向右滑动
    if (this.data.startX - this.data.endX > 20) {
      if (this.data.index === 1) {
        return;
      }
      this.setData({
        'index': this.data.index + 1,
      })
      this.setData({
        'leftValue': -this.data.index * windowWidth * 0.81
      })
    } else if (this.data.startX - this.data.endX < -20) {
      if (this.data.index === 0) {
        return
      }
      this.setData({
        'index': this.data.index - 1,
      })
      this.setData({
        'leftValue': this.data.index * windowWidth * 0.81
      })
    }
    this.setData({
      'startX': 0,
      'endX':0
    })
  }
})