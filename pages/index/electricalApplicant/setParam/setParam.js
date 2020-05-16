// pages/index/setTime/addTask/addTask.js
import * as infoUtil from "../../../../utils/infoUtil";
import {rollBack} from "../../../../utils/router";
import {errorMessage} from "../../../../utils/errorMessage";

const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        power: {
            active: false
        },
        display: {
            name: ''
        },
        index: null,
        isAdd: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    //todo 这里没告诉我有没有开关状态
    onLoad: function (options) {
        console.log(options)
        const add = JSON.parse(options.isAdd)
        if (!add) {
            this.setData({
                "display.name": options.name,
                'index': options.index,
                'isAdd': add
            })
            this.getPortInfo()
        } else {
            this.setData({
                'isAdd': add
            })
        }
    }
    ,

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    switchPower() {
        const status = this.data.power.active
        this.setData({
            power: {
                active: !status
            }
        })
    },

    //monitor input value change
    handleInputChange(event) {
        this.setData({
            'display.name': event.detail.value
        })

    },

    //get port info
    getPortInfo() {
        if (this.data.index == null) {
            return
        }
        const data = {
            index: this.data.index
        }
        const vm = this
        let postReq = new infoUtil.PostRequest('/actiondevice/querydeviceinfo', data);
        postReq.sendRequest((res) => {
            console.log(res.data)
            if (res.data.status == 2000) {
                vm.setData({
                    'power.active': res.data.data.deviceInfo.autoClose == 1
                })
            } else {
                wx.showToast({
                    title: '查询失败',
                    icon: "none"
                })
            }
        })
    },

    confirmAdd() {
        const vm = this
        wx.showModal({
            title: '操作提示',
            content: '你确定要修改吗',
            success(res) {
                if (res.confirm) {
                    vm.changeSubmit()
                }
            }
        })
    },

    //submit add tasks
    changeSubmit() {
        const data = {
            "index":this.data.index,
            "name": this.data.display.name,
            "deviceInfo": {
                "autoClose": this.data.power.active ? 1 : 0,
            }
        }
        const postReq = new infoUtil.PostRequest('/actiondevice/updatedevicename', data);
        postReq.sendRequest((res) => {
            if (res.data.status == 2000) {
                wx.showToast({
                    title: '修改成功',
                    duration: 2
                })
                rollBack('onReady')
            } else {
                errorMessage(res.status)
            }
        })
    },

    //query to delete
    confirmDelete() {
        const vm = this
        wx.showModal({
            title: '操作提示',
            content: '你确定要删除吗',
            success(res) {
                if (res.confirm) {
                    vm.deleteTask()
                }
            }
        })
    },

    //delete the task
    deleteTask() {
        let jsonObj,
            postReq;
        jsonObj = {
            "index": this.data.index //设备串口号
        }
        console.log(jsonObj)
        postReq = new infoUtil.PostRequest('/actiondevice/deldevice', jsonObj);
        postReq.sendRequest((res) => {
            if (res.data.status == 2000) {
                wx.showToast({
                    title: '删除成功',
                })
                rollBack('onReady')
            } else {
                errorMessage(res.status)
            }
        })
    }

})