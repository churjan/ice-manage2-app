const app = getApp()
import md5 from '../../plugins/md5/md5.js'
import util from '../../utils/util.js'

Page({
	data: {
		logo: {
			img: '../../pic/logo.png',
			name: '运营工具'
		},
		username: '',
		password: '',
		userCha: false,
		passCha: false
	},

	onLoad: function(){
		let that = this;
        this.checkInfo()
		wx.getStorage({
			key: 'loginInfo',
			success: res => {
				if(res.data){
					that.setData({
						username: res.data.username,
						password: res.data.password
					})
				}
			}
		})
	},
    //  检查授权
    checkInfo() {
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success: res => {
                            app.globalData.userInfo = res.userInfo
                        }
                    })
                }
            }
        })
    },
	// focus in username
	userFocus: function(e){
		this.setData({
			userCha: e.detail.value ? true : false
		})
	},

	// keying in username
	userInput: function(e){
		let value = e.detail.value;
		this.setData({
			username: value,
			userCha: value ? true : false
		})
	},

	// blur in username
	userBlur: function(e){
		this.setData({
			userCha: false
		})
	},
    //  change password type
    changeType () {
		let that = this, bool = that.data.passCha;
        that.setData({
			passCha: !bool
        })
    },
	// keying in password
	pswInput: function (e) {
		let value = e.detail.value;
		this.setData({
			password: value
		})
	},
	//清除账号
	clearname(){
		let _self = this;
		this.setData({
			username: '',
			password: '',
			userCha: false
		})
	},
	//login
	login: function(){
		let that = this;
		
		if(that.data.username == ''){
			util.showToast('账号错误')
		}else{
			if (that.data.password == ''){
				util.showToast('密码错误')
			}else{
				util.showLoading('正在登录...')
				util.request('/easygo/user/login','POST',{
					admin_name: that.data.username,
					password: md5(that.data.password)
				},res => {
					let datas = res.data;
					if(datas.ret == 200){
						app.globalData.real_name = datas.data.real_name;
						app.globalData.session_id = datas.data.session_id;
						util.request('/easygo/user/sign','GET',{}, result => {
							app.globalData.sign = result.data.data.sign;
							app.globalData.time = result.data.data.time;
							wx.setStorage({
								key: 'loginInfo',
								data: {
									username: that.data.username,
									password: that.data.password,
								}
							})
							wx.setStorage({
								key: 'headerInfo',
								data: {
									sign: result.data.data.sign,
									time: result.data.data.time,
									session: datas.data.session_id
								}
							})
							util.redTo('index/index')
						})
                        
					}else{
						util.showToast(datas.error_msg ? datas.error_msg:'登录失败！')
					}
				}, err => {
					console.log(err)
					util.showToast('登录失败！')
				})
			}
		}
	},
})