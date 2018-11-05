const app = getApp();
const util = require('../../utils/util.js');
import datePicker from '../../template/date-picker/date-picker.js'
const date = new Date();

Page({
	data: {
		isReady:false,
		start_time: '',
		start_stemp:'',
		end_time: '',
		end_stemp:'',
		page:1,
		orderList:[],
		loading: {
			loading: true,
			icon: 'loading.gif',
			text: '加载中'
		},
		getMore: false
	},

	onLoad: function (options) {
		let that = this,year = date.getFullYear(), month = date.getMonth();
		let days = month == 3 || month == 5 || month == 8 || month == 10 ? util.getDays(2) : month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11 ? util.getDays(1) : year % 4 == 0 && month == 1 ? util.getDays(3) : util.getDays(4);
		console.log(util.getExactDate(0))
		console.log(util.getExactDate(-7))
		that.setData({
			start_time: util.getExactDate(-7),
			end_time: util.getExactDate(0),
			pickerView: {
				years: util.getYears(),
				year: date.getFullYear(),
				months: util.getMonths(),
				month: date.getMonth() + 1,
				days: days,
				day: date.getDate(),
				pickerValue: [9999, date.getMonth(), date.getDate() - 1],

				picker: false
			},
		})
		that.setData({
			start_stemp: util.getTimeStamp(that.data.start_time, 'start'),
			end_stemp: util.getTimeStamp(that.data.end_time, 'end'),
		})

	},
	onShow: function () {
		let that = this;
		that.getDatas();
	},
	getDatas() {
		let that = this;
		util.showLoading();
		that.setData({
			isReady:false,
			getMore: false,
			loading: {
				loading: false,
				icon: 'loading.gif',
				text: '加载中...'
			}
		});
		util.request('/supplier/enter/enter_list', 'GET', {
			g_w_id:'',
			delivery_user_id: app.globalData.deliveryUserInfo.delivery_user_id,
			start_time: that.data.start_stemp,
			end_time: that.data.end_stemp,
			page: that.data.page,
			page_limit: 15
		}, res => {
			console.log('list', res.data)
			let datas = res.data.data.list;
			for (let i = 0; i < datas.length; i++) {
				datas[i].create_time = util.getTime({
					data: datas[i].create_time
				})
			}
			let length = datas.length;
			that.setData({
				isReady:true,
				orderList: datas,
				getMore: length == 15 ? true : false,
				loading: {
					loading: length == 15 ? true : false,
					icon: length == 15 ? '' : 'okay.png',
					text: length == 15 ? '' : '已加载全部数据'
				}
			})
			wx.hideLoading();
		}, err => {
			console.log('list=sb', err)
		})
	},
	//时间选择
	chooseTime(e) {
		console.log(e)
		this.setData({
			start_time: e.detail.value,
			start_stemp: util.getTimeStamp(e.detail.value, 'start'),
			'pickerView.picker': true
		})
		console.log(this.data.start_stemp)
	},
	pickerChange(e) {
		datePicker.pickerChange(e.detail.value)
	},
	hidePicker(e) {
		datePicker.hidePicker(e.target.dataset.map)
	},
	userPicker() {
		datePicker.userPicker()
	},
	onReachBottom: function () {
		let that = this,_data = this.data;
		if (_data.getMore){
			let pages = that.data.page + 1;
			that.setData({
				page:pages,
				getMore: false,
				loading: {
					loading: false,
					icon: 'loading.gif',
					text: '加载中...'
				}
			});
			util.showLoading();
			util.request('/supplier/enter/enter_list', 'GET', {
				g_w_id: '',
				delivery_user_id: app.globalData.deliveryUserInfo.delivery_user_id,
				start_time: that.data.start_stemp,
				end_time: that.data.end_stemp,
				page: pages,
				page_limit: 15
			}, res => {
				console.log('list', res.data)
				let datas = res.data.data.list;
				for (let i = 0; i < datas.length; i++) {
					datas[i].create_time = util.getTime({
						data: datas[i].create_time
					})
				}
				let length = datas.length;
				that.setData({
					orderList: _data.orderList.concat(datas),
					getMore: length == 15 ? true : false,
					loading: {
						loading: length == 15 ? true : false,
						icon: length == 15 ? '' : 'okay.png',
						text: length == 15 ? '' : '已加载全部数据'
					}
				})
				wx.hideLoading();
			}, err => {
				console.log('list=sb', err)
			})
		}else{
			that.setData({
				getMore: false,
				loading: {
					loading: false,
					icon: 'okay.png',
					text: '已加载全部数据'
				}
			});
		}
	},

})