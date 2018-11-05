// components.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        data: {
			type: Object,
            value: {}
        },
        index: {
            type: Boolean,
            value: false
        },
		isRfid: {
			type: Boolean,
			value: false
		},
        dataIndex: {
            type: Number,
            value: 0
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
        animationData: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //  图片预览
        previewImage(e) {
            let that = this
            let current = e.currentTarget.dataset.url
            console.log(e)
            wx.previewImage({
                current: current,
                urls: [current]
            })
        },
        //  动画
        startAnimate() {
            var animation = wx.createAnimation({
                duration: 1000,
                timingFunction: 'ease',
            })
            this.animation = animation
            animation.translateY('300rpx').step()
            this.setData({
                animationData: animation.export()
            })
        },
        //  进入手动校准
        getIndex () {
            this.triggerEvent('getIndex', { index: this.data.dataIndex })
        }
    }
})
