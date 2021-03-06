// pages/battle/battle.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      itemList:[{
        name: '每日十答题',
        image: '../../images/zuoti.png',
        module: 'question'
      },{
        name: '问答pk',
        image: '../../images/pk.png',
        module: 'pk'
      }]
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

  },

  jump(event) {
    const module = event.currentTarget.dataset.id
    if (module === 'pk') {
      if (app.isVisitor) {
        wx.showToast({
          title: '请登录后再进行pk',
          icon: "none"
        })
        return
      }
    }
    wx.navigateTo({
      url:'./' + module + '/' + module,
    })
  }
})