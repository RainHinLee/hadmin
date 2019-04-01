
import Timeplan from './timeplan/index.vue';
import Classroom from './classroom/index.vue';
import Students from './students/index.vue';
import Timetable from './timetable/index.vue';

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

]
