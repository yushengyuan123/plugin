// pages/index/setTime/addTask/addTask.js
import * as infoUtil from "../../../../utils/infoUtil";
import {compareDate, nowDate} from "../../../../utils/date/date";
import {rollBack} from "../../../../utils/router";

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
            port: '',
            time: '00:00'
        },
        portSelect: [],
        isAdd: null,
        taskId: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        this.setData({
            "isAdd": !JSON.parse(options.isAdd)
        })
        if (!JSON.parse(options.isAdd)) {
            this.data.isAdd = !JSON.parse(options.isAdd)
            this.setData({
                'power.active': options.status == 1,
                'display.port': options.port,
                'display.time': options.time,
                'taskId': options.id
            })
        }
    }
    ,

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // const eventChannel = this.getOpenerEventChannel()
        // eventChannel.on('acceptDataFromOpenerPage', function (data) {
        //     console.log(data)
        // })
        this.getAllPort()
    },

    switchPower() {
        const status = this.data.power.active
        this.setData({
            power: {
                active: !status
            }
        })
    },

    //timepicker confirm to choose a time and show at html
    changeTime(event) {
        console.log( event.detail)
        this.setData({
            "display.time": event.detail.value
        });
    },

    changePort(event) {
        console.log(event)
        this.setData({
            "display.port": this.data.portSelect[event.detail.value]
        });
    },

    //get the user's port list
    getAllPort() {
        let postReq = new infoUtil.PostRequest('/querydevice/queryindex');
        postReq.sendRequest((res) => {
            if (res.data.status == 2000) {
                console.log(res.data.data.user.indexPrivilegeMap)
                let i = 0
                for (const key in res.data.data.user.indexPrivilegeMap) {
                    this.setData({
                        ['portSelect['+ i +']']: '端口' + key
                    })
                    i++
                }
                this.setData({
                    'display.port': this.data.portSelect[0]
                })
            } else {
                console.log('其他错误')
            }
        })
    },

    confirmAdd() {
        const vm = this
        wx.showModal({
            title: '操作提示',
            content: '你确定要添加吗',
            success (res) {
                if (res.confirm) {
                    vm.changeSubmit()
                }
            }
        })
    },

    //submit add tasks
    changeSubmit() {
        const reqData = {
            "index": parseInt(this.data.display.port.
            charAt(this.data.display.port.length - 1)), //设备串口号
            "key": this.data.power.active?1:0, //1代表启动，0代表关闭
        }
        const hour = this.data.display.time.split(':')[0]
        const minutes = this.data.display.time.split(':')[1]
        if (compareDate(hour, minutes)) {
            reqData.time = nowDate(hour, minutes, 'future')
        } else {
            reqData.time = nowDate(hour, minutes)
        }
        let postReq = new infoUtil.PostRequest('/actiondevice/timing', reqData);
        postReq.sendRequest(res => {
            if (res.data.status == 2000) {
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 2000
                })
                rollBack()
            } else {
                wx.showToast({
                    title: '添加失败,错误原因未知',
                    duration: 2000
                })
            }
        })
    },

    //query to delete
    confirmDelete() {
        const vm = this
        wx.showModal({
            title: '操作提示',
            content: '你确定要删除吗',
            success (res) {
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
            "timing": {
                "id": parseInt(this.data.taskId)
            }
        }
        console.log(jsonObj)
        postReq = new infoUtil.PostRequest('/actiondevice/deltiming', jsonObj);
        postReq.sendRequest((res) => {
            if (res.data.status == 2000) {
                wx.showToast({
                    title: '删除成功',
                })
                rollBack()
            } else {
                wx.showToast({
                    title: '删除失败,原因未知',
                })
            }
        })
    }

})