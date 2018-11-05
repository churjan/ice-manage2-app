import util from '../../utils/util.js'

const pickerChange = (val) => {
	let pages = getCurrentPages(), curPage = pages[pages.length - 1], years = util.getYears(), months = util.getMonths();
	let days = val[1] == 3 || val[1] == 5 || val[1] == 8 || val[1] == 10 ? util.getDays(2) : val[1] == 0 || val[1] == 2 || val[1] == 4 || val[1] == 6 || val[1] == 7 || val[1] == 9 || val[1] == 11 ? util.getDays(1) : (val[0] + 2) % 4 == 0 && val[1] == 1 ? util.getDays(3) : util.getDays(4);
	curPage.setData({
		'pickerView.days': days,
		'pickerView.year': years[val[0]],
		'pickerView.month': months[val[1]],
		'pickerView.day': days[val[2]]
	})
}

const hidePicker = (map) => {
	if (map === 'mode_wrap' || map === 'it') {
		let pages = getCurrentPages(), curPage = pages[pages.length - 1];
		curPage.setData({
			'pickerView.picker': false
		})
	}
}

const userPicker = () => {
	let pages = getCurrentPages(), curPage = pages[pages.length - 1];
	let end_time = curPage.data.pickerView.year + '-' + util.formatNum(curPage.data.pickerView.month) + '-' + util.formatNum(curPage.data.pickerView.day), end_stemp = util.getTimeStamp(end_time);
	if (end_stemp < curPage.data.start_stemp) {
		util.showToast('结束日期必须大于开始日期,请重新选择。');
		return
	}
	console.log(pages,curPage)
	curPage.setData({
		'pickerView.pickerValue': [curPage.data.pickerView.year - 1990, curPage.data.pickerView.month - 1, curPage.data.pickerView.day - 1],
		'pickerView.picker': false,
		page:1,
		end_time: end_time,
		end_stemp: end_stemp,
	})
	curPage.getDatas();
}

module.exports = {
	pickerChange: pickerChange,
	hidePicker: hidePicker,
	userPicker: userPicker
}