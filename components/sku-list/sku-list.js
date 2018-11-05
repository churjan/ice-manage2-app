// components/sku-list/sku-list.js
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
			type:Boolean,
			value:false
		},
		isRfid: {
			type: Boolean,
			value: false
		},
        status: {
            type: String,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        showDetail: false,
        animationData: {},
        skuIndex: null,
        test: [1],
		capture_goods: {
			goods_count: '',
			sku_count: '',
			list: []
		}
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //  显示详情
        pullDetail(e) {
            let that = this
            let index = e.currentTarget.dataset.index
            if (index == that.data.skuIndex) {
                that.setData({
                    showDetail: !that.data.showDetail,
                    skuIndex: index
                })
            } else {
                that.setData({
                    showDetail: true,
                    skuIndex: index
                })
            }
        },
        getIndex (e) {
            this.triggerEvent('getIndex', { index: e.detail.index })
        }
    }
})