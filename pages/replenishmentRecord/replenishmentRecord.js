const app = getApp();
const util = require('../../utils/util.js');
import datePicker from '../../template/date-picker/date-picker.js'
const date = new Date();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        start_time: '',
        start_stemp: '',
        end_time: '',
        end_stemp: '',
        allLoad: false,
        total: 0,
        sort: 0, // 排序 0 默认降 1升 2降
        recordList: [],
        page: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let type = options.type
        let that = this, 
            year = date.getFullYear(), 
            month = date.getMonth(),
            start_time = '',
            end_time = ''
        let days = month == 3 || month == 5 || month == 8 || month == 10 ? util.getDays(2) : month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11 ? util.getDays(1) : year % 4 == 0 && month == 1 ? util.getDays(3) : util.getDays(4);
        if(type == 'today'){
            start_time = util.getExactDate(0)
            end_time = util.getExactDate(0)
        }else if(type == 'month'){
            start_time = util.getExactDate(-(date.getDate() - 1))
            end_time = util.getExactDate(days.length - date.getDate())
        }else{
            start_time = util.getExactDate(-7)
            end_time = util.getExactDate(0)
        }
        that.setData({
            start_time: start_time,
            end_time: end_time,
            pickerView: {
                years: util.getYears(),
                year: date.getFullYear(),
                months: util.getMonths(),
                month: date.getMonth() + 1,
                days: days,
                day: date.getDate(),
                pickerValue: [9999, date.getMonth(), date.getDate() - 1],
                picker: false
            },
        })
        that.setData({
            start_stemp: util.getTimeStamp(that.data.start_time, 'start'),
            end_stemp: util.getTimeStamp(that.data.end_time, 'end'),
        })
        this.getDatas()
    },
    /**
     * 获取数据
     */
    getDatas(isReset) {
        let that = this;
        util.showLoading();
        if (isReset != 'NORESET'){
            that.setData({
                page: 1,
                recordList: [],
                allLoad: false,
            })
        }
        util.request('/easygo/goods/entry_record_list', 'GET', {
            delivery_user_id: app.globalData.deliveryUserInfo.delivery_user_id,
            start_time: that.data.start_stemp,
            end_time: that.data.end_stemp,
            page: that.data.page,
            page_limit: 15,
            good_sorting: that.data.sort == 0 ? '1' : that.data.sort == 1 ? '-1' : that.data.sort == 2 ? '1' : '',
            mode: 4,
            area_id: '',
            region_id: '',
            shop_id: ''
        }, res => {
            let datas = res.data.result.list;
            let length = datas.length;
            if (!this.data.allLoad) {
                that.setData({
                    recordList: that.data.recordList.concat(datas),
                    total: res.data.result.replenishment_count
                })
            }
            if(length == 15){
                that.setData({
                    page: that.data.page + 1
                })
            }else{
                that.setData({
                    allLoad: true,
                })
            }
            wx.hideLoading();
        }, err => {
            wx.hideLoading()
            console.log(err)
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
    },
    //时间选择
    chooseTime(e) {
        this.setData({
            start_time: e.detail.value,
            start_stemp: util.getTimeStamp(e.detail.value, 'start'),
            'pickerView.picker': true
        })
    },
    pickerChange(e) {
        datePicker.pickerChange(e.detail.value)
    },
    hidePicker(e) {
        datePicker.hidePicker(e.target.dataset.map)
    },
    userPicker() {
        datePicker.userPicker()
    },
    // 排序
    sort () {
        let sort = this.data.sort
        let len = 2
        if (sort < len){
            this.setData({
                sort: sort + 1,
            })
        }else{
            this.setData({
                sort: 0,
            })
        }
        this.getDatas()
    },
    // 跳转详情
    navigatorDetail (e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: "/pages/replenishmentDetail/replenishmentDetail?id=" + id,
        })
    },
    /**
     * 页面相关事件处理函数--监听用户上拉动作
     */
    onReachBottom: function () {
        this.getDatas('NORESET')
    },
})