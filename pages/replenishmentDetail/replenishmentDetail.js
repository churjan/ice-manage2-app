// pages/replenishmentDetail/replenishmentDetail.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        data: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id
        this.getDetail(id)
    },
    //  详情
    getDetail (id) {
        util.request('/easygo/goods/entry_record_detail', 'GET', {
            rc_id: id,
            delivery_user_id: app.globalData.deliveryUserInfo.delivery_user_id,
            type: 2
        },res => {
            res.data.result.detail.create_time = util.getTime({
                data: res.data.result.detail.create_time
            })
            this.setData({
                data: res.data.result
            })
        },err => {
            console.log(err)
        })
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})