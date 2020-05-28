// pages/tips/lesson/content/content.js
import * as infoUtil from "../../../utils/infoUtil";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      content: [],
      lectureId: '',
      show: {},
      isShow: false
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
    // const getReq = new infoUtil.GetRequest('/knowledge?lectureId=' + this.data.lectureId);
    const getReq = new infoUtil.GetRequest('/knowledge?lectureId=1');
    getReq.getReq(res => {
      console.log(res.data.data)
      this.setData({
        'content': res.data.data.knowledgeList
      })
      console.log(this.data.content)
    })
  },

  //根据知识点的id去内容匹配
  matchContent(id) {
    for (let i = 0, len = this.data.content.length; i < len; i++) {
      if (id === this.data.content[i].knowledgeId) {
        return this.data.content[i]
      }
    }
  },

  //显示放大的内容
  showMore(event) {
    const id = event.currentTarget.dataset.id
    this.setData({
      'show': this.matchContent(id),
      'isShow': true
    })
  },

  cancel() {
    this.setData({
      'isShow': false
    })
  },
  //空事件函数进行过度
  doNothing() {

  }
})