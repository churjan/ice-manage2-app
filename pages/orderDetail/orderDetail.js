const app = getApp()
import util from '../../utils/util.js'
Page({
	data: {
		orderDetail:{},
		isCaptain: 1,
	},

	onLoad: function (options) {
		let that = this,sn = options.sn;
		that.setData({
			isCaptain: app.globalData.deliveryUserInfo.is_captain
		})
		this.getDetail(sn);
	},

	onShow: function () {

	},
	//获取单详情
	getDetail(sn){
		let that = this;
		util.request('/supplier/enter/enter_detail','GET',{
			g_e_id:sn
		},res =>{
			
			res.data.result.detail.create_time = util.getTime({
				data: res.data.result.detail.create_time
			})
			that.setData({
				orderDetail:res.data.result
			})
		}, err =>{
			console.log('xqsb',err)
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