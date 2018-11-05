const app = getApp();
const util = require('../../../utils/util.js');
import datePicker from '../../../template/date-picker/date-picker.js'
const date = new Date();

Page({
    data: {
        start_time: '',
        start_stemp: '',
        end_time: '',
        end_stemp: '',
        page: 1,
        orderList: [],
        data: []
    },

    onLoad: function (options) {
        let that = this, year = date.getFullYear(), month = date.getMonth();
        let days = month == 3 || month == 5 || month == 8 || month == 10 ? util.getDays(2) : month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11 ? util.getDays(1) : year % 4 == 0 && month == 1 ? util.getDays(3) : util.getDays(4);
        console.log(util.getExactDate(0))
        console.log(util.getExactDate(-7))
        that.setData({
            start_time: util.getExactDate(-7),
            end_time: util.getExactDate(0),
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

    },
    onShow: function () {
        let that = this;
        that.getDatas();
    },
    getDatas(isReset) {
        if (isReset != 'NORESET') {
            this.setData({
                page: 1,
                orderList: [],
                allLoad: false,
            })
        }
        let page = this.data.page
        wx.showLoading({
            title: '数据加载中...',
        })
        util.request('/weixin/minapp/Operatingtools/shopOutbounds/getList', 'GET', {
            start_time: this.data.start_stemp,
            end_time: this.data.end_stemp,
            page: this.data.page,
            page_limit: 15
        },res => {
            wx.hideLoading()
            if(res.data.err_code == 200){
                let data = res.data.result.list
                if (!this.data.allLoad) {
                    this.setData({
                        orderList: this.data.orderList.concat(data)
                    })
                }
                if (data.length == 15) {
                    this.setData({
                        page: page + 1
                    })
                } else {
                    this.setData({
                        allLoad: true
                    })
                }
            }else{
                wx.showModal({
                    content: res.data.err_msg,
                })
            }
        },err => {
            wx.hideLoading()
            console.log(err)
        })
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
    toDetail(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/dispatching/pages/distributionDetail/distributionDetail?id=' + id + '&isRecord=' + true,
        })
    },
    onReachBottom: function () {
        this.getDatas('NORESET')
    },
})