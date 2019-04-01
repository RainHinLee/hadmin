import api from 'api';
import util from 'util';
import Vue from 'vue';

//---老师时间安排数据
const MUTATIONS =  "update_times";
const store = {
  get($store,data,reset){
    let url = `/admin/tcalender_list/${util.url.stringify(data)}`;
    return api.get(url).then(res=>{
      let {idle_list, busy_list} = res;

      idle_list.forEach(item=>{
        item['_editing'] = false;
        item['_refreshing'] = false;
        item['_submiting'] = false;
        //--修改函数
        item['_modifyHandler'] = (stime,etime)=>{
          item['_submiting'] = true;
          return store.modify(item,stime,etime).then((res)=>{
            if(res.result_code>=0){
              return store.get($store,data,reset).then(result=>res);
            }else{
              return res
            }
          }).catch(err=>{
            item['_submiting'] = false;
            return Promise.reject(err);
          })
        };
        //---更新函数
        item['_refreshHandler'] = ()=>{
          item['_refreshing'] = true;
          return store.get($store,data,reset).catch(err=>{
            item['_refreshing'] = false;
            return Promise.reject(err);
          })
        };
        //--删除函数
        item['_removeHandler'] = ()=>{
          item['_submiting'] = true;
          return store.remove(item.teacher_calender_sn).then(()=>{
            return store.get($store,data,reset)
          }).catch(err=>{
            item['_submiting'] = false;
            return Promise.reject(err);
          })
        };

        item['cache']= {
          stime : item.stime,
          etime : item.etime
        }
      });
      //---只取有课的数据
      let list = busy_list.filter(item=>item['calender_state']=="3");
      if($store && $store.commit){
        if(reset){
          $store.commit(MUTATIONS,{idle_list:[], busy_list:[]}); //--发布到vuex数据中心
        };
        Vue.nextTick(()=>{
          $store.commit(MUTATIONS,{idle_list, busy_list:list}); //--发布到vuex数据中心
        })
      }
    });

    return res
  },

  remove(sn){ //--删除一个时间
    let url = "/basic/multidel/table/lw_teacher_calender/id_field/teacher_calender_sn";
    return api.post(url,[sn]);
  },

  modify(idle_item,stime,etime){  //更新一个时间
  	let data = {
  			"sn" : idle_item['teacher_calender_sn'],
  			"date_str" : idle_item['date_str'],//.replace(/-/g,''),
  			"date_unit" : "1",
  			"stime" : stime,
  			"etime" : etime,
  			"calender_state" :idle_item['calender_state'],
  			"remark": idle_item['remark'],
  			"sdate" : idle_item['sdate'],
  			"edate" : idle_item['edate']
  	}
    let url =`/admin/tcalender/uid/${window.user.uid}`;
    return api.post(url,[data])
  },

  generateObj(day,stime,etime){  //---添加一个新的时间对象
    let newobj = {
      "teacher_calender_sn" : "",
      "calender_state" :"1",
      "date_unit" : "1",
      "date_str" : day,
      "sdate" : day,
      "edate" : day,
      "stime" : stime,
      "etime" : etime,
      "remark": "",
      "_editing" : true,
      "_submiting" : false,
      "_sn" : new Date().getTime(),
      "cache":{stime,etime},
    };

    newobj['_modify'] = (stime1,etime1)=>{
      newobj['_submiting'] = true;
      return store.modify(newobj,stime1,etime1).then(res=>{
        return res.result_code>=0 ? res : Promise.reject(res)
      }).catch(err=>{
        newobj['_submiting'] = false;
        return Promise.reject(err);
      })
    };
    return newobj;
  }

};


export default store;

/*
  测试数据
  {
    "result_code":0,
    "idle_rows":13,
    "idle_list":[{"teacher_calender_sn":"6488","date_unit":"1","date_unitS":"day","date_str":"2019-03-01","stime":"00:00","etime":"23:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6602","date_unit":"1","date_unitS":"day","date_str":"2019-03-04","stime":"12:00","etime":"13:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6497","date_unit":"1","date_unitS":"day","date_str":"2019-03-  13","stime":"00:00","etime":"23:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6491","date_unit":"1","date_unitS":"day","date_str":"2019-03-14","stime":"00:00","etime":"23:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6500","date_unit":"1","date_unitS":"day","date_str":"2019-03-15","stime":"00:00","etime":"23:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6501","date_unit":"1","date_unitS":"day","date_str":"2019-03-16","stime":"02:00","etime":"06:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6498","date_unit":"1","date_unitS":"day","date_str":"2019-03-20","stime":"00:00","etime":"23:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6490","date_unit":"1","date_unitS":"day","date_str":"2019-03-21","stime":"00:00","etime":"23:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6721","date_unit":"1","date_unitS":"day","date_str":"2019-03-22","stime":"00:00","etime":"23:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6503","date_unit":"1","date_unitS":"day","date_str":"2019-03-23","stime":"00:00","etime":"23:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6499","date_unit":"1","date_unitS":"day","date_str":"2019-03-27","stime":"00:00","etime":"23:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6492","date_unit":"1","date_unitS":"day","date_str":"2019-03-28","stime":"00:00","etime":"23:00","sdate":"","edate":"","remark":""},{"teacher_calender_sn":"6502","date_unit":"1","date_unitS":"day","date_str":"2019-03-30","stime":"00:00","etime":"23:00","sdate":"","edate":"","remark":""}],"
    busy_rows":0,
    "busy_list":[]}
*/
