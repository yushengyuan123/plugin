const app = getApp();
export let websocketInstance = ''
export function websocket(router) {
    const url = app.globalUrlBase.wss + router + '?x-auth-token=' + app.sessionID;
    websocketInstance = wx.connectSocket({
        url: url,
        success(res) {
            console.log('websocket连接成功', res)
            openSocket()
            receiptInfo()
        }
    })
}

function openSocket() {
    wx.onSocketOpen(function () {
        console.log('通道打开')
        sendMessage()
    })
}

function receiptInfo() {
    wx.onSocketMessage(function (res) {
        console.log('服务器返回信息', res)
    })
}

function sendMessage() {
    console.log('发送消息')
    wx.sendSocketMessage({
        data: JSON.stringify({
            grade:10
        }),
        success(res) {
            console.log('成功发送消息')
        }
    })
}

function waiting(res) {
    if (res.user.length === 1 ) {
        console.log('现在处于等待状态')
    } else {
        console.log('现在处于pk状态')
    }
}