// pages/postReturn/postReturn.js
const app = getApp()
const util = require('../../utils/util.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isSearch: false,
        storeInfo: null,
        reason: '',
        warehouseList: [],
        returnList: [],
        canClick: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            returnList: JSON.parse(options.list)
        })
        this.getWarehouseList()
    },
    //  获取仓库
    getWarehouseList() {
        let that = this;
        util.request('/supplier/warehouse/auth_warehouse_list', 'GET', {
            page: 1,
            page_limit: 200
        }, res => {
            that.setData({
                warehouseList: res.data.data.list
            })
        }, err => {
            console.log('sb', err)
        })
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

    //  下拉
    toRefrigerator(e) {
        let that = this
        that.setData({
            isSearch: !that.data.isSearch
        })
    },
    //  隐藏下拉
    hideSearch (e) {
        this.setData({
            isSearch: false
        })
    },
    //  选择仓库
    selectStore (e) {
        let data = e.currentTarget.dataset.shopitem
        this.setData({
            storeInfo: data,
            isSearch: false
        })
        if(this.data.reason) {
            this.setData({
                canClick: true
            })
        }
    },
    getReason (e) {
        let data = e.detail.value
        if (data.trim() && this.data.storeInfo){
            this.setData({
                canClick: true
            })
        }else{
            this.setData({
                canClick: false
            })
        }
        this.setData({
            reason: data
        })
    },
    //  提交表单
    toNewReturn () {
        let storeInfo = this.data.storeInfo
        let reason = this.data.reason
        let returnList = this.data.returnList
        let barcodes, sku_ids_count
        if(!this.data.canClick) {
            return
        }
        barcodes = returnList.map(item => {
            return item.barcode
        }).join(',')
        sku_ids_count = returnList.map(item => {
            return item.goods_count
        }).join(',')
        wx.showModal({
            content: '是否提交退货单',
            success: res => {
                if (res.confirm){
                    util.request('/out/rejected/goods/return_goods', 'POST', {
                        barcodes: barcodes,
                        g_w_id: storeInfo.g_w_id,
                        sku_ids_count: sku_ids_count,
                        remark: this.data.reason
                    }, res => {
                        if(res.data.err_code == 200){
                            wx.showToast({
                                title: '提交成功',
                                success: () => {
                                    setTimeout(() => {
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                    },1500)
                                }
                            })
                        }else{
                            wx.showToast({
                                icon: 'none',
                                title: res.data.err_msg,
                            })
                        }
                    }, err => {
                        console.log(err)
                    })
                }
            }
        })
    },
})