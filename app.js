//app.js
var app = getApp()
App({
	data: {
		scene: ''
	},
	onLaunch: function (options) {
        this.checkLoginStatus()
	},
    //  检查登陆态
    checkLoginStatus () {
        let that = this
        let openId = wx.getStorageSync('openId')
        if (openId){
            that.globalData.openId = openId
        }else{
            wx.login({
                success: (login) => {
                    that.codeToInfo(login.code)
                },
            })
        }
        // wx.checkSession({
        //     success() {
        //         wx.getStorage({
        //             key: 'openId',
        //             success: res => {
        //                 that.globalData.openId = res.data
        //             },
        //         })
        //     },
        //     fail() {
        //         wx.login({
        //             success: (login) => {
        //                 that.codeToInfo(login.code)
        //             },
        //         })
        //     },
        // })
    },
    //  code换用户信息
    codeToInfo (code) {
        wx.request({
            url: this.globalData.apiUrl + '/weixin/minapp/eg_us/jscode2Session',
            header: {
                'content-type': 'application/json',
            },
            method: 'GET',
            data: {
                js_code: code
            },
            success: res => {
                let openId = res.data.result.openid
                this.globalData.openId = openId
                wx.setStorage({
                    key: 'openId',
                    data: openId,
                })
            }
        })
    },
	onShow:function(opts){
		if (opts.scene == 1038) { // 场景值 1038：从被打开的小程序返回
			
		}
	},
	globalData: {
        iceInfo: {},        //  便利盒信息
		wareInfo: { g_w_id: '', warehouse_name: '全部仓库'},		//仓库信息
		real_name:'',
		deliveryUserInfo:{},
        warn: {}, // 警告
        timer: null,    //  计时器
        openId: '',
        i: 1,
		//开发
        // apiUrl: 'http://dev.weboxapi.esgao.cn/api',	//开发环境
		
		//测试
		apiUrl: 'http://test.weboxapi.esgao.cn/api',
		
		// 正式
		// apiUrl: 'https://weboxapi.esgao.cn/api',
		
	}
})