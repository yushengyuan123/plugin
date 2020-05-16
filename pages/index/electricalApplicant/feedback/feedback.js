// pages/index/electricalApplicant/feedback/feedback.js
import {compareDate, nowDate} from "../../../../utils/date/date";
import * as infoUtil from "../../../../utils/infoUtil";
import {rollBack} from "../../../../utils/router";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      feedback: ''
  },

  handleInputChange(event) {
    this.setData({
      'feedback': event.detail.value
    })
  },

  confirm() {
    const vm = this
    wx.showModal({
      title: '操作提示',
      content: '你确定要提交吗',
      success (res) {
        if (res.confirm) {
          vm.submit()
        }
      }
    })
  },

  submit() {
    const reqData = {
      name: this.data.feedback
    }
    let postReq = new infoUtil.PostRequest('/actiondevice/feedback', reqData);
    postReq.sendRequest(res => {
      if (res.data.status == 2000) {
        wx.showToast({
          title: '反馈成功',
          icon: 'success',
          duration: 2000
        })
        rollBack()
      } else {
        wx.showToast({
          title: '反馈失败,错误原因未知',
          icon: "none",
          duration: 2000
        })
      }
    })
  }
})