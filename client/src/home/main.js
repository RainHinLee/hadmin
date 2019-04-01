
let name ="libai";
let age = "100";

import Vue from "vue";
import Vuex from 'vuex';
import VueRouter from 'vue-router';

import Toasted from 'vue-toasted'; //--https://github.com/shakee93/vue-toasted
import VueLoading from 'vue-loading-template'; //--https://github.com/jkchao/vue-loading
import CreateAPI from 'vue-create-api' // https://github.com/cube-ui/vue-create-api/blob/master/README_zh-CN.md
import Tooltip from 'vue-directive-tooltip';


import App from './App.vue';
import Loading from '../public/loading.vue';
import Dialog from '../public/dialog.vue';
import Calendar from '../public/calendar.vue';
import Layer from '../public/layer.vue';
import Pagination from "../public/pagination.vue";

import util from 'util';
import routes from './routes.js';
import store from './store.js';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Tooltip,{delay: 0});

Vue.use(Toasted,{
	position:'center',
	theme: 'primary',
	singleton:true,
	duration:3000,
	closeOnSwipe:true
});

//---播放器
Vue.use(CreateAPI, {apiPrefix: '$create-'});
Vue.use(VueLoading);

Vue.createAPI(Dialog, true);
Vue.component('fs-loading',Loading);
Vue.component('fs-calendar',Calendar);
Vue.component('fs-layer',Layer);
Vue.component('fs-pagination',Pagination);

//--测试用
// window.user = {
// 	uid: "2115",
// };
Vue.mixin({
	data(){
		return {
			user: window.user,
		}
	},
	methods:{
		$logout(){ //--登出操作
			this.$confirm('Exit the account?',res=>{
				document.location.href = "/user/logout"
			})
		},

		$alert(message,confirmHandler,link){  //---提示组件
			if(typeof confirmHandler=='string'){  //--传入链接
				link = confirmHandler;
				confirmHandler = ()=>{};
			};
			this.$createAlert({
				$props:{type: 'alert',message,confirmHandler,link}
			});
		},

		$confirm(message,confirmHandler,link){
			if(typeof confirmHandler=='string'){  //--传入链接
				link = confirmHandler;
				confirmHandler = ()=>{};
			};
			this.$createAlert({
				$props:{type: 'alert',message,confirmHandler,link}
			});
		},
	}
})

//---load完成后启动应用
window.addEventListener('load',()=>{
	let baseOptions = {
			el: "#app",
			render:function(h){
				return h(App);
			},
      router : new VueRouter({routes,base:'/'}),
      store : new Vuex.Store(store)
	};

	new Vue(Object.assign({},baseOptions));
})
