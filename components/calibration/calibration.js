// components/calibration/calibration.js
const app = getApp()
import util from '../../utils/util.js'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        showFloat: {
            type: Boolean,
            value: false
        },
        data: {
            type: Object,
            value: {}
        },
        isShow: {
            type: Boolean,
            value: false
        },
        goodIndex: {
            type: Number,
            value: 0
        },
        diff: {
            type: Object,
            value: null
        },
        sourceData: {
            type: Object,
            value: null
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isSelecting: false,
        showSkuList: false,
        iceSkuList: [],
        clickIndex: 0,
        selectInfo: null,
        selectCode: null,
        hasChange: false
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //  图片预览
        previewImage(e) {
            let that = this
            let current = e.currentTarget.dataset.url
            wx.previewImage({
                current: current,
                urls: [current]
            })
        },
        //  隐藏组件
        hideFolat() {
            this.setData({
                isShow: false,
                clickIndex: 0
            })
            this.triggerEvent('hiddenCalibrate', {
                singleType: true
            })
        },
        //  显示sku列表选择
        showSelect() {
            let clickIndex = this.data.clickIndex
            let skuName = this.data.data.list[this.data.goodIndex].sku_list[clickIndex].g_sku_name
            let skuCode = this.data.data.list[this.data.goodIndex].sku_list[clickIndex].barcode
            this.setData({
                isSelecting: true,
                selectInfo: {
                    barcode: skuCode,
                    g_sku_name: skuName
                },
                selectCode: skuCode
            })
            util.request('/image_box/sku_list', 'GET', {
                shop_id: app.globalData.iceInfo.shop_id
            }, res => {
                this.setData({
                    iceSkuList: res.data.result.list
                })
            }, fail => {

            })
        },
        //  校准确认
        confirm() {
            this.setData({
                isShow: false
            })
            if (this.data.hasChange){
                let modify = {
                    floorData: this.data.data,
                    isShowCalibrat: false,
                    diff_goods: this.data.diff
                }
                this.triggerEvent('hiddenCalibrate', modify)
            }else{
                this.triggerEvent('hiddenCalibrate', {
                    singleType: true
                })
            }
        },
        //  选择sku确认
        skuConfirm() {
            let clickIndex = this.data.clickIndex
            let data = this.data.data
            //  最初始数据
            let sourceBarcode = this.data.sourceData.list[this.data.goodIndex].sku_list[this.data.clickIndex].barcode
            let map = false
            //  差异
            let diff = this.data.diff
            //  原有的
            let skuInfo = data.list[this.data.goodIndex].sku_list[clickIndex]
            this.setData({
                preSkuInfo: JSON.parse(JSON.stringify(skuInfo))
            })
            //  选择更改的
            let selectCode = this.data.selectInfo.barcode
            let selectName = this.data.selectInfo.g_sku_name
            let list = data.list[this.data.goodIndex].list
            //  有修改商品
            if (skuInfo.barcode !== selectCode){
                this.changeArr(list, skuInfo.barcode, selectCode, 'floor')
                this.changeArr(diff.list, skuInfo.barcode, selectCode, 'diff')
                skuInfo.barcode = selectCode
                skuInfo.g_sku_name = selectName
                if (selectCode != sourceBarcode){
                    skuInfo.isChange = true
                }else{
                    skuInfo.isChange = false
                }
                this.setData({
                    hasChange: true
                })
            }else{
                wx.showModal({
                    title: '提示',
                    content: '校准商品相同，请重新选择',
                    showCancel: false
                })
            }
            this.setData({
                isSelecting: false,
                data: data,
                diff: diff
            })
        },
        //  A, B, C匹配更换
        /**
         * A 遍历数组
         * B 原数据
         * C 修改数据
         */
        changeArr (A, B, C, type) {
            let map = false
            let deleteIndex,
                diffMap
            A.forEach((item, index) => {
                if (item.barcode == B) {
                    item.count--
                    diffMap = true
                }
                //  匹配到更改sku是原来有的
                if (item.barcode == C) {
                    item.count = item.count + 1
                    map = true
                }
                if(item.count == 0){
                    deleteIndex = index
                }
            })
            
            if (deleteIndex || deleteIndex == 0) A.splice(deleteIndex, 1)
            //  匹配到更改后sku是原本没有的
            if (!map && C != 9999999999999) {
                A.push(Object.assign({},this.data.selectInfo, {
                    count: 1
                }))
            }
            if (type === 'diff') {
                let skuInfo = this.data.preSkuInfo
                let countArr = []
                // 匹配到更改前sku是原本没有的/只有差异需要负值
                if (!diffMap && B != 9999999999999) {
                    A.push(Object.assign({}, skuInfo, {
                        count: -1,
                    }))
                }
				A.forEach( item =>{
					countArr.push(item.count);
				})
				let countTotal = countArr.reduce(function (total, currentValue, currentIndex, arr){
					return total + Math.abs(currentValue)
				},0)
                this.setData({
					'diff.count': countTotal
                })
            }
            // 背景处理
            if (type === 'floor') {
                let data = this.data.data
                let skuSet = new Set()
                if (B == 9999999999999){
                    data.list[this.data.goodIndex].goods_count++
                }
                if(C == 9999999999999){
                    data.list[this.data.goodIndex].goods_count--
                }
                data.list[this.data.goodIndex].sku_count = A.length
                
                data.list.forEach(floor => {
                    floor.list.forEach(item => {
                        skuSet.add(item.barcode)
                    })
                })
                data.sku_count = [...skuSet].length
                this.setData({
                    data: data
                })
            }
        },
        //  图片旋转
        turnImage(e) {
            let focus = e.target.dataset.focus
            if (focus) {
                this.setData({
                    showSkuList: !this.data.showSkuList
                })
            }
        },
        //  获取当前框索引
        currentIndex (e) {
            let index = e.target.dataset.index
            if(index || index == 0){
                this.setData({
                    clickIndex: index
                })
            }
        },
        //  选择校准的商品
        selectSku (e) {
            let info = e.target.dataset.info
            this.setData({
                selectInfo: info,
                showSkuList: false,
                selectCode: info.barcode
            })
        },
        //  隐藏
        hiddenComponent (e) {
            let id = e.target.id
            if(id === 'CAB'){
                this.triggerEvent('hiddenCalibrate', {
                    singleType: true
                })
            }
        }
    }
})