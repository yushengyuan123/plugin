// pages/index/operator/operator.js
import * as Utils from '../../../utils/indexUtil.js';
import * as infoUtil from '../../../utils/infoUtil.js';
import {formatData} from "../../../utils/date/date";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    logList: [],
    show:[
      {open: false},
      {open: false},
      {open: false},
      {open: false},
      {open: false},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageInit()
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

  //click the container to show the port operator record
  showRecord(event) {
    const index = event.currentTarget.dataset.id
    this.setData({
      ['logList['+ index +'].open']: !this.data.logList[index].open
    })

  },

  //init the pages log data
  pageInit() {
    const vm = this;
    let postReq = new infoUtil.PostRequest('/actiondevice/querydevicelog');
    this.data.portArr = app.portArr;
    let infoArr = [];
    postReq.sendUndata((res) => {
      if (res.data.status == 2000) {
        this.setData({
          'logList': this.formatData(res.data.data.deviceLogList)
        })
      }
    })
  },

  formatData(list) {
    const newData = []
    for (let i = 0; i < list.length; i++) {
      const index = this.hasIndex(list[i].deviceIndex, newData)
      if (!index) {
        newData.push({
          deviceIndex: list[i].deviceIndex,
          data: [],
          open: false,
          index: newData.length
        })
        newData[newData.length-1].data.unshift(list[i])
      } else {
        if (index === 'zero') {
          newData[0].data.unshift(list[i])
          continue
        }
        newData[index].data.unshift(list[i])
      }
    }
    console.log(newData)
    return newData
  },

  hasIndex(index, array) {
    const copy = array.slice()
    for (let i = 0; i < copy.length; i++) {
      if (index === copy[i].deviceIndex) {
        //if the index == 0, the circle will execute the if branch.so this
        //should be deal with a special
        if (i === 0) {
          return 'zero'
        }
        return i
      }
    }
    return false
  }
})