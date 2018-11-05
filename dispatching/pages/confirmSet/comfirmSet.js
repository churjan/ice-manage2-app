const util = require('../../../utils/util.js');
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showFloat: false,
        data: {},
        id: '',
        imageList: [],
        images: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let data = JSON.parse(options.item)
        this.setData({
            data: data,
            id: data.s_o_s_id
        })
    },
    //  上传图片
    upFile () {
        wx.chooseImage({
            count: 1,
            success: (res) => {
                let choose = res
                wx.showLoading({
                    title: '图片上传中',
                })
                wx.uploadFile({
                    url: app.globalData.apiUrl + '/weixin/minapp/Operatingtools/ShopOutboundsItem/uploadImg',
                    filePath: res.tempFilePaths[0],
                    name: 'img',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'LC-Appkey': '723949279',
                        'LC-Session': app.globalData.session_id,
                        'LC-Timestamp': app.globalData.time,
                        'LC-Sign': app.globalData.sign
                    },
                    success: (res) => {
                        if (JSON.parse(res.data).err_code == 200){
                            let result = JSON.parse(res.data).result
                            let images = this.data.images
                            images.push(result)
                            wx.showToast({
                                title: '上传成功',
                            })
                            this.setData({
                                imageList: this.data.imageList.concat(choose.tempFilePaths),
                                images: images
                            })
                        }else{
                            wx.showToast({
                                title: '上传服务器失败',
                            })
                        }
                    },
                    fail: () => {
                        wx.showToast({
                            title: '图片上传失败',
                        })
                    }
                })
            }
        })
    },
    //  删除图片
    removeItem (e) {
        let index = e.currentTarget.dataset.index
        let imageList = this.data.imageList
        let images = this.data.images
        imageList.splice(index, 1)
        images.splice(index,1)
        this.setData({
            imageList: imageList,
            images: images
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    //  隐藏浮层
    hideFloat(e) {
        let isHide = e.target.dataset.hide
        if (isHide) {
            this.setData({
                showFloat: false
            })
        }
    },
    //  确认布点
    sure() {
        let data = this.data.imageList
        if (data.length < 3) {
            wx.showModal({
                content: '请图片数量不小于3张',
            })
            return
        }
        this.setData({
            showFloat: true
        })
    },
    //  确认
    confirm() {
        let data = this.data.images
        console.log(data)
        util.request('/weixin/minapp/Operatingtools/ShopOutboundsItem/OutBoundShopComplete', 'POST', {
            images: JSON.stringify(data),
            s_o_s_id: this.data.id
        },res => {
            if(res.data.err_code == 200){
                wx.showToast({
                    title: '布点成功',
                    success: () => {
                        setTimeout(() => {
                            wx.navigateBack({
                                delta: 1
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
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})