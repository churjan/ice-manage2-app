const app = getApp();
const util = require('../../utils/util.js');
let page = 1;
Page({
	data: {
		isSearch:false,
		isReady: false,
		wareInfo:{g_w_id:'',warehouse_name:'全部仓库'},
		warehouseList:[],
		orderList:[],
		loading:{
			loading:true,
			icon:'loading.gif',
			text:'加载中'
		},
		getMore:false
	},
	onLoad: function (options) {
		let that = this;
		that.getWarehouseList();
		
	},
	onShow: function () {
		let that = this;
		page = 1;
		that.getEnterList();
	},
	getWarehouseList(){
		let that = this;
		util.request('/supplier/warehouse/auth_warehouse_list','GET',{
			page:1,
			page_limit:200
		}, res =>{
			that.setData({
				warehouseList:res.data.data.list
			})
		}, err =>{
			console.log('sb',err)
		})
	},
	toWarehouse(){
		let that = this
		that.setData({
			isSearch: !that.data.isSearch
		})
	},
	getEnterList(){
		let that = this;
		that.setData({
			isReady:false,
			getMore: false,
			loading: {
				loading: false,
				icon: 'loading.gif',
				text: '加载中...'
			}
		});
		util.showLoading();
		util.request('/weixin/minapp/delivery/available/goodsOrder','GET',{
			g_w_id: app.globalData.wareInfo.g_w_id,
			page:page,
			page_limit:15
		},res =>{
			console.log('list',res.data)
			let datas = res.data.result;
			for(let i=0;i<datas.length;i++){
				datas[i].create_time = util.getTime({
					data: datas[i].create_time
				})
			}
			let length = datas.length;
			that.setData({
				isReady: true,
				orderList: datas,
				getMore: length == 15 ? true : false,
				loading: {
					loading: length == 15 ? true : false,
					icon: length == 15 ? '' : 'okay.png',
					text: length == 15 ? '' : '已加载全部数据'
				}
			})
			wx.hideLoading();
		}, err =>{
			console.log('list=sb',err)
		})
	},
	hideSearch() {
		let that = this, _data = this.data;
		if (that.data.isSearch) {
			that.setData({
				isSearch: !that.data.isSearch
			})
		}
	},
	//  选择仓库
	selectWarehouse(e) {
		let that = this;
		that.setData({
			isSearch: false
		})
		if (e.currentTarget.dataset.shopname) {
			let gwid = e.currentTarget.dataset.gwid,
				warehouse_name = e.currentTarget.dataset.shopname;
			app.globalData.wareInfo = {
				g_w_id: gwid,
				warehouse_name: warehouse_name,
			}
			that.setData({
				wareInfo: app.globalData.wareInfo
			})
		} 
		page = 1;
		that.getEnterList();
	},
	onReachBottom: function () {
		let that = this, _data = this.data;
		if(_data.getMore){
			page++;
			that.setData({
				getMore: false,
				loading: {
					loading: false,
					icon: 'loading.gif',
					text: '加载中...'
				}
			});
			util.showLoading();
			util.request('/weixin/minapp/delivery/available/goodsOrder', 'GET', {
				g_w_id: app.globalData.wareInfo.g_w_id,
				page: page,
				page_limit: 15
			}, res => {
				console.log('list', res.data)
				let datas = res.data.result;
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
			return;
		}
	},
})