
import api from "api";
const MUTATIONS="update_students";
const LEVELS = ['主课老师','1级代课老师','2级代课老师'];

const store = {
  get($store){
    let url = `/admin/teacher_user_list/uid/${window.user.uid}`;
    return api.get(url).then(res=>{
      let {data_list} = res;
      let target = res.data_list.find(item=>item.uid==window.user.uid) || {}
      let arr = target['user_list'] || [];

      arr.forEach(item=>{
        item['_href'] = `http://www.hanbridgemandarin.com/school/my/course/learning-report/${item.uid}`;
        item['_level_type']= LEVELS[item.idx];
      });

      if($store && $store.commit){
        $store.commit(MUTATIONS,arr); //--发布到vuex数据中心
      };
      return res;
    })
  }
}

export default store
