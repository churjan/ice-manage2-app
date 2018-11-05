// pages/addNewReturn/addNewReturn.js
const app = getApp();
const util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        returnList: [],
        returnListClone: [],
        canClick: false,
        clickIndex: -1
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
            canClick: false
        })
        this.getPersonList()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },
    //  新增退货单
    getPersonList () {
        wx.showLoading({
            title: '数据加载中...',
        })
        util.request('/weixin/minapp/delivery/goodsList', 'GET', {
            delivery_user_id: app.globalData.deliveryUserInfo.delivery_user_id,
        },res => {
            if(res.data.err_code == 200){
                let data = res.data.result
                data.forEach(item => {
                    if (item.goods_count < 0) item.goods_count = 0
                })
                this.setData({
                    returnList: data,
                    returnListClone: JSON.parse(JSON.stringify(data)),
                })
            }
            wx.hideLoading()
        },err => {
            wx.hideLoading()
        })
    },
    //  点击
    beChecked (e) {
        let index = e.currentTarget.dataset.index
        let isCheck = e.currentTarget.dataset.checked
        let data = this.data.returnList
        let canClick = []
        data[index].checked = !data[index].checked
        canClick = data.filter(item => {
            return item.checked
        })
        this.setData({
            returnList: data,
            canClick: canClick.length > 0 ? true : false
        })
        
    },
    //  阻止冒泡
    preventDefault (e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            clickIndex: index
        })
    },
    //  表单值修改
    changeValue (e) {
        let index = e.currentTarget.dataset.index
        let value = e.detail.value
        let data = this.data.returnList
        let cloneData = this.data.returnListClone
        let cloneCount = Number(cloneData[index].goods_count)
        if (value <= cloneCount){
            data[index].goods_count = value
        }else{
            data[index].goods_count = cloneData[index].goods_count
        }
        this.setData({
            returnList: data,
        })
    },
    onBlur (e) {
        let index = e.currentTarget.dataset.index
        let value = e.detail.value
        let data = this.data.returnList
        if (!value){
            data[index].goods_count = 0
            this.setData({
                returnList: data,
            })
        }
    },
    //  跳新增退货单
    toNewReturn () {
        if(!this.data.canClick){
            return
        }
        let returnList = this.data.returnList
        let data = returnList.filter(item => {
            return item.checked
        })
        if(data.length == 0){
            wx.showModal({
                title: '提示',
                content: '请先选择退货单',
            })
        }else{
            wx.navigateTo({
                url: "/pages/postReturn/postReturn?list=" + JSON.stringify(data),
            })
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },
})