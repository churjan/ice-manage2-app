const app = getApp()
import util from '../../utils/util.js'
Component({
	properties: {
		data: {
			type: Object,
			value: {},
		},
		showOrderDetail: {
			type: Boolean,
			value: false,
		},
		state:{
			type:String,
			value:'1'
		},

	},
	data: {
		menberList:[],
		showTeam:false,
		isCaptain:''
	},
	methods: {
		toGet(){
			let that = this;

		},
		//领取弹窗
		getTask(e){
			let that = this;
			util.showModal('领取出库单', '当前单号：' + that.data.data.detail.order_num, res =>{
				if(res.confirm){
					that.getOrder()
				}else{

				}
			},true,'取消','确认')
			
		},
		//领取单
		getOrder(){
			let that = this,data = this.data.data,url;
			console.log(data)
			//队长
			if (app.globalData.deliveryUserInfo && app.globalData.deliveryUserInfo.is_captain == 2){
				url = '/weixin/minapp/delivery/goodsOrder';
				that.setData({
					isCaptain: 2
				})
			}else{
				url = '/weixin/minapp/delivery/goodsOrder/Team';
			}
			util.request(url,'POST',{
				g_e_id:data.detail.g_e_id
			}, res =>{
				console.log('领取成功',res)
				if(res.data.err_code == 200){
					util.showToast('领取成功')
					if (app.globalData.deliveryUserInfo && app.globalData.deliveryUserInfo.is_captain == 2) {
						
					} else {
						that.getUserForTeam();
					}
					that.showCurrentTeam()
				}else{
					util.showToast(res.data.err_msg ? res.data.err_msg:'领取失败')
				}
			}, err=>{
				console.log('lqsb',err)
			})
		},
		//完成补货
		toFinish(e) {
			let that = this;
			console.log(e);
			console.log(that.data)
			util.showModal('确认补货完成', '当前单号：' + that.data.data.detail.order_num, res => {
				if (res.confirm) {
					that.confirmFinish()
				} else {

				}
			}, true, '取消', '确认')

		},
		//补货完成
		confirmFinish(){
			let that = this;
			util.request('/weixin/minapp/delivery/goodsOrderComplete','POST',{
				g_e_ids: that.data.data.detail.g_e_id
			}, res =>{
				console.log('确认成功',res)
				if(res.data.err_code == 200){
					util.showToast('确认成功');
					setTimeout( ()=>{
						wx.navigateBack({
							delta: 1
						})
					},1000)
					
				}else{
					util.showToast(res.data.err_msg ? res.data.err_msg : '确认失败')
				}
			}, err =>{
				console.log('完成失败',err)
			})
			
		},
		//用户是否有团队信息
		getUserForTeam() {
			let that = this;
			util.request('/weixin/minapp/delivery/userinfo', 'GET', {

			}, res => {
				app.globalData.deliveryUserInfo = res.data.result;
				that.setData({
					isCaptain: app.globalData.deliveryUserInfo.is_captain
				})
				
			}, err => {
				console.log('er', err)
			})
		},
		//显示团队并添加成员
		showCurrentTeam(){
			let that = this;
			that.getMemberList();
			that.setData({
				showTeam:true
			})
		},
		//关闭团队弹窗
		hideTeamFloat() {
			let that = this;
			that.setData({
				showTeam: false
			})
			wx.navigateBack({
				delta:1
			})
		},
		//获取成员列表
		getMemberList() {
			let that = this;
			util.request('/weixin/minapp/delivery/memberlistByUserId', 'GET', {
				// delivery_team_id: app.globalData.deliveryUserInfo.delivery_team_id
			}, res => {
				console.log('获取成员列表', res)
				that.setData({
					memberList: res.data.result
				})
			}, err => {
				console.log('获取失败', err)
			})
		},
		addMember(e) {
			console.log('aa', e)
			let that = this, id = e.detail.id, name = e.detail.name;
			util.request('/weixin/minapp/delivery/addMember', 'POST', {
				delivery_user_ids: id,
				delivery_user_names: name,
			}, res => {
				console.log(res)
				if (res.data.err_code == 200) {
					that.getMemberList();
				} else {
					util.showToast(res.data.err_msg ? res.data.err_msg : '添加失败')
				}

			}, err => {
				console.log('err', err)
			})
		},
		//删除成员
		deleteMember(e) {
			console.log(e)
			let that = this, id = e.detail.id, name = e.detail.name;
			util.showModal('确认删除', '是否要删除队员：' + name, res => {
				if (res.confirm) {
					util.request('/weixin/minapp/delivery/deleteMember', 'POST', {
						delivery_ids: id
					}, res => {
						console.log(res)
						that.getMemberList();
					}, err => {
						console.log(err)
					})
				}
			}, true, '取消', '确定')

		},
	}
})