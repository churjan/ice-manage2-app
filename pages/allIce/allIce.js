const app = getApp()
import util from '../../utils/util.js'
let shopId;
Page({
    data: {
		searchkey:'',
		iceList:[],
        show_onoff: false,
		isReady:false,
        detail:{
            name:'',
			address:'',
			lockstatus:0,
			camera_status:[{
                    status:0,
                },{
                    status: 0,
                }, {
                    status: 1,
                }, {
                    status: 0,
                }],
            singal:'200k/s'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
		this.getIceList();
    },
	//冰箱列表
	getIceList(){
		let that = this , _data = this.data;
		that.setData({
			isReady:false
		})
		util.request('/easygo_minapp/minapp/image_box_list','GET',{
			name: that.data.searchkey
		},res =>{
			if(res.data.err_code == 200){
				let list = res.data.result.shop_list;
				that.setData({
					iceList: list,
					isReady: true
				})
			}else{
				that.setData({
					iceList: []
				})
			}
			
		}, err =>{
			console.log(err)
		})
	},
	//查询
	searchInput(e){
		let that = this, _data = that.data;
		let searchkey = e.detail.value;
        that.setData({
            searchkey: searchkey
        })
	},
    checkIce(e) {
        let iceId = e.currentTarget.dataset.iceid,
			shopName = e.currentTarget.dataset.shopname,
            shoptype = e.currentTarget.dataset.shoptype,
			shopId = e.currentTarget.dataset.shopid
		app.globalData.iceInfo = {
			shop_sn: iceId,
			shop_name: shopName,
			shop_type: shoptype,
            shop_id: shopId
		}
        wx.navigateBack({})
    },
    // 设备详情
    detailIce(e){
        let that = this, _data = this.data;
		console.log(e)
		shopId = (e && e.currentTarget && e.currentTarget.dataset.shopid) ? e.currentTarget.dataset.shopid:e;
		
		util.request('/image_box/status_info', 'GET', {
			shop_id: shopId
        }, res => {
			console.log(res.data.result)
            if (res.data.err_code == 200) {
                that.setData({
                    show_onoff: true,
                    detail: res.data.result
                })
            } else {
				if (res.data.err_code && res.data.err_code != 200){
					util.showToast(res.data.err_msg ? res.data.err_msg : '设备详情获取失败')
				}
            }
        }, err => {
            console.log(err)
        })
    },
    // 取消
    cancle(e){
        let that = this;
        if (!e.target.dataset.cancel) {
            return
        }
        that.setData({
            show_onoff: false
        })
    },
    // 重置
    reset() {
        let that = this;
        util.showLoading('设备重置中...');
        util.request('/image_box/operate', 'POST', {
            type: 'reset',
            shop_id: shopId
        }, res => {
            wx.hideLoading();
            if (res.data.err_code == 200) {
                util.showToast('设备重置成功！')
                that.detailIce(shopId);
            } else {
                util.showToast(res.data.err_msg ? res.data.err_msg : '重置失败，请稍后重试！')
            }
        }, err => {
            wx.hideLoading();
            util.showToast('重置失败，请稍后重试！')
        })
    },
    // 重启设备
    rebootDevice(){
        let that = this;
		util.showLoading('设备重启中...');
		util.request('/image_box/operate', 'POST', {
			type: 'reboot',
			shop_id: shopId
		},res =>{
			console.log(res)
			wx.hideLoading();
			if (res.data.err_code == 200) {
				util.showToast('设备重启需要几分钟，请耐心等待！')
				that.detailIce(shopId);
			} else {
				util.showToast(res.data.err_msg ? res.data.err_msg : '重启失败，请稍后重试！')
			}
		}, err =>{
			wx.hideLoading();
			console.log(err)
			util.showToast('重启失败，请稍后重试！')			
		})
    },
    // 开门
    openDoor(){
        let that = this;
		util.showLoading('开门处理中...');
		util.request('/image_box/operate', 'POST', {
			type: 'forcedunlock',
			shop_id: shopId
		}, res => {
			console.log(res)
			wx.hideLoading();
			if(res.data.err_code == 200){
				util.showToast('开门成功！')
				that.detailIce(shopId);
			}else{
				util.showToast(res.data.err_msg ? res.data.err_msg:'开门失败，请稍后重试！')
			}
		}, err => {
			wx.hideLoading();
			util.showToast('开门失败，请稍后重试！')
			console.log(err)
		})
    }
})