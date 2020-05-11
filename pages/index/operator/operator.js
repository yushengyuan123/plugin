// pages/index/operator/operator.js
import * as Utils from '../../../utils/indexUtil.js';
import * as infoUtil from '../../../utils/infoUtil.js';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    logList: []
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
    this.pageInit()
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

  //click the container to show the port operator record
  showRecord() {
    this.setData({
      isShow: !this.data.isShow
    })
  },

  //init the pages log data
  pageInit() {
    const vm = this;
    console.log('nihoa')
    if (app.currentPort == null) {
      console.log('yes')
      return ;
    }
    let jsonObj = {
          index: app.currentPort
        },
        i,
        postReq = new infoUtil.PostRequest('/actiondevice/querydevicelog', jsonObj);
    this.data.portArr = app.portArr;
    let infoArr = [];
    postReq.sendRequest((res) => {
      console.log(res.data)
      if (res.data.status == 2000) {
        vm.setData({
          logList: res.data.data.deviceLogList
        })
        console.log(vm.logList)
      }
    })

  }
})