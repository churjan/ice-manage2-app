const app = getApp()
import util from '../../utils/util.js'
Component({
    /**
     * 组件的属性列表
     */
	properties: {
		data: {
			type: Array,
			value: [],
		},
		showOrderList: {
			type: Boolean,
			value: false,
		},
	},

    /**
     * 组件的初始数据
     */
	data: {
	},

    /**
     * 组件的方法列表
     */
	methods: {
		toDetail(e) {
			console.log(e)
			let that = this, sn = e.currentTarget.dataset.sn, index = e.currentTarget.dataset.index;
			wx.navigateTo({
				url: '/pages/orderDetail/orderDetail?sn='+sn,
			})
		},
		
	}
})