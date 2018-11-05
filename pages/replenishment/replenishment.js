// pages/replenishment/replenishment.js
var app = getApp()
import util from '../../utils/util.js'
let isReady = false, isCalibration = false;
Page({
	data: {
		ice_sn:'',
        oper_status: 'shipment',	//check:检查库存；shipment:装货; calibration:校准
		capture_goods: [],
		diff_goods:[],
		tipData: {
			showTip: true,
			icon: 'loading.gif',
			text1: '补货完成',
			text2:'3s后回到首页'
		},
		countDown:3,
		shopname:'',
		isReady:false,	//false从首页进来
        // 组件属性
        isShowCalibrat: false,
        calibratIndex: 0,
        isChange: false,
        source_goods: null,
        resultData: []
        
	},
	onLoad: function (options) {
		let that = this;
        this.toShipment();
		if (app.globalData.iceInfo && app.globalData.iceInfo.shop_type == 2) {
			that.setData({
				isRfid: true
			})
		}
	},
	onShow: function () {
		this.setData({
			shopname: app.globalData.iceInfo.shop_name
		})
	},
	//补货当前sku数据
	getCurrentData(opentype){
		let that = this, _data = this.data;
		util.showLoading();
		util.request('/image_box/check_inventory', 'GET', {
			shop_sn: app.globalData.iceInfo.shop_sn,
			type:opentype?opentype:4
		}, res => {
			wx.hideLoading()
			if (res.data.err_code == 200) {
				if (res.data.result.box_type == 1) { that.setData({ isRfid: true }) }
				that.setData({
					capture_goods: res.data.result.box_type == 1 ? res.data.result.data : res.data.result.capture_goods,
                    source_goods: res.data.result.box_type == 1 ? res.data.result.data : res.data.result.capture_goods,
					diff_goods: res.data.result.box_type == 1 ? res.data.result.diff_data : res.data.result.diff_goods
				})
				// that.setData({  
				// 	capture_goods: app.globalData.iceInfo.shop_type == 2 ? res.data.result.data : res.data.result.capture_goods,
				// 	diff_goods: app.globalData.iceInfo.shop_type == 2 ? res.data.result.diff_data : res.data.result.diff_goods
				// })
                if (app.globalData.warn.formId){
                    util.warn(1, app.globalData.warn.formId)
                    app.globalData.warn.formId = ''
                }
				if (isReady) {
					util.showToast('数据更新完毕')
				}
				if (that.data.oper_status == 'shipment') {
					that.setData({
						oper_status: 'calibration'
					})
				} else if (that.data.oper_status == 'calibration' && !isCalibration){
					that.timerMask();
				} else if (that.data.oper_status == 'calibration' && isCalibration) {
					util.showToast('数据校准完毕')
				}
			} else {
				if (res.data.err_code == 70037) {
					util.showToast(res.data.err_msg + '，请先关闭冰箱门');
					if (that.data.oper_status == 'calibration' && isCalibration) {
						setTimeout( ()=>{
							that.toCalibration()
						},1000)
					}
				}else{
					util.showToast(res.data.err_msg);
				}
			}
		}, err => {
			wx.hideLoading()
		})
	},
	//数据出错跳盘点
	toInventory(e){
		let that = this , iceId = e.currentTarget.dataset.ice;
		wx.navigateTo({
			url: '/pages/inventory/inventory?iceId=' + iceId,
		})
	},
	//跳装货
	toShipment(){
		let that = this;
        util.showLoading('开门中...')
		util.request('/image_box/open', 'POST', {
			shop_sn: app.globalData.iceInfo.shop_sn,
			open_type: 4	//2：盘点 补货4 开门纠错3
		}, res => {
			if (res.data.err_code == 200) {
				that.setData({
					oper_status: 'shipment'
				})
			} else {
				util.showToast(res.data.err_msg)
			}
            wx.hideLoading()
		}, err => {
			util.showToast(res.data.err_msg ? res.data.err_msg : '开门失败，请稍后重试')
            wx.hideLoading()
		})
		
	},
	//临时开门/开门校准
	temporaryOpen(){
		let that = this
		util.request('/image_box/open', 'POST', {
			shop_sn: app.globalData.iceInfo.shop_sn,
			open_type: 4	//2：盘点 补货4 开门纠错/临时开门
		}, res => {
			if (res.data.err_code == 200) {
				if (that.data.oper_status == 'calibration'){
					that.toCalibration();
				}else{
					util.showToast('冰箱门已开')
				}
			} else {
				util.showToast(res.data.err_msg)
			}
		}, err => {
			util.showToast(res.data.err_msg ? res.data.err_msg : '开门失败')
		})
	},
    formSubmit(e) {
        let formId = e.detail.formId
        if (formId){
            app.globalData.warn.formId = formId
        }else{
            console.log('get formId error')
        }
    },
	//补货完成
	effectShipment(){
		let that = this;
		that.getCurrentData();
	},
    //  校准方式判断
    correctType() {
        let that = this
        if (!that.data.isChange) {
            that.temporaryOpen()
        } else {
            wx.showModal({
                title: '注意',
                content: '该次开门纠错后，您之前的手动校准会被系统覆盖',
                confirmText: '继续开门',
                success: (res) => {
                    if (res.confirm) {
                        that.temporaryOpen()
                        that.setData({
                            isChange: false
                        })
                    } 
                }
            })
        }
    },
	//校准提示
	toCalibration(){
		let that = this;
        util.showModal('校准', '请重新摆正货物进行校准', (res) => {
            if (res.confirm) {
                isCalibration = true;
                that.getCurrentData(3);
                console.log('确认校准', res)
            } else {
                console.log('取消校准')
            }
        })
	},
	//补货完成
	replenishFinished(){
        clearInterval(app.globalData.timer)
		let that = this;
		that.setData({
			countDown: 3
		})
		util.showModal('补货完成', '请确认数据无误', (res) => {
			if (res.confirm) {
				util.request('/image_box/update_inventory', 'POST', {
					shop_sn: app.globalData.iceInfo.shop_sn,
					update_type: 4, //盘点提交2 补货4
                    correct_data: that.data.resultData
				}, res => {
					if (res.data.err_code == 200) {
						wx.pageScrollTo({
							scrollTop: 0
						})
						isCalibration = false;
						that.getCurrentData();
						
					} else {
						util.showToast(res.data.err_msg ? res.data.err_msg : '更新失败')
						wx.hideLoading();
					}
					
				}, fail => {

				})
				// wx.pageScrollTo({
				// 	scrollTop: 0
				// })
				// isCalibration = false;
				// that.getCurrentData();
			}
		})
	},
	//倒计时
	timerMask(){
		let that = this;
		that.setData({
			tipData: {
				showTip: false,
				icon: 'finish.png',
				text1: '补货完成',
				text2: that.data.countDown + 's后回到首页'
			}
		})
		let timer = setInterval(() => {
			that.data.countDown--;
			that.setData({
				countDown: that.data.countDown,
				tipData: {
					showTip: false,
					icon: 'finish.png',
					text1: '补货完成',
					text2: that.data.countDown + 's后回到首页'
				}
			})
			if (that.data.countDown == 0) {
				that.setData({
					tipData: {
						showTip: true,
						icon: 'finish.png',
						text1: '补货完成',
						text2: that.data.countDown + 's后回到首页'
					}
				})
				clearInterval(timer)
				wx.reLaunch({
					url: '/pages/index/index'
				})
			}
		}, 1000)
	},
    // 组件-监听事件
    getIndex (e) {
        this.setData({
            calibratIndex: e.detail.index,
            isShowCalibrat: true
        })
    },
    hiddenCalibrate(e) {
        if (e.detail.singleType === true) {
            this.setData({
                isShowCalibrat: false,
                isChange: false
            })
        } else {
            this.setData({
                isChange: true,
                capture_goods: {
                    goods_count: e.detail.floorData.goods_count,
                    sku_count: e.detail.floorData.sku_count,
                    list: e.detail.floorData.list
                },
                diff_goods: e.detail.diff_goods,
                floorData: e.detail.floorData,
                isShowCalibrat: e.detail.isShowCalibrat,
            })

            //  检查是否真的改变了数据
            let data = this.data.capture_goods.list,
                hasChange
            if (data.length > 0) {
                data.forEach(item => {
                    item.sku_list.forEach(sku => {
                        if (sku.isChange) {
                            delete sku.isChange
                            hasChange = true
                        }
                    })
                })
                if (hasChange) {
                    data = JSON.stringify(this.data.capture_goods.list)
                } else {
                    data = []
                }
            }
            this.setData({
                resultData: data
            })
            if (data.length > 0) {
                this.setData({
                    isChange: true
                })
            } else {
                this.setData({
                    isChange: false
                })
            }
        }
    },
	onPullDownRefresh: function () {
	
	},
	onReachBottom: function () {
	
	},
	onShareAppMessage: function () {
	
	}
})