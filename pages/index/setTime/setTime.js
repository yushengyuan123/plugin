// pages/index/setTime/setTime.js
import * as infoUtil from '../../../utils/infoUtil.js';
import * as util from '../../../utils/util';
import * as date from '../../../utils/date/date'
import {formatData} from "../../../utils/date/date";
import {errorMessage} from "../../../utils/errorMessage";

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        taskList: []


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getDateList()
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

    //get all the time task list
    getDateList() {
        console.log("请求端口")
        const vm = this
        let head = null;
        const that = this;
        let header;
        console.log(app.sessionID)
        if (app.sessionID.length != 0) {
            header = {'x-auth-token': app.sessionID};
        }
        wx.request({
            url: app.globalUrlBase.url + '/actiondevice/listtiming',
            header: header,
            method: 'get',
            success(res) {
                if (res.data.status == 2000) {
                  console.log(res.data.data)
                    that.setData({
                        taskList: formatData(res.data.data.timingList),
                    })
                }
            }
        })
    },

    //confirm to operate
    operatorConfirm(event) {
        const vm = this
        wx.showModal({
            title: '操作提示',
            content: '确定要关闭/开启吗',
            success (res) {
                if (res.confirm) {
                    vm.switchPower(event.currentTarget.dataset.id)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    //choose the switchbtn
    switchPower(switchId) {
        console.log(this.data.taskList)
        const data = {
            "timing":{
                "id": switchId,
                "status": !this.data.taskList[this.getIndex(switchId)].status?1:0	//0代表关闭。1代表开启
            }
        }
        let postReq = new infoUtil.PostRequest('/actiondevice/updateTiming', data);
        postReq.sendRequest(res => {
            console.log(res)
            if (res.data.status == 2000) {
                this.changeStatus(switchId)
            } else {
                errorMessage(res.data.status)
            }
        })
    },

    getIndex(id) {
        for (let i = 0; i < this.data.taskList.length; i++) {
            if (this.data.taskList[i].id == id) {
                return i
            }
        }
        throw new Error('无法找到')
    },

    changeStatus(switchId) {
        for (let i = 0; i < this.data.taskList.length; i++) {
            if (this.data.taskList[i].id === switchId) {
                this.setData({
                    ['taskList['+ i +'].status']: !this.data.taskList[i].status
                })
                break
            }
        }
    },

    router() {
        wx.navigateTo({
            url: './addTask/addTask?isAdd=true',
        })
    },

    //reset the task info
    changeInfo(event) {
        const info = event.currentTarget.dataset
        wx.navigateTo({
            url: './addTask/addTask?isAdd=false&port='+info.port
            +'&status='+info.status+'&id='+info.id+'&time='+info.time,
        })
    },
})