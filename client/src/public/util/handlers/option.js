
import api from "api";
import util from "util";

const store = {
  getAllTeachers($store){  //---获取所有老师
    let url = "/wp/posts/post_type/teacher";

    return api.get(url).then(res=>{
      var states = ['不限',"线上",'线下']; //--老师状态
      var ret = res['data'].filter(function(item){
          return states.includes(item['teacher_type']);
      });

      ret.forEach(item=>{
        item['_href'] = `http://123.57.162.196:38080/admin_login/${item.username_en}`
      });
      ret.sort((a,b)=>a.username_en.toLowerCase().localeCompare(b.username_en.toLowerCase()));
      res['data'] = ret;
      if($store && $store.commit){
        $store.commit("update_school_teachers",ret); //--发布到vuex数据中心
      }
      return res;
    })
  },

  getAllStudents($store){  //--获取所有学生
    let url = "/admin/product_user";
    return api.get(url).then(res=>{
      let obj = {};
      let list = res['rows'].filter(item=>item.username.length>=2);
      list.sort((a,b)=>a.username.toLowerCase().localeCompare(b.username.toLowerCase()));

      list.forEach(item=>{
        let name = item.username;
        obj[name] = obj[name] || item;
      });
      res['rows'] = Object.values(obj);

      if($store && $store.commit){
        $store.commit("update_school_students",res['rows']); //--发布到vuex数据中心
      }
      return res;
    })
  },

  findUserByName(username){  //---通过username获取用户信息
    let url = `/user/list/userid/${username}`;
    return api.get(url).then(res=>{
      let user = res.user_list.find(item=>{
        return item.username.trim().toLowerCase()==username.trim().toLowerCase()
      })
      return user;
    })
  },

  findUsersByName(username,requestID){  //---通过username获取用户信息
    let url = `/user/list/userid/${username}`;
    return api.get(url).then(res=>{
      res['requestID'] = requestID;
      return res;
    });
  },
};

export default store;
