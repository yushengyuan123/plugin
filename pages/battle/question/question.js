// pages/battle/question/question.js
import * as infoUtil from "../../../utils/infoUtil";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        questionList: {},
        total: [],
        currentIndex: 0,
        correct: '',
        user: null,
        //判断用户是否选择，选项锁定，计时锁定
        lockItem: false,
        showChooseList: true,
        //答题正确得数目
        correctNum: 0,
        //10秒钟回答计时
        percent: 0,
        interValId: null,
        //解释弹出层
        isShow: true,
        //解释内容
        content: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //在成绩页面回跳到这里的时候需要刷新所有数据，否则会显示上一次的结果
        this.initData()
        this.getQuestion()
        this.countdown()
        this.drawProcessCircle()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    initData() {
        clearInterval(this.data.interValId)
        this.setData({
            questionList: {},
            total: [],
            currentIndex: 0,
            correct: '',
            user: null,
            //判断用户是否选择，选项锁定，计时锁定
            lockItem: false,
            showChooseList: true,
            //答题正确得数目
            correctNum: 0,
            //10秒钟回答计时
            percent: 0,
            interValId: null,
            timeOutId: null,
            isShow: false,
            content: ''
        })
    },

    //跳转下一题目
    next() {
        if (this.data.timeOutId) {
            clearTimeout(this.data.timeOutId)
            this.setData({
                'timeOutId': null
            })
        }
        //判断用户有咩有选择，没有选择禁止跳转下一题
        if (this.data.correct === '') {
            wx.showToast({
                title: '请先作答本题',
                icon: 'none'
            })
            return;
        }
        const options = this.data.currentIndex < 5 ? 'choiceList' : 'judgeList'
        console.log(this.data.currentIndex)
        if (this.data.currentIndex === 5) {
            this.setData({
                'showChooseList': false
            })
        } else if (this.data.currentIndex === 9) {
            //当currentIndex为10的时候说明答题已经结束跳转结束页面
            wx.navigateTo({
                url: '../finish/finish?correctNum=' + this.data.correctNum
            })
            return
        }
        this.setData({
            'currentIndex': this.data.currentIndex + 1
        })
        this.setData({
            'correct': '',
            'user': null,
            'percent': 0,
            'lockItem': false,
            'questionList': this.data.total[options][this.data.currentIndex % 6]
        })
        this.drawProcessCircle()
    },

    getQuestion() {
        const getReq = new infoUtil.GetRequest('/question/getQuestions')
        getReq.getReq(res => {
            this.setData({
                'total': res.data.data
            })
            this.setData({
                'questionList': this.data.total.choiceList[this.data.currentIndex]
            })
        })
    },

    //答案匹配
    matchAnswer(userAns, options) {
        console.log(userAns)
        for (let i = 0; i < this.data.total[options].length; i++) {
            if (this.data.questionList.question ===
                this.data.total[options][i].question) {
                return userAns == this.data.total[options][i].answer ?
                    false : this.data.total[options][i].answer
            }
        }
    },

    chooseItem(event) {
        if (this.data.lockItem) {
            return
        }
        let rightAns
        //用户选择完成后锁定选项，不允许重新选择
        this.setData({
            'lockItem': true
        })
        const userAns = event.currentTarget.dataset.id
        if (this.data.showChooseList) {
            rightAns = this.matchAnswer(userAns, 'choiceList')
        } else {
            rightAns = this.matchAnswer(userAns, 'judgeList')
        }
        console.log(rightAns)
        if (rightAns === false) {
            this.setData({
                'correct': userAns,
                'user': userAns,
                'correctNum': this.data.correctNum + 1
            })
            this.setData({
                'timeOutId': setTimeout(() => {
                    this.next()
                }, 1000)
            })
            console.log('回答正确', this.data.correctNum)
        } else {
            this.setData({
                'correct': rightAns,
                'user': userAns,
            })
        }
    },

    //超时显示答案
    timeOutShowAns() {
        let rightAns
        const userAns = 'none'
        if (this.data.showChooseList) {
            rightAns = this.matchAnswer(userAns, 'choiceList')
        } else {
            rightAns = this.matchAnswer(userAns, 'judgeList')
        }
        this.setData({
            'correct': rightAns,
            'user': userAns,
            'lockItem': true
        })
    },

    //十秒钟倒计时
    countdown() {
        this.setData({
            interValId: setInterval(() => {
                if (this.data.percent < 15 && !this.data.lockItem) {
                    this.setData({
                        'percent': this.data.percent + 1
                    })
                    this.drawProcessCircle()
                } else if (!this.data.lockItem) {
                    //到点之后自动显示答案
                    this.timeOutShowAns()
                }
            }, 1000)
        })
    },

    //显示放大的内容
    showExplain(event) {
        const explain = event.currentTarget.dataset.explain
        this.setData({
            'content': !explain ? '暂无解释' : explain,
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

    },

    //绘制进度条canvas
    drawProcessCircle() {
        const windWidth = wx.getSystemInfoSync().windowWidth;
        const xs = windWidth / 750;
        const ctx = wx.createCanvasContext("circleBar", this)
        const circle_radius = 200 * xs / 2;
        //圆弧的粗细
        const lineWith = 60 * xs
        //外圆半径
        const outR = 100 * xs
        const innerR = 85 * xs
        //移动到圆形的中央
        ctx.translate(circle_radius, circle_radius)
        ctx.beginPath();
        ctx.setStrokeStyle('#FFF9F1');
        ctx.setLineWidth(lineWith);
        //在刚刚移动到的地方进行圆形的绘制
        ctx.arc(0, 0, outR, 0, Math.PI * 2, false);
        //裁剪画布使他不是正方形
        ctx.clip()
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.setStrokeStyle('#FFC243');
        ctx.setLineWidth(20 * xs);
        //在刚刚移动到的地方进行圆形的绘制
        ctx.arc(0, 0, innerR, -0.5 * Math.PI,
            (Math.PI * 2) * (this.data.percent / 15) - 0.5 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        ctx.draw()
    }
})