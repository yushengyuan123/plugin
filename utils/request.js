const baseUrl = "http://39.98.41.126:11111"

export function request(url, data) {
    return new Promise(resolve => {
        wx.request({
            url: baseUrl + url,
            header: {
                'Content-Type': 'application/json',
                'x-auth-token': ''
            },
            data: JSON.stringify(data),
            method: 'post',
            success: (res) => {
                console.log(res.data)
                resolve(res.data)
            },
        })
    })
}