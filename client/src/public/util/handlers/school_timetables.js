//---学校课表操作
import api from "api";
import util from "util";
import moment from "moment";

const MUTATIONS="update_school_timetables";

const store = {
  get($store,data,reset){  //---获取数据
    let url = `timetable/list/school/opuid/1/opright/3/${util.url.stringify(data)}`;

    reset && $store && $store.commit && $store.commit(MUTATIONS,[]);
    return api.get(url).then(res=>{
      let {timetable_list} = res;
      timetable_list = timetable_list.filter(item=>item.timetable_state !=2);  //---取消的课程不要

      timetable_list.forEach(item=>{  //---增加新的字段
        let date = moment(item.class_datetime,'YYYY-MM-DD HH:mm:ss');
        let edate = moment(date).add(item.class_timelen,'minutes');

        item['_date'] = date.format('YYYY-MM-DD');
        item['_stime'] = date.format('HH:mm');
        item['_etime'] = edate.format('HH:mm');
        item['_uids'] = item.book_list.map(item1=>item1.uid);
        item['_usernames'] = item.book_list.map(item1=>item1.username);
        item['_refreshHandler'] = ()=>store.get($store,data,reset);
        item['_modifyHandler'] = store.modify(item);
      });

      if($store && $store.commit){
        $store.commit(MUTATIONS,timetable_list); //--发布到vuex数据中心
      }
      return res;
    })
  },

  add(data){  //---增加课表
    let options = this.disposeAddData(data);
    let url = `/timetable/new`;
    return api.post(url,options);
  },

  modify(target){ //--修改课表
    let url = `/timetable/mupdate/`;
    return function (data){
      let options = {
        class_timelen: target['class_timelen'],
        course_way: target['course_way'],
        course_type: target['course_type'],
        class_limit: data['class_limit'],
        lesson_num: data['lesson_num'],
        teacher_uid: data['teacher'],
        class_datetime:`${data.course_date} ${data.course_time}`,
        course_level: target['course_level'],
        timetable_state: data['timetable_state'],
      };
      url+=util.url.stringify(options)
      return api.post(url,{timetable_list: [].concat(target['timetable_sn'])});
    }
  },

  disposeAddData(data){
    return {
				course_id: 'Mandarin Chinese',
        course_way :"1", //--1、Online（线上） 2、Oncampus(学校)
        course_type : "2", //讲课
				course_level: data.course_level,
				class_limit: data.class_limit,
				teacher_uid: data.teacher,
				user_list: [{charge_type: 1,uid: data.student}],
				time_list:[{
	   			date: data.course_date.replace(/-/g,''),
          time: data.course_time,
          lesson_num: data.lesson_num,
			    teacher_uid: data.teacher,
			    class_timelen: 50,
			    num: "1",
			    uid: data.student,
      }]
    }
  }
};

export default store;
