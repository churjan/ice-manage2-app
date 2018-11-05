const util = require('../../../utils/util.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        allData: [],
        shopList: [],   // 勾选树
        idList: [],
        itemList: [],
        already: false,
        hasData: false,
        searchkey: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getAllData()
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
            already: true,
        })
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },
    //  点击
    checkItem (e) {
        let eq = e.currentTarget.dataset
        let data = this.data.allData
        let item = data[eq.g].children[eq.f].children[eq.c]
        let isChecked = item.checked
        let idList = this.data.idList
        let itemList = this.data.itemList
        item.checked = !isChecked
        if (!item.checked){
            this.data.idList.forEach((id, index) => {
                if (id == item.shop_id){
                    idList.splice(index, 1)
                    itemList.splice(index, 1)
                }
            })
        }
        this.setData({
            allData: data,
            idList: idList,
            itemList: itemList
        })
        this.recordCheck()
    },
    //get mode time
    getAllData: function () {
        util.showLoading();
        let that = this;
        util.request('/weixin/minapp/Operatingtools/shopOutbounds/availableOutBoundShop', 'GET', {
            shop_type: 2,
            keyword: this.data.searchkey ? this.data.searchkey : ''
        }, res => {
            let datas = res.data.data;
            this.setData({
                hasData: false
            })
            datas = that.formatModeData(datas);
            that.setData({
                allData: datas,
            })
            wx.hideLoading()
        })
    },
    //format mode data
    formatModeData: function (datas) {
        if(this.data.idList.length > 0){
            this.already(datas)
        }
        let allData = datas.area_list;
        allData.forEach(area => {
            area.children = [];
            area.acMode = false;
            datas.city_list.forEach(region => {
                if (area.area_id === region.area_id) {
                    area.children.push(region);
                    region.acMode = false;
                    region.children = [];
                    datas.shop_list.forEach(shop => {
                        this.setData({
                            hasData: true
                        })
                        shop.acMode = false;
                        if (shop.region_id === region.region_id) {
                            area.haveChildren = true;
                            region.haveChildren = true;
                            region.children.push(shop)
                        }
                    })
                }
            })
        })
        return allData
    },
    //  搜索
    getIceList() {
        this.recordCheck()
        this.getAllData()
    },
    //  已勾选
    already(datas) {
        datas.shop_list.forEach(shop => {
            this.data.idList.forEach(item => {
                if(shop.shop_id == item){
                    shop.checked = true
                }
            })
        })
    },
    //  记录勾选
    recordCheck () {
        let data = this.data.allData
        let idList = [],
            itemList = [],
            hash = {}
        data.forEach(area => {
            area.children.forEach(city => {
                city.children.forEach(shop => {
                    if (shop.checked) {
                        idList.push(shop.shop_id)
                        itemList.push(shop)
                    }
                })
            })
        })
        this.setData({
            idList: Array.from(new Set(this.data.idList.concat(idList))),
            
        })
        if (this.data.itemList.concat(itemList).length > 0){
            let arr = this.data.itemList.concat(itemList).reduce((item, next) => {
                hash[next.shop_id] ? '' : hash[next.shop_id] = true && item.push(next);
                return item
            }, [])
            this.setData({
                itemList: arr
            })
        }
    },
    //查询
    searchInput(e) {
        this.setData({
            searchkey: e.detail.value
        })
    },
    //  生成配送单
    toOrder () {
        this.recordCheck()
        if (this.data.idList.length == 0) return
        wx.navigateTo({
            url: '/dispatching/pages/buildOrder/buildOrder?shopList=' + JSON.stringify(this.data.itemList),
        })
    }, 
})