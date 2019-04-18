
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
import User_Search from "../public/user_search.vue";

import util from 'util';
import routes from './routes.js';
import store from './store.js';
import config from './config.js';

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
Vue.component('fs-user-search', User_Search);

let user_right = Object.keys(config.right).find(key=>config.right[key].includes(window.user.username)) || "teacher"
window.user._right = user_right;
window.user._links = config.links[user_right];

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
	let _router = new VueRouter({routes,base:'/'});
	let _store = new Vuex.Store(store)
	let baseOptions = {
			el: "#app",
			render:function(h){
				return h(App);
			},
      router : _router,
      store : _store
	};

	//--路由全局守卫
	_router.beforeEach((to, from, next) => {
		let isok = window.user._links.some(item=>to.path.includes(item.path));  //--去的路径包含用户链接
		isok ? next(true) : next(false);
	})


	new Vue(Object.assign({},baseOptions));
})
