// 进入教室

import moment from "moment";
import api from 'api';

const MUTATIONS="update_classroom";
const STATE_STR = "classroom";

const store = {
  get($store,reset){ //---获取教室列表
    let url= `/timetable/teacher_timetable/teacher_uid/${window.user.uid}/num/4`;
    return api.get(url).then(res=>{
      let list = res['data_list'];
      list.forEach(item=>{
        item['_requesting'] = false;   //---请求教室
        item['_refreshHandler'] = ()=>{
          return store.get($store,reset);
        };

        item['_requestHandler'] = (server_id)=>{
          let sn = item['timetable_sn'];
          item['_requesting'] = true;
          return store.request(sn,server_id).then(res=>{
            return item._refreshHandler().then(result=>{
              return res;
            }).catch(err=>{
              item['_requesting'] = false;
              return Promise.reject(err);
            })
          }).catch(err=>{
            item['_requesting'] = false;
            return Promise.reject(err);
          })
        }
      });

      if($store && $store.commit){
        let arr = reset ? list : [].concat($store.state[STATE_STR]).concat(list);
        $store.commit(MUTATIONS,arr); //--发布到vuex数据中心
      }
      return res
    })
  },

  request(timetable_sn,server_id='zoom'){ //---申请教室,server_id重新申请 zoom
    let url = `/timetable/classroom_new/timetable_sn/${timetable_sn}/server_id/${server_id}`;
    return api.get(url);
  },
};

export default store;
