// pages/personShop/personShop.js
const app = getApp();
const util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        sort: 0, // 排序
        allCount: 0,
        allLoad: false,
        shopList: [],
        page: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            allCount: options.count
        })
        this.getPersonShop()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },
    // 获取列表
    getPersonShop(isReset) {
        util.showLoading();
        if (isReset != 'NORESET') {
            this.setData({
                page: 1,
                shopList: [],
                allLoad: false,
            })
        }
        util.request('/weixin/minapp/delivery/goodsList', 'GET', {
            delivery_user_id: app.globalData.deliveryUserInfo.delivery_user_id,
            page: this.data.page,
            page_limit: 15,
            _sort: this.data.sort == 0 ? '-goods_count' : this.data.sort == 1 ? 'goods_count' : this.data.sort == 2 ? '-goods_count' : '',
        },res => {
            if (res.data.err_code == 200){
                let data = res.data.result
                if (!this.data.allLoad) {
                    this.setData({
                        shopList: this.data.shopList.concat(data)
                    })
                }
                if (data.length == 15) {
                    this.setData({
                        page: this.data.page + 1
                    })
                } else {
                    this.setData({
                        allLoad: true,
                    })
                }
            }else{
                console.log(res)
            }
            wx.hideLoading()
        },err => {
            wx.hideLoading()
            console.log(err)
        })
    },
    // 排序
    sort() {
        let sort = this.data.sort
        let len = 2
        if (sort < len) {
            this.setData({
                sort: sort + 1,
            })
        } else {
            this.setData({
                sort: 0,
            })
        }
        this.getPersonShop()
    },
    /**
     * 页面相关事件处理函数--监听用户上拉动作
     */
    onReachBottom: function () {
        this.getPersonShop('NORESET')
    },
})