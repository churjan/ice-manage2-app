// components/sku-differ/sku-differ.js
Component({
	/**
	 * 组件的属性列表
	 */
    properties: {
        data: {
            type: Object,
            value: {},
        },
        isReplenishment: {
            type: Boolean,
            value: false
        },
        isRfid: {
            type: Boolean,
            value: false
        },
        isReady: {
            type: Boolean,
            value: false
        },
    },

	/**
	 * 组件的初始数据
	 */
    data: {
        diff_goods: {
            count: '',
            list: []
        }
    },

	/**
	 * 组件的方法列表
	 */
    methods: {

    }
})
