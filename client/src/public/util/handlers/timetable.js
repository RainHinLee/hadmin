import api from 'api';
import util from 'util';
import moment from 'moment';
import Vue from 'vue';

//---老师时间安排数据

const MUTATIONS =  "update_timetable";

const store = {
  get($store,data,reset){
    let url = `/timetable/list/teacher/${util.url.stringify(data)}`;
    return api.get(url).then(res=>{
      let options = res.teacher_list.find(item=>item.teacher_uid==window.user.uid) || {}
      let list = options['timetable_list'] || [];
      let now =  moment();

      list.forEach(item=>{
        let date = item.class_datetime.slice(0,10);
        item['_submiting'] = false;
        item['_stime'] = item.class_time;
        item['_etime'] = util.etime(item.class_time,item.class_timelen);
        //--课程是否已结束，时间上
        item['_isEnded'] = now.isAfter(moment(`${date} ${item._etime}`,'YYYY-MM-DD HH:mm'),'minutes');
        item['_refreshHandler']=()=>store.get($store,data,reset);  //更新函数
        item['_recordHandler']=(uid,state)=>{
          item['_submiting'] = true;
          return store.record(item,uid,state).then(res=>{
            item._refreshHandler().then(()=>{
              return res
            }).catch(err=>{
              item['_submiting'] = false;
              return Promise.reject(res);
            })
          }).catch(err=>{
            item['_submiting'] = false;
            return Promise.reject(err);
          })
        }
      })

      //---只取有课的数据
      if($store && $store.commit){
        if(reset){
          $store.commit(MUTATIONS,[]); //--发布到vuex数据中心
        };
        Vue.nextTick(()=>{
          $store.commit(MUTATIONS,list); //--发布到vuex数据中心
        })
      };
      return options
    })
  },

  record(timetable,uid,state){  //--记录课程
    let sn = timetable.timetable_sn
    let url = `/timetable/record/${sn}/uid/${uid}/state/${state}`;
    return api.post(url);
  }

};


export default store;
