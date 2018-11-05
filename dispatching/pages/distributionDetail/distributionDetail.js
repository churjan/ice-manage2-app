const util = require('../../../utils/util.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showFloat: false,
        data: {},
        orderId: '',
        isRecord: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            isRecord: options.isRecord ? true : false,
            orderId: options.id
        })
        this.getDetail()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    getDetail() {
        util.request('/weixin/minapp/Operatingtools/shopOutbounds/show/' + this.data.orderId, 'GET', {
            
        },res => {
            if(res.data.err_code == 200){
                let data = res.data.result
                data.create_time = util.getTime({
                    data: data.create_time
                })
                data.receive_time = util.getTime({
                    data: data.receive_time
                })
                this.setData({
                    data: data
                })
            }else{
                wx.showModal({
                    content: res.data.err_msg,
                })
            }
        },err => {
            console.log(err)
        })
    },
    //  隐藏浮层
    hideFloat(e) {
        let isHide = e.target.dataset.hide
        if (isHide) {
            this.setData({
                showFloat: false
            })
        }
    },
    //  领取
    takeOrder() {
        this.setData({
            showFloat: true
        })
    },
    //  确认
    confirm() {
        util.request('/weixin/minapp/Operatingtools/shopOutbounds/gainOutboundOrder', 'POST', {
            shop_outbound_id: this.data.orderId
        },res => {
            if(res.data.err_code == 200){
                wx.showToast({
                    title: '领取成功',
                    success: () => {
                        setTimeout(() => {
                            wx.navigateBack({
                                delta: 1
                            })
                        },1500)
                    }
                })
            }else{
                wx.showModal({
                    content: res.data.err_msg,
                })
            }
        },err => {
            console.log(err)
        })
    },
})