// pages/index/operator/operator.js
import * as infoUtil from "../../utils/infoUtil";
import {errorMessage} from "../../utils/errorMessage";

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isVisitor: app.isVisitor
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (!app.isVisitor) {
            this.setData({
                'isVisitor': false
            })
        } else {
          // this.touristLogin()
        }
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

    /**
     * router to some page
     * @param event
     */
    router(event) {
        const module = event.currentTarget.dataset.id
        wx.navigateTo({
            url: './' + module + '/' + module,
        })
    },

    login() {
      if (this.data.isVisitor) {
        wx.navigateTo({
          url: '../login/login'
        })
      } else {
        app.isVisitor = true
        this.setData({
          'isVisitor': true
        })
        this.touristLogin()
      }
    },

    touristLogin() {
        let jsonObj = {
            user: {
                userPhone: "13570200438",
                userPassword: "11111111"
            },
            checkCodeKey: ""
        };
        let postReq = new infoUtil.PostRequest('/user/loginnormal', jsonObj, true);
        postReq.sendRequest((res) => {
            if (res.data.status == 2000) {
              app.sessionID = res.header['x-auth-token'];
            } else {
              errorMessage(res.data.status)
            }
        })
    }


})