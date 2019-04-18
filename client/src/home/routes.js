
import Timeplan from './timeplan/index.vue';
import Classroom from './classroom/index.vue';
import Students from './students/index.vue';
import Timetable from './timetable/index.vue';
import School_Timetable from "./school_timetable/index.vue";
import School_Teachers from "./school_teachers/index.vue";
import School_Users from "./school_users/index.vue";

export default [
  {
    path:"",
    redirect:"/timeplan"
  },
  {
    path : '/classroom',
    component: Classroom
  },
  {
    path : '/timeplan',
    component: Timeplan
  },
  {
    path : '/timetable',
    component: Timetable
  },
  {
    path : '/students',
    component: Students
  },
  {
    path : "/school_timetable",
    component: School_Timetable
  },
  {
    path : "/school_teachers",
    component: School_Teachers
  },
  {
    path : "/school_users",
    component: School_Users
  },

]
