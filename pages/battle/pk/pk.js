// pages/battle/battle/online.js
import * as infoUtil from "../../../utils/infoUtil";

const app = getApp()

let websocketInstance = null

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //题目总数
        total: '',
        //正确的答案
        correct: '',
        //限时选择题html，还是填空题html
        showChooseList: true,
        //题目锁定
        lockItem: false,
        //用户选择
        user: null,
        //当前题目
        questionList: '',
        //10秒钟回答计时
        percent: 0,
        //当前题号
        currentIndex: 0,
        //有没有用户已经进来了
        hasOpponent: '正在匹配对手',
        //用户信息
        opponent: '',
        my: '',
        myScore: 0,
        opponentScore: 0,
        //定时器id
        interValId: null,
        ansResult: [],
        //对手是否结束
        isOpponentEnd: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.drawProcessCircle()
        this.communication()
    },

    onUnload() {
        //结束后发送断开连接
        console.log('发送断开连接')
        //用户点击返回的时候也需要发送答题情况
        try {
            if (websocketInstance && this.data.hasOpponent !== '正在匹配对手') {
                const _this = this
                this.setData({
                    ansResult: this.restQus()
                })
                console.log(_this.data.ansResult)
                wx.sendSocketMessage({
                    data: JSON.stringify(_this.data.ansResult)
                })
                wx.sendSocketMessage({
                    data: JSON.stringify({"action": 1})
                })
                try {
                    wx.closeSocket()
                } catch (e) {
                    console.log(e)
                }
            }
        } catch (e) {
            console.log('websocket连接已经断开')
        }
    },

    communication() {
        this.websocket('/competition')
    },

    websocket(router) {
        const url = app.globalUrlBase.wss + router + '?x-auth-token=' + app.sessionID;
        const _this = this
        websocketInstance = wx.connectSocket({
            url: url,
            success(res) {
                _this.openSocket()
                _this.receiptInfo()
            }
        })
    },

    //打开socket通道
    openSocket() {
        const _this = this
        wx.onSocketOpen(function () {
            // _this.sendMessage()
        })
    },

    //接受服务器socket信息
    receiptInfo() {
        const _this = this
        wx.onSocketMessage(function (res) {
            //没有对手进行等待
            let response = JSON.parse(res.data)
            console.log(response)
            //通过返回数据的对象判断是否存在某个属性in，来区别不同的数据类型
            if (_this.data.hasOpponent === '正在匹配对手') {
                if ('user' in response.data) {
                    _this.waiting(response.data.user)
                } else {
                    _this.waiting(response.data.userList)
                    _this.initQus(response.data.question)
                    //等待双方进入房间定时器开始执行
                    _this.countdown()
                }
            } else if ('grade' in response) {
                _this.opponentScore(response)
            } else if ('opponentResult' in response) {
                _this.isOpponentEnd(response)
            } else if ('action' in response) {
                _this.hasExit(response)
            }
        })
    },

    //想服务器发送信息
    sendMessage() {
        //函数有参数说明传输答题结果，没有参数数明参数普通分数
        if (arguments.length) {
            console.log(this.data.ansResult)
            wx.sendSocketMessage({
                data: JSON.stringify(this.data.ansResult),
            })
        } else {
            let score
            //假如到了10秒的时候要做一下特殊处理，默认和9秒相同都加1分，否则选手在十秒时作答会没有分数
            if (this.data.percent === 10) {
                score = 1 + this.data.myScore
            } else {
                score = (10 - this.data.percent) / 10 * 10 + this.data.myScore
            }
            this.setData({
                'myScore': score
            })
            wx.sendSocketMessage({
                data: JSON.stringify({
                    grade: score
                }),
            })
        }
    },

    //检查是否有对手退出，那我怎么区别是主动退出还是答题完毕退出
    hasExit(res) {
        const _this = this
        if ('action' in res) {
            if (res.action === 1) {
                this.setData({
                    ansResult: this.restQus()
                })
                console.log(_this.data.ansResult)
                wx.sendSocketMessage({
                    data: JSON.stringify(_this.data.ansResult)
                })
                wx.sendSocketMessage({
                    data: JSON.stringify({
                        "action": 2
                    })
                })
                wx.closeSocket(function () {
                    console.log('前端主动断开成功')
                })
                wx.showToast({
                    title: '对手退出房间/网络异常，比赛终止',
                    icon: "none",
                    duration: 2000,
                })
                setTimeout(() => {
                    wx.redirectTo({
                        url: './pkResult/pkResult'
                    })
                }, 2000)
            }
        }
    },

    //判断玩家答题是否满20,不满20帮他补充完，后面的默认都是错误
    restQus() {
        const len = this.data.ansResult.length
        const newArr = [...(this.data.ansResult)]
        if (len <= 10) {
            for (let i = len; i < 10; i++) {
                newArr.push({
                    "number": i + 1,
                    "result": 3
                })
            }
        }
        console.log('newArr', newArr)
        return newArr
    },

    //刷新对象的分数
    opponentScore(res) {
        if ('grade' in res) {
            this.setData({
                'opponentScore': res.grade
            })
        }
    },

    //检查对手是否结束
    isOpponentEnd(result) {
        //结果长度为2，游戏结束
        if (result.opponentResult.length === 20) {
            wx.sendSocketMessage({
                data: JSON.stringify({
                    "action": 2
                })
            })
            wx.closeSocket(function(res) {
                console.log('WebSocket 已关闭！')
            })
            wx.showToast(({
                title: '答题结束',
                duration: 1000
            }))
            wx.redirectTo({
                url: './pkResult/pkResult'
            })
        } else if (result.opponentResult.length === 10
            && this.data.ansResult.length !== 10){
            this.setData({
                'hasOpponent': '对手答题完毕',
                'isOpponentEnd': true
            })
        }
    },

    //等待对手
    waiting(user) {
        if (!Array.isArray(user)) {
            this.setData({
                'hasOpponent': '正在匹配对手'
            })
            if (!this.data.my) {
                this.setData({
                    'my': user
                })
            }
        } else {
            this.setData({
                'hasOpponent': '正在pk',
                'my': user[0],
                'opponent': user[1],
            })
        }
    },

    //初始化题目
    initQus(qus) {
        this.setData({
            'total': qus
        })
        this.setData({
            'questionList': this.data.total.choiceList[this.data.currentIndex]
        })
    },


    //答案匹配
    matchAnswer(userAns, options) {
        for (let i = 0; i < this.data.total[options].length; i++) {
            if (this.data.questionList.question ===
                this.data.total[options][i].question) {
                return userAns == this.data.total[options][i].answer ?
                    false : this.data.total[options][i].answer
            }
        }
    },

    //跳转下一题目
    next() {
        if (this.data.timeOutId) {
          clearTimeout(this.data.timeOutId)
          this.setData({
            'timeOutId': null
          })
        }
        const options = this.data.currentIndex < 5 ? 'choiceList' : 'judgeList'
        if (this.data.currentIndex === 5) {
            this.setData({
                'showChooseList': false
            })
        } else if (this.data.currentIndex === 9) {
            //当currentIndex为10的时候说明答题已经结束，等待对手作答完毕
            if (!this.data.isOpponentEnd) {
                this.setData({
                    'hasOpponent': '等待对手答题完毕'
                })
            }
            this.sendMessage('hasArg')
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

    //用户进行选择
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
        if (rightAns === false) {
            //result 0 为正确 1 为错误
            this.setData({
                'correct': userAns,
                'user': userAns,
                'correctNum': this.data.correctNum + 1,
                ['ansResult['+ this.data.currentIndex +']']:
                    {"number": this.data.currentIndex + 1, "result":0}
            })
            this.sendMessage()
        } else {
            this.setData({
                'correct': rightAns,
                'user': userAns,
                ['ansResult['+ this.data.currentIndex +']']:
                    {"number": this.data.currentIndex + 1, "result":1}
            })
        }
        setTimeout(() => {
            this.next()
        }, 500)
    },

    //十秒钟倒计时
    countdown() {
        this.setData({
            interValId: setInterval(() => {
                if (this.data.percent < 10 && !this.data.lockItem) {
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
            'lockItem': true,
            ['ansResult['+ this.data.currentIndex +']']:
                {"number": this.data.currentIndex + 1, "result":1}
        })
        setTimeout(() => {
            this.next()
        }, 1000)
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
            (Math.PI * 2) * (this.data.percent / 10) - 0.5 * Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        ctx.draw()
    }

})