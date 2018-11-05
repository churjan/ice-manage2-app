
const app = getApp();
// ---------------------api---------------------------
// 消息提示api
const showToast = (msg, icon = 'none', time = 3000) => {
	wx.showToast({
		title: msg,
		icon: icon,
		duration: time,
		mask: true
	})
}
const setNavTitle = (title) => {
	wx.setNavigationBarTitle({
		title: title
	})
}
//  警报推送
const warn = (type, formId) => {
    request('/image_box/push_notify', 'POST', {
        shop_id: app.globalData.iceInfo.shop_id,
        type: type,
        form_id: formId,
        openid: app.globalData.openId
    }, res => {
        if (res.data.err_code == 200) {
            console.log(
                'shop_id: ' + app.globalData.iceInfo.shop_id + '\n'
                + 'type: ' + type + '\n'
                + 'form_id: ' + formId + '\n'
                + 'openid: ' + app.globalData.openId
            )
        } else {
            console.log(
                'shop_id: ' + app.globalData.iceInfo.shop_id + '\n'
                + 'type: ' + type + '\n'
                + 'form_id: ' + formId + '\n'
                + 'openid: ' + app.globalData.openId
            )
            wx.showModal({
                content: res.data.err_msg,
            })
        }
    }, err => {
        console.log(err)
    })
}
// 弹窗api
const showModal = (title, content, successFun, showCancel = true) => {
	wx.showModal({
		title: title,
		content: content,
		showCancel: showCancel,
		success: res => {
			return successFun(res)
		}
	})
}

// 扫码api
const scanCode = (successFun) => {
	wx.scanCode({
		success: res => {
		return successFun(res)
		}
	})
}
// ----------------------------- 业务方法 ----------------------------------
const formatNum = (n) => {
	n = n.toString();
	return n.length == 1 ? '0' + n : n
}
function formatTime(date) {
	var year = date.getFullYear()
	var month = date.getMonth() + 1
	var day = date.getDate()

	var hour = date.getHours()
	var minute = date.getMinutes()
	var second = date.getSeconds()


  	return [year, month, day].map(formatNum).join('/') + ' ' + [hour, minute, second].map(formatNum).join(':')
}
// 请求数据api
const request = (url, method, data, successFun, failFun) => {
	// type, 
	data._tamp = Date.parse(new Date()) / 1000;
	// let sign = '', timestamp = '', session = '';

	// wx.getStorage({
	// 	key: 'headerInfo',
	// 	success: res => {
	// 		console.log('获取',res)
	// 		if (res.data) {
	// 			sign = res.data.sign;
	// 			timestamp = res.data.time;
	// 			session = res.data.session;
	// 		}
	// 	}
	// })
	let nowUrl = app.globalData.apiUrl;
	wx.request({
		url: nowUrl + url,
		method: method,
		header: {
			'content-type': method === 'GET' ? 'application/json' : method === 'POST' ? 'application/x-www-form-urlencoded' : '',
			'LC-Appkey' : '723949279',
			'LC-Session': app.globalData.session_id,
			'LC-Timestamp': app.globalData.time,
			'LC-Sign': app.globalData.sign
		},
		data: data,
		success: res => {
			if(res.data.ret == 303){
				wx.showModal({
					title: '提示',
					content: '账号状态已改变，请重新登录',
					showCancel: false,
					success: res => {
						wx.reLaunch({
							url: '/pages/login/login' 
						})
					}
				})
			}
			return successFun(res)
		},
		fail: err => {
			return failFun(err)
		}
	})
}
// 跳转路由api
const navTo = (path) => {
	wx.navigateTo({
		url: '/pages/' + path
	})
}

// 跳转路由api
const redTo = (path) => {
	wx.redirectTo({
		url: '/pages/' + path,
	})
}
// 加载中api
const showLoading = (msg = '数据加载中...', boo = true) => {
	wx.showLoading({
		title: msg,
		mask: boo
	})
}
//
const getTimeStamp = (time, type) => {
	time = time.split('-');
	let year = time[0], month = time[1], day = time[2];
	let date = type === 'start' ? new Date(year + '/' + month + '/' + day + ' 00:00:00') : new Date(year + '/' + month + '/' + day + ' 23:59:59');
	return Math.floor(date.getTime() / 1000)
}
/**
     * 时间戳转换
     */
function getTime(config) {

	let { dateJoin = '-' } = config;        // 默认日期连接符：-
	let { timeJoin = ':' } = config;        // 默认时间连接符：:
	let { timeType = 'minutes' } = config;      // 默认精确到分钟（minutes：精确到分钟；seconds：精确到秒）
	let { dataType = 'all' } = config;          // 默认类型为日期+时间（all：日期+时间；date：日期；time：时间）

	if (config.data) {
		let d = new Date(parseInt(config.data) * 1000);
		let date = d.getFullYear() + dateJoin + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1)) + dateJoin + (d.getDate() < 10 ? '0' + d.getDate() : d.getDate());
		let time;

		// 获取时间（精确到秒）
		if (timeType == 'seconds') {
			time = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + timeJoin + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) + timeJoin + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
		} else {
			time = (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + timeJoin + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes());
		}

		// 返回日期+时间
		if (dataType === 'all') {
			return date + ' ' + time;
			// 返回日期
		} else if (dataType === 'date') {
			return date;
			// 返回时间
		} else if (dataType === 'time') {
			return time;
		}
	} else {
		return '';
	}
}

/**
 * 日期控件
 */
const getYears = () => {
	let date = new Date(), years = [];
	for (let i = 1990; i <= date.getFullYear(); i++) {
		years.push(i)
	}
	return years
}
const getMonths = () => {
	let months = [];
	for (let i = 1; i <= 12; i++) {
		months.push(i)
	}
	return months
}
const getDays = (n) => {
	let days = [], length = n === 1 ? 31 : n === 2 ? 30 : n === 3 ? 29 : n === 4 ? 28 : '';
	for (let i = 1; i <= length; i++) {
		days.push(i)
	}
	return days
}
const getExactDate =(day) =>{
	var today = new Date();

	var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

	today.setTime(targetday_milliseconds); //注意，这行是关键代码

	var tYear = today.getFullYear();
	var tMonth = today.getMonth();
	var tDate = today.getDate();
	tMonth = doHandleMonth(tMonth + 1);
	tDate = doHandleMonth(tDate);
	return tYear + "-" + tMonth + "-" + tDate;
}
const doHandleMonth = (month) =>{
	var m = month;
	if (month.toString().length == 1) {
		m = "0" + month;
	}
	return m;
}

module.exports = {
	formatTime: formatTime,
	getTime: getTime,
	request: request,
	showLoading: showLoading,
	navTo: navTo,
	setNavTitle: setNavTitle,
	redTo: redTo,
	showToast: showToast,
	showModal: showModal,
	scanCode: scanCode,
	formatNum: formatNum,
	getTimeStamp: getTimeStamp,
	getYears: getYears,
	getMonths: getMonths,
	getDays: getDays,
	getExactDate: getExactDate,
	doHandleMonth: doHandleMonth,
    warn: warn
}