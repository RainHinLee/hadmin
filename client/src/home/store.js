
export default {
  state:{
    times:{},
    timetable: [],
    students:[],
    classroom: [],
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
    }
  }
}
