// pages/goodsReturn/goodsReturn.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        returnList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            page: 1,
            returnList: [],
            allLoad: false
        })
        this.getReturnList()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },
    //  获取退货单列表
    getReturnList() {
        let that = this;
        util.showLoading();
        util.request('/out/rejected/goods/getOrderListByUserId', 'GET', {
            delivery_user_id: app.globalData.deliveryUserInfo.delivery_user_id,
            mode: 4,
            area_id: '',
            region_id: '',
            shop_id: ''
        }, res => {
            let datas = res.data.result.list;
            for (let i = 0; i < datas.length; i++) {
                datas[i].create_time = util.getTime({
                    data: datas[i].create_time
                })
            }
            let length = datas.length;
            if (!this.data.allLoad) {
                that.setData({
                    returnList: that.data.returnList.concat(datas),
                })
            }
            if (length == 15) {
                that.setData({
                    page: that.data.page + 1
                })
            } else {
                that.setData({
                    allLoad: true,
                })
            }
            wx.hideLoading();
        }, err => {
            wx.hideLoading();
            console.log(err)
        })
    },
    //  详情
    toDetail(e) {
        wx.navigateTo({
            url: "/pages/returnOrderDetail/returnOrderDetail?id=" + e.currentTarget.dataset.id ,
        })
    },
    //  新增退货单
    toNewReturn () {
        wx.navigateTo({
            url: "/pages/addNewReturn/addNewReturn",
        })
    },
    /**
     * 页面相关事件处理函数--监听用户上拉动作
     */
    onReachBottom: function () {
        this.getReturnList()
    },
})