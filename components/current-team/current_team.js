const app = getApp()
import util from '../../utils/util.js'

Component({
   
	properties: {
		isCaptain:{
			type:String,
			value: '1'
		},
		data: {
			type: Object,
			value: {},
		},
		memberList:{
			type:Array,
			value:[]
		},
		showTeam: {
			type: Boolean,
			value: false,
		},
		curTap:{
			type:String,
			value:''
		}
		
	},

	data: {
		searchResult:[],
		searchMember:false
	},
	
	methods: {
		toSearchMember(e){
			console.log(e)
			let that = this,searchKey = e.detail.value;
			util.request('/weixin/minapp/delivery/getSearchMember','GET',{
				keyword: searchKey
			}, res =>{
				that.setData({
					searchResult:res.data.result
				})
			}, err =>{
				console.log(err)
			})
			if (searchKey){
				that.setData({
					searchMember:true
				})
			}else{
				that.setData({
					searchMember: false
				})
			}
		},
		toGetTask(){
			let that = this;
			if (that.data.curTap == 'toGet'){
				wx.navigateTo({
					url: '/pages/claimGoods/claimGoods',
				})
				setTimeout( () =>{
					that.setData({
						showTeam: false
					})
					this.triggerEvent('hideTeamFloat', {
						showTeam: false
					})
				},500)
				
			}else{
				
			}
		},
		//关闭弹窗
		hideTeamFloat(){
			let that = this;
			that.setData({
				showTeam:false
			})
			this.triggerEvent('hideTeamFloat', {
				showTeam: false
			})
		},
		addMember(e){
			let that = this, id = e.currentTarget.dataset.id, name = e.currentTarget.dataset.name;
			console.log(e)
			//首页弹窗
			that.setData({
				searchMember:false
			})
			this.triggerEvent('addMember', {
				id:id,
				name:name
			})
			
		},
		deleteMember(e){
			let that = this, id = e.currentTarget.dataset.delid, name = e.currentTarget.dataset.name;
			
			this.triggerEvent('deleteMember', {
				id: id,
				name: name
				
			})
		}
	}
})