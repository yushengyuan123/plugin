export function errorMessage(status) {
    if (status == 4031) {
        wx.showToast({
            title: '用户无权限',
            icon: "none"
        })
    } else {
        wx.showToast({
            title: '其他错误',
            icon: "none"
        })
    }
}