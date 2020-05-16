export function rollBack(lifeCycle) {
    lifeCycle = lifeCycle || 'onLoad'
    const pages = getCurrentPages(); //当前页面
    const beforePage = pages[pages.length - 2];
    wx.navigateBack({
        success: function () {
            console.log(beforePage[lifeCycle])
            beforePage[lifeCycle](); // 执行前一个页面的onLoad方法
        }
    });
}