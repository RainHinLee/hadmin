/*--存放请求相关接口，使用axios库，https://github.com/axios/axios--*/

import axios from 'axios';
axios.defaults.baseURL = '_api';
// console.log('axios default baseURL',axios.defaults.baseURL);
const api = {
	get(url){  //--get请求,将params中的
		return axios.get(url).then(res=>res.data)
	},
	post(url,params={}){
		return axios.post(url,params).then(res=>res.data)
	}
}

export default api;
