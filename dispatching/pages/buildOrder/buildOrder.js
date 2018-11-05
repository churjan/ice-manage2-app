// dispatching/pages/buildOrder/buildOrder.js
const util = require('../../../utils/util.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showFloat: false,
        address: '',
        awaitAddress: '',
        shopList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            shopList: JSON.parse(options.shopList)
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
        this.setData({
            address: wx.getStorageSync('address')
        })
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
    // 删除
    removeItem (e) {
        let index = e.currentTarget.dataset.index
        let pages = getCurrentPages()
        let pagePre = pages[pages.length - 2]
        let preData = pagePre.data
        let allData = preData.allData
        allData.forEach(area => {
            area.children.forEach(city => {
                city.children.forEach(shop => {
                    if (shop.shop_id && shop.shop_id == this.data.shopList[index].shop_id){
                        shop.checked = false
                    }
                })
            })
        })
        preData.idList.splice(index, 1)
        preData.itemList.splice(index, 1)
        this.data.shopList.splice(index, 1)
        this.setData({
            shopList: this.data.shopList
        })
        pagePre.setData({
            idList: preData.idList,
            itemList: preData.itemList,
            allData: allData
        })
    },
    // 添加便利盒
    back() {
        wx.navigateBack({
            delta: 1
        })
    },
    // 生成配送单
    buildNewCode() {
        let address = this.data.address
        let shopList = this.data.shopList
        if (!address || shopList.length == 0){
            return
        }
        wx.showModal({
            title: '',
            content: '确认生成配送单',
            success: (res) => {
                if (res.confirm){
                    wx.setStorage({
                        key: 'address',
                        data: address,
                    })
                    util.request('/weixin/minapp/Operatingtools/shopOutbounds/store', 'POST', {
                        shop_ids: shopList.map(item => { return item.shop_id}).join(','),
                        delivery_address: address
                    },res => {
                        if(res.data.err_code == 200){
                            wx.showToast({
                                title: '操作成功',
                                success: () => {
                                    setTimeout(() => {
                                        wx.redirectTo({
                                            url: '/pages/index/index',
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
                }
            }
        })
    },
    // 隐藏浮层
    hideFloat(e) {
        let isHide = e.target.dataset.hide
        if (isHide){
            this.setData({
                showFloat: false,
                awaitAddress: ''
            })
        }
    },
    // 填写地址
    writeAddress () {
        this.setData({
            showFloat: true,
            awaitAddress: this.data.address
        })
    },
    // 确认
    confirm () {
        this.setData({
            showFloat: false
        })
        this.setData({
            address: this.data.awaitAddress.trim()
        })
    },
    // 确认配送地址
    addressInput (e) {
        let data = e.detail.value
        this.setData({
            awaitAddress: data
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})