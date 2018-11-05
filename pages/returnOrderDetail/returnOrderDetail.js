// pages/returnOrderDetail/returnOrderDetail.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        data: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let id = options.id
        this.getDetail(id)
    },
    //  获取详情
    getDetail(id) {
        util.request('/out/rejected/goods/get_order_detail', 'GET', {
            rc_id: id
        },res => {
            if(res.data.err_code == 200) {
                res.data.result.list[0].create_time = util.getTime({
                    data: res.data.result.list[0].create_time
                })
                this.setData({
                    data: res.data.result
                })
            }
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

})