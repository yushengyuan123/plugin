export function rollBack() {
    const pages = getCurrentPages(); //当前页面
    const beforePage = pages[pages.length - 2];
    wx.navigateBack({
        success: function () {
            beforePage.onLoad(); // 执行前一个页面的onLoad方法
        }
    });
}