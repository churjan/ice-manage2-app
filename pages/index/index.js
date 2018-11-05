//index.js
var app = getApp()
import util from '../../utils/util.js';
let canClaimGoods = true,
    canShowClaim = true;
Page({
    data: {
        isSearch: false, //  是否点击选择冰箱
        isSelect: false, //是否选择记录
        showTeam: false, //团队
        showGet: 'noshow',
        real_name: '',
        returnData: null,
        isSender: false,
        navTop: [
			{
				url: '/pages/allIce/allIce',
				ico: '/pic/to_ice.png',
				name: '设备管理',
				menu_id: 230,
				checked: false,
			},
			{
                url: '/pages/inventory/inventory',
                ico: '/pic/index_ico_01.png',
                name: '盘点补货',
                menu_id: 231,
                checked: false,
            },
            {
                url: '/pages/claimGoods/claimGoods',
                ico: '/pic/claim_goods.png ',
                name: '取货',
                menu_id: 241,
                checked: false,
            },
            {
                url: '/pages/goodsReturn/goodsReturn',
                ico: '/pic/index_ico_05.png',
                name: '退货单',
                menu_id: 242,
                checked: false,
            },
            {
                url: '/dispatching/pages/distributionList/distributionList',
                ico: '/pic/index_ico_06.png',
                name: '设备配送',
                menu_id: 243,
                checked: false,
            },
            {
                url: '/dispatching/pages/takeDIstributionList/takeDIstributionList',
                ico: '/pic/index_ico_07.png',
                name: '领取设备',
                menu_id: 244,
                checked: false,
            },
            // {
            // 	url: '',
            // 	ico: '/pic/index_ico_05.png',
            // 	name: '报损单',
            // 	menu_id: 244,
            // 	checked: false,
            // },
        ],
        navShop: [{
                path: '/pages/replenishmentRecord/replenishmentRecord',
                count: '0',
                text: '今日补货',
                type: 'today'
            },
            {
                path: '/pages/replenishmentRecord/replenishmentRecord',
                count: '0',
                text: '今月补货',
                type: 'month'
            },
            {
                path: '/pages/personShop/personShop',
                count: '0',
                text: '名下货物',
                type: 'all'
            },
            {
                path: '/dispatching/pages/await/await',
                count: '0',
                text: '待配送设备',
                type: 'await'
            },
        ],
        searchList: [],
        iceInfo: {

        },
        memberList: [],
        isCaptain: 1,
    },
    onLoad: function(options) {
        let that = this,
            _data = this.data;
        // 获取权限
        util.request('/easygo/authority/authority_user_visi_menu', 'GET', {}, result => {
            let power = result.data.data.menu_list;
            wx.setStorage({
                key: 'power',
                data: power
            })
            let topNav = power.top,
                navTop = _data.navTop;
            navTop.forEach(item => {
                topNav.forEach(val => {
                    if (item.menu_id == val.menu_id) {
                        item.checked = val.checked;
                    }
                })
            })
            that.setData({
                navTop: navTop
            })
            // console.log(power, _data.navTop)
        })
        that.setData({
            real_name: app.globalData.real_name
        })
    },
    onShow: function(e) {
        let that = this;
        if (app.globalData.iceInfo.shop_name) {
            that.setData({
                iceInfo: app.globalData.iceInfo
            })
            that.checkIceType();
        }
        this.getIceList();
        this.getUserForTeam();
        this.getReturnInfo()
    },
    //  导航
    navigatorUrl(e) {
        let that = this,
            url = e.currentTarget.dataset.url,
            iceInfo = app.globalData.iceInfo,
            name = e.currentTarget.dataset.name;
        that.setData({
            isSearch: false,
            isSelect: false,
        })
        if (url && iceInfo && iceInfo.shop_name) {
            let shop_sn = iceInfo.shop_sn
            //哈哈冰箱
            if (String(shop_sn).indexOf('HH') > -1) {
                util.showLoading('开门中，请稍等...')
                util.request('/image_box/haha_replenish', 'POST', {
                    shop_sn: app.globalData.iceInfo.shop_sn
                }, res => {
                    if (res.data.err_code == 200) {
                        wx.navigateTo({
                            url: '/pages/doorIsOpen/doorIsOpen',
                        })

                    } else {

                    }
                }, err => {
                    wx.hideLoading();
                })

            } else {
                wx.navigateTo({
                    url: url,
                })
            }
        } else {
            if (url && name == '盘点补货') {
                wx.showModal({
                    title: '',
                    showCancel: false,
                    content: '请选择冰箱',
                })
            } else {
                if (name == '取货' && !canClaimGoods) {
                    util.showToast('队员无法领取出库单');
                } else {
                    wx.navigateTo({
                        url: url,
                    })
                }

            }

        }
    },
    //  获取个人补货信息
    getReturnInfo() {
        util.request('/weixin/minapp/delivery/wxMiniIndex', 'GET', {

        }, res => {
            if (res.data.err_code == 200){
                let result = res.data.result
                let data = this.data.navShop
                data[0].count = result.day_goods_entry_record
                data[1].count = result.mouth_goods_entry_record
                data[2].count = result.goods_count > 0 ? result.goods_count : 0
                data[3].count = result.await_send_shop_count
                this.setData({
                    navShop: data,
                    isSender: true
                })
            }
        }, err => {
            console.log(err)
        })
    },
    //查看记录
    toRecord() {
        let that = this
        that.setData({
            isSelect: !that.data.isSelect
        })
    },
    //  取货/补货记录
    goodsRecord() {
        let that = this;
        wx.navigateTo({
            url: '/pages/pickupRecord/pickupRecord',
        })
        that.setData({
            isSelect: false
        })
    },
    //获取冰箱列表
    getIceList() {
        let that = this,
            _data = this.data;
        util.request('/easygo_minapp/minapp/image_box_list', 'GET', {
            shop_sn: app.globalData.iceInfo.shop_sn ? app.globalData.iceInfo.shop_sn : ''
        }, res => {
            if (res.data.err_code == 200) {
                let list = res.data.result.shop_list;
                that.setData({
                    searchList: list
                })
            }
        }, err => {
            console.log(err)
        })
    },
    //  切换冰箱
    toRefrigerator(e) {
        let that = this
        that.setData({
            isSearch: !that.data.isSearch,
            isSelect: false
        })
    },
    //  隐藏搜索
    hideSearch() {
        let that = this,
            _data = this.data;
        if (that.data.isSearch) {
            that.setData({
                isSearch: !that.data.isSearch
            })
        }
    },
    //  选择冰箱
    selectIce(e) {
        let that = this;
        that.setData({
            isSearch: false
        })
        if (e.currentTarget.dataset.shopname) {
            let iceId = e.currentTarget.dataset.iceid,
                shopName = e.currentTarget.dataset.shopname,
                shoptype = e.currentTarget.dataset.shoptype,
                shopId = e.currentTarget.dataset.shopid
            app.globalData.iceInfo = {
                shop_sn: iceId,
                shop_name: shopName,
                shop_type: shoptype,
                shop_id: shopId
            }
            that.setData({
                iceInfo: app.globalData.iceInfo
            })
            that.checkIceType();
        } else {
            //  全部冰箱
            wx.navigateTo({
                url: '/pages/allIce/allIce'
            })
        }
    },
    //是否哈哈冰箱
    checkIceType() {
        let that = this,
            _data = this.data,
            shop_sn = app.globalData.iceInfo.shop_sn;
        if (String(shop_sn).indexOf('HH') > -1) {
            that.setData({
                navList: {
                    navTop: [{
                            url: '/pages/replenishment/replenishment',
                            ico: '/pic/index_ico_01.png',
                            name: '补货'
                        }, {
                            url: '',
                            ico: '',
                            name: ''
                        },
                        {
                            url: '/pages/claimGoods/claimGoods',
                            ico: '/pic/claim_goods.png ',
                            name: '取货'
                        }
                    ]
                }
            })
        } else {
            that.setData({
                navList: {
                    navTop: [{
                            url: '/pages/replenishment/replenishment',
                            ico: '/pic/index_ico_01.png',
                            name: '补货'
                        }, {
                            url: '/pages/inventory/inventory',
                            ico: '/pic/index_ico_02.png',
                            name: '盘点'
                        },
                        {
                            url: '',
                            ico: ' ',
                            name: ' '
                        }
                    ]
                }
            })
        }
    },
    //用户是否有团队信息
    getUserForTeam() {
        let that = this;
        util.request('/weixin/minapp/delivery/userinfo', 'GET', {

		},res =>{
            if(res.err_code == 200){
                app.globalData.deliveryUserInfo = res.data.result;
                //是否配送员1否2是
                if (res.data.result.is_delivery == 1 || res.data.result.delivery_team_id == 0){
                    canClaimGoods = true;
                    canShowClaim = false;
                } else if (res.data.result.is_delivery == 2 && res.data.result.is_captain == 2){
                    canClaimGoods = true;
                    canShowClaim = true;
                    that.setData({
                        showGet:'toGet'
                    })
                } else if (res.data.result.is_delivery == 2 && res.data.result.is_captain == 1 && res.data.result.delivery_team_id != 0){
                    canClaimGoods = false;
                    canShowClaim = true;
                }
                if (res.data.result.is_delivery == 2){
                    that.setData({
                        isCaptain: app.globalData.deliveryUserInfo.is_captain
                    })
                }
            }
		}, err =>{
			console.log('er',err)
		})
	},
	//显示团队弹窗
	toShowTeam(){
		let that = this;
		that.setData({
			isSelect: false,
			isSearch:false
		})
		that.getUserForTeam();
		if (canShowClaim){
			that.getMemberList();
			that.setData({
				showTeam: true
			})
		}else{
			util.showToast('您目前不在团队中');
			that.setData({
				showTeam: false
			})
		}
		
	},
	//关闭团队弹窗
	hideTeamFloat(){
		let that = this;
		that.setData({
			showTeam:false
		})
	},
	//获取成员列表
	getMemberList() {
		let that = this;
		util.request('/weixin/minapp/delivery/memberlistByUserId', 'GET', {
			_sort:'-is_captain'
			// delivery_team_id: app.globalData.deliveryUserInfo.delivery_team_id
		}, res => {
			that.setData({
				memberList:res.data.result
			})
		}, err => {
			console.log('获取失败', err)
		})
	},
	addMember(e){
		let that = this,ids=e.detail.id,names=e.detail.name;
		util.request('/weixin/minapp/delivery/addMember', 'POST', {
			delivery_user_ids: ids,
			delivery_user_names: names,
		}, res =>{
			if(res.data.err_code == 200){
				that.getMemberList();
			}else{
				util.showToast(res.data.err_msg ? res.data.err_msg:'添加失败')
			}

        }, err => {
            console.log('err', err)
        })
    },
    //删除成员
    deleteMember(e) {
        console.log(e)
        let that = this,
            ids = e.detail.id,
            names = e.detail.name;
        util.showModal('确认删除', '是否要删除队员：' + names, res => {
            if (res.confirm) {
                util.request('/weixin/minapp/delivery/deleteMember', 'POST', {
                    delivery_ids: ids
                }, res => {
                    that.getMemberList();
                }, err => {
                    console.log(err)
                })
            }
        }, true, '取消', '确定')
    },
    // 导航
    navigatoRecord(e) {
        let path = e.currentTarget.dataset.url
        let count = e.currentTarget.dataset.count
        let type = e.currentTarget.dataset.type
        wx.navigateTo({
            url: path + '?type=' + type + '&count=' + count
        })
        this.setData({
            isSelect: false
        })
    },
    //  补货记录
    replenRecord() {
        wx.navigateTo({
            url: '/pages/replenishmentRecord/replenishmentRecord'
        })
        this.setData({
            isSelect: false
        })
    },
    //  配送单记录
    distributionRecord() {
        wx.navigateTo({
            url: '/dispatching/pages/distributionRecord/distributionRecord',
        })
        this.setData({
            isSelect: false
        })
    }
})