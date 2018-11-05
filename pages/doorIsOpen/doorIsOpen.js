// pages/doorIsOpen/doorIsOpen.js
var app = getApp()
import util from '../../utils/util.js'
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
	
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		that.checkDoorStatus();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
	
	},
		
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
	
	},
	checkDoorStatus(){
		let that = this, _data = this.data;
		util.request('/weixin/minapp/eg_w/image/closed', 'GET', {
			asid: app.globalData.iceInfo.shop_sn
		}, res => {
			let datas = res.data;
			if (datas.err_code == 200) {
				//门未关
				if (datas.result == 0) {
					that.checkDoorStatus()
					//门已关
				} else {
					util.showToast('冰箱门已关闭')
					setTimeout(() => {
						wx.reLaunch({
							url: '/pages/index/index'
						})
					}, 1000)
				}
			} else {
				util.showToast(datas.err_msg)
			}
		}, err => {

		})
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
	
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
	
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
	
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
	
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
	
	}
})