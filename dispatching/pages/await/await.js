const util = require('../../../utils/util.js');
const app = getApp()
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
        this.getList()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },
    //  获取配送列表
    getList () {
        util.request('/weixin/minapp/Operatingtools/ShopOutboundsItem/getAwaitShoplist', 'GET', {

        },res => {
            if(res.data.err_code == 200){
                this.setData({
                    data: res.data.result.list
                })
            }else{
                wx.showModal({
                    content: res.data.err_msg,
                })
            }
        },err => {

        })
    },
    //  确认布点
    confirm(e) {
        let item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: "/dispatching/pages/confirmSet/comfirmSet?item=" + JSON.stringify(item),
        })
    },
    

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    
})