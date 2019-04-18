/* 配置代理路径映射

 */

const config = require('./routes/config.js');
const PREFIX_WP = "cmsapi";
const PREFIX_API = "api2";

module.exports = {
	"/admin":{ //--我的时间列表
		prefix : PREFIX_API
	},
	"/basic":{ //--我的时间删除
		prefix: PREFIX_API
	},
	"/timetable":{
		prefix: PREFIX_API
	},
	"/wp":{
		prefix: PREFIX_WP
	},
	"/user/list":{
		prefix: PREFIX_API
	},
	"/user/passwd_reset":{
		prefix: PREFIX_API
	},
}
