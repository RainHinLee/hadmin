
export default {
  state:{
    times:{},
    timetable: [],
    students:[],
    classroom: [],
    school_timetables: [], //--学校课表
    school_teachers:[],  //--学校老师
    school_students:[], //--学校学生
  },

  mutations:{
    update_times(store,obj){
      store.times = obj
    },

    update_timetable(store,arr){
      store.timetable = arr;
    },

    update_students(store,arr){
      store.students = arr;
    },

    update_classroom(store,arr){
      store.classroom = arr;
    },

    update_school_timetables(store,arr){
      store.school_timetables = arr;
    },

    update_school_teachers(store,arr){
      store.school_teachers = arr;
    },
    
    update_school_students(store,arr){
      store.school_students = arr;
    }
  }
}
