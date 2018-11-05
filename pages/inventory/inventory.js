// pages/inventory/inventory.js
const app = getApp();
const util = require('../../utils/util.js');
//isReady false为从首页进来
let isReady = false;
Page({
    data: {
        animationData: {},
		capture_goods:{
			goods_count:'',
			sku_count:'',
			list:[]
		},
        diff_goods: null,
		shopname:'',
		tipData: {
			showTip: true,
			icon: 'loading.gif',
			text1: '盘点完成'
		},
		isRfid:false,
        status: 'NOREADY',
        //  组件属性
        isShowCalibrat: false,
        calibratIndex: 0,
        isChange: false,
        source_goods: null,
        resultData: []
    },
    onLoad: function (options) {
		let that = this;
		this.getSkuInfo();
		if (app.globalData.iceInfo && app.globalData.iceInfo.shop_type == 2){
			that.setData({
				isRfid:true
			})
		}
    },
    onShow: function () {
        this.setData({
			shopname: app.globalData.iceInfo.shop_name
		})
    },
    //  formid
    formSubmit(e) {
        let formId = e.detail.formId
        app.globalData.i = 1
        if (formId) {
            console.log(formId)
            app.globalData.warn = {
                formId: formId,
                date: Date.parse(new Date())
            }
            app.globalData.timer = setInterval(() => {
                let date = Date.parse(new Date())
                let warnInfo = app.globalData.warn
                if (app.globalData.i < 60 - 2){
                    console.log(app.globalData.i++)
                }
             
                if (date - warnInfo.date >= 10*60*1000 - 10000) {
                    util.warn(2, app.globalData.warn.formId)
                    app.globalData.warn = {}
                    clearInterval(app.globalData.timer)
                }
            }, 10000)
        }
    },
    // 加载sku数据
    getSkuInfo (dataType) {
		let that = this, _data = this.data;
        util.showLoading();
		util.request('/image_box/check_inventory', 'GET', {
			shop_sn: app.globalData.iceInfo.shop_sn,
			type: dataType ? dataType:'2'
        },res => {
			console.log(res)
			wx.hideLoading()
			
			if(res.data.err_code == 200){
				if (res.data.result.box_type == 1) { that.setData({ isRfid: true }) }
				//app.globalData.iceInfo.shop_type == 2 RFID冰箱
				// that.setData({
				// 	capture_goods: app.globalData.iceInfo.shop_type == 2 ? res.data.result.data : res.data.result.capture_goods,
				// 	diff_goods: app.globalData.iceInfo.shop_type == 2 ? res.data.result.diff_data : res.data.result.diff_goods
				// })
				//res.data.result.box_type == 1 是 RFID 冰箱
				that.setData({
					capture_goods: res.data.result.box_type == 1 ? res.data.result.data : res.data.result.capture_goods,
                    source_goods: res.data.result.box_type == 1 ? res.data.result.data : res.data.result.capture_goods,
					diff_goods: res.data.result.box_type == 1 ? res.data.result.diff_data : res.data.result.diff_goods
				})
				// that.setData({
				// 	isRfid: true
				// })
                this.setData({
                    status: 'NOREADY',
                    isChange: false
                })
				if (isReady) {
					util.showToast('数据更新完毕')
				}
			}else{
				if (!isReady && res.data.err_code){
					util.showToast(res.data.err_msg)
					setTimeout(() => {
						wx.reLaunch({
							url: '/pages/index/index'
						})
					}, 1000)
				} else{
					if (res.data.err_code == 70037){
						util.showToast(res.data.err_msg + '，请先关闭冰箱门')
						setTimeout(() => {
                            wx.showModal({
                                title: '开门纠错',
                                content: '冰箱门已打开,请重新摆正货物进行纠错',
                                success: res => {
                                    if (res.confirm == true) {
                                        isReady = true;
                                        that.getSkuInfo(3);
                                    }
                                }
                            })
						}, 2000)
					}
				}
			}
            
        },fali => {
            wx.hideLoading()
        })
    },
    //  纠错方式判断
    correctType () {
        let that = this
        if (!that.data.isChange) {
            that.open()
        } else {
            wx.showModal({
                title: '注意',
                content: '该次开门纠错后，您之前的手动校准会被系统覆盖',
                confirmText: '继续开门',
                success: (res) => {
                    if (res.confirm) {
                        that.open()
                        that.setData({
                            isChange: false
                        })
                    }
                }
            })
        }
    },
    //  开门纠错
    open () {
        let that = this;
		util.showLoading();
		util.request('/image_box/open','POST',{
			shop_sn: app.globalData.iceInfo.shop_sn,
			open_type:2,	//2：盘点 ，开门纠错3  补货4
		}, res =>{
			wx.hideLoading();
			if( res.data.err_code == 200){
                wx.showModal({
                    title: '开门纠错',
                    content: '冰箱门已打开,请重新摆正货物进行纠错',
                    success: res => {
                        if (res.confirm == true) {
                            isReady = true;
                            that.getSkuInfo(3);
                        }
                    }
                })
			} else if (res.data.err_code == 70037){
				util.showToast('请关闭冰箱门')
				setTimeout( () =>{
					wx.showModal({
						title: '开门纠错',
						content: '冰箱门已打开,请重新摆正货物进行纠错',
						success: res => {
							if (res.confirm == true) {
								isReady = true;
								that.getSkuInfo(3);
							}
						}
					})
				},2000)
			}else{
				util.showToast(res.data.err_msg)
			}
		}, err =>{
			util.showToast(res.data.err_msg ? res.data.err_msg :'开门失败')
			wx.hideLoading();
		})
    },
    //  提交盘点
    push () {
        let that = this
        wx.showModal({
            title: '盘点',
            content: '请确认数据无误',
            success: res => {
                if (res.confirm == true) {
                    wx.showLoading({
                        title: '数据加载中',
                    })
                    that.confirmPush()
                }
            }
        })
    },
    //  提交盘点
    confirmPush () {
        let that = this
		util.showLoading();
		util.request('/image_box/update_inventory', 'POST', {
			shop_sn: app.globalData.iceInfo.shop_sn,
			update_type:2,
            correct_data: that.data.resultData
		}, res => {
			if (res.data.err_code == 200) {
				wx.pageScrollTo({
					scrollTop: 0
				})
                wx.showToast({
                    title: '盘点完成',
                    icon: 'success',
                })
                this.setData({
                    status: 'ALREADY'
                })
				isReady = true;
			} else {
				util.showToast(res.data.err_msg ? res.data.err_msg : '更新失败')
                wx.hideLoading();
			}
		}, fail => {

		})
    },
    // 开始补货
    goReplenishment () {
        setTimeout(() => {
            wx.navigateTo({
                url: '/pages/replenishment/replenishment'
            })
        },300)
    },
    // 重新盘点
    again () {
        wx.showLoading({
            title: '数据加载中',
        })
        this.getSkuInfo()
    },
    // 组件-监听事件
    getIndex(e) {
        this.setData({
            calibratIndex: e.detail.index,
            isShowCalibrat: true
        })
    },
    hiddenCalibrate (e) {
        if (e.detail.singleType === true) {
            this.setData({
                isShowCalibrat: false,
            })
        } else {
            
            this.setData({
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
            if (data.length > 0){
                this.setData({
                    isChange: true
                })
            }else{
                this.setData({
                    isChange: false
                })
            }
        }
    }
})