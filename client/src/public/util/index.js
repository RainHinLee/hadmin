
import moment from 'moment';
import handlers from './handlers/index.js';

const util = {
	handlers,
	//生成日历时间数组，year,month,
	calendar(year, month) {
		year = year || new Date();
		let date = (moment.isDate(year) || moment.isMoment(year)) ? moment(year) : moment(`${year}-${month}`, 'YYYY-MM');
		let current = format(date);
		let prev = format(moment(current).subtract(1, 'month'));
		let next = format(moment(current).add(1, 'month'))
		let arr = []; //---数组
		let res = [];

		//--上个月时间
		let prevLen = current.firstWeek == 0 ? 6 : (current.firstWeek - 1);
		let i = 0;
		for (i = prevLen - 1; i >= 0; i--) {
			arr.push("");
		}
		//--当前月
		for (i = 1; i <= current.days; i++) {
			arr.push(i >= 10 ? `${date.format('YYYY-MM')}-${i}` : `${date.format('YYYY-MM')}-0${i}`);
		}
		//---下个月
		let nextLen = current.lastWeek == 0 ? 0 : (7 - current.lastWeek);
		for (i = 0; i < nextLen; i++) {
			arr.push("");
		};

		while (arr.length) {res.push(arr.splice(0, 7));};
		return res;

		function format(date1) {
			let days = date1.daysInMonth();
			return {
				days,
				day: date1.get('date'),
				week: date1.get('weekday'),
				lastWeek: date1.set('date', days).get('weekday'),
				firstWeek: date1.set('date', '01').get('weekday')
			};
		}
	},

	etime(stime,len){  //--计算结束时间，stime : 09:30 len:45分钟，计算出10:15；
		return moment(stime,'HH:mm').add(len,'m').format('HH:mm');
	},

	btime(stime,len){  //--计算时间
		return moment(stime,'HH:mm').subtract(len,'m').format('HH:mm');
	},

	hours(start,end,len){ //--计算时间点，start: 08:00,end:22:00,len：30,[08:00,08:30,09:00...,22:00]
		let result = [];
		let sdate = moment(start,'HH:mm');
		let edate = moment(end,'HH:mm');

		result.push(sdate.format('HH:mm'));

		while(edate.diff(sdate)>len*60*1000){
			sdate= moment(start,'HH:mm').add(len,'m');
			result.push(sdate.format('HH:mm'));
			start = sdate.format('HH:mm');
		};
		return result
	},

	getTimeKeys(){  //---获取时间
		let weekday = moment().day();  //--本周星期
		let startWeek = weekday==0 ? '6' : weekday-1;
		let endWeek = weekday == 0 ? '0' : 7-weekday;
		let days =  moment().daysInMonth();

		return {
			'day':{
				'sdate' : moment().format('YYYY-MM-DD'),
				'edate' : moment().format('YYYY-MM-DD'),
				'zh_title' : '当天',
				'en_title' : "today"
			},
			'week':{
				'sdate' : moment().subtract(startWeek,'days').format('YYYY-MM-DD'),
				'edate' : moment().add(endWeek,'days').format('YYYY-MM-DD'),
				'zh_title' : '本周',
				'en_title' : "current week"
			},
			'month':{
				'sdate' : moment().format('YYYY-MM')+"-01",
				'edate' : moment().format('YYYY-MM')+"-"+days,
				'zh_title' : '本月',
				'en_title' : 'current month'

			}
		}
	},
	suffix(num){  //--给小于10的数字添加0前缀
		if(num>=0){
			return num<10 ? `0${Number(num)}` : num
		}else{
			return num>-10 ? `-0${Math.abs(Number(num))}` : num
		}
	},

	countdown(time){  //--倒计时,time : 2018-03-27 09:34:30
		let now = moment();
		let target = moment(time,'YYYY-MM-DD HH:mm:ss');

		let day = target.diff(now,'days');
		let hour = target.diff(now,'hour')-day*24; //---小时数
		let minute = target.diff(now,'minute') - target.diff(now,'hour')*60;
		let second = target.diff(now,'second') - target.diff(now,'minute')*60;
		return {
			day: this.suffix(Math.abs(day)),
			hour: this.suffix(Math.abs(hour)),
			minute: this.suffix(Math.abs(minute)),
			second: this.suffix(Math.abs(second)),
			diff: target.diff(now,'second')
		}
	},

	clone(data){  //--克隆object数据
		let target = JSON.stringify(data);  //---存在函数无法复制的问题
		return JSON.parse(target);
	},

  random(min, max){ //--随机数
    return Math.random() * ( max - min ) + min;
	},

	url:{
		stringify(params){
			let paths = Object.keys(params).map(key=>`${key}/${params[key]}`);
			return paths.join("/")
		}
	},

}

export default util
