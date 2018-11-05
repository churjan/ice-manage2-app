const util = require('../../../utils/util.js');
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        data: [],
        page: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            page: 1,
            allLoad: false,
            data: []
        })
        this.distributionList()
    },
    //  可领取配送单
    distributionList() {
        let page = this.data.page
        wx.showLoading({
            title: '数据加载中...',
        })
        util.request('/weixin/minapp/Operatingtools/shopOutbounds/availableOutBoundOrder', 'GET', {
            page: page,
            page_limit: 15
        },res => {
            if(res.data.err_code == 200){
                let data = res.data.result.list
                if (!this.data.allLoad) {
                    this.setData({
                        data: this.data.data.concat(data)
                    })
                }
                if(data.length == 15){
                    this.setData({
                        page: page + 1
                    })
                }else{
                    this.setData({
                        allLoad: true
                    })
                }
            }else{
                wx.showModal({
                    content: res.data.err_msg,
                })
            }
            wx.hideLoading()
        },err => {
            wx.hideLoading()
            console.log(err)
        })
    },
    toDetail (e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: "/dispatching/pages/distributionDetail/distributionDetail?id=" + id,
        })
    },


    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        this.distributionList()
    },
})