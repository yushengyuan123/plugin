// pages/battle/question/question.js
import * as infoUtil from "../../../utils/infoUtil";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        questionList: {},
        total: [],
        currentIndex: 1,
        choose: '',
        correct: '',
        user: null,
        focusBtn: null
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
        this.getQuestion()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    //跳转下一题目
    next() {

    },

    getQuestion() {
        const getReq = new infoUtil.GetRequest('/question/getQuestions')
        getReq.getReq(res => {
            console.log(res.data)
            this.setData({
                'total': res.data.data
            })
            this.setData({
                'questionList': this.data.total.choiceList[0]
            })
        })
    },

    //答案匹配
    matchAnswer(userAns, options) {
        for (let i = 0; i < this.data.total[options].length; i++) {
            if (this.data.questionList.question ===
                this.data.total.choiceList[i].question) {
                return userAns === this.data.total.choiceList[i].answer ?
                    false : this.data.total.choiceList[i].answer
            }
        }
    },

    chooseItem(event) {
      const userAns = event.currentTarget.dataset.id
      console.log(userAns)
      this.setData({
        'focus': event.currentTarget.dataset.id
      })
      const rightAns = this.matchAnswer(userAns, 'choiceList')
      if (!rightAns) {
        this.setData({
          'rightAns': userAns,
          'correct': userAns
        })
      } else {
        this.setData({
          'correct': rightAns,
          'rightAns': rightAns,
        })
      }

    }
})