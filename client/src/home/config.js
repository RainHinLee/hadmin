
export default {
  right:{
    admin: ["Finance","RainHinLee"], //--管理员
    service: ['Studentservice'], //--客服
    manager: ['keelary Huang'], //--教学主管
  },

  links:{
    teacher:[
      { path : '/classroom',title: 'Classroom',icon:"icon-zhuye"},
      { path : '/timeplan',title: 'Open Hours',icon:"icon-shijian1"},
      { path : '/timetable',title: 'Schedule',icon:"icon-shijianrili1"},
      { path : '/students',title: 'Student',icon:"icon-haoyouliebiao"},
    ],

    admin: [
      { path : '/classroom',title: 'Classroom',icon:"icon-zhuye"},
      { path : '/timeplan',title: 'Open Hours',icon:"icon-shijian1"},
      { path : '/timetable',title: 'Schedule',icon:"icon-shijianrili1"},
      { path : '/students',title: 'Student',icon:"icon-haoyouliebiao"},
      { path : "/school_timetable", title: "Timetables", icon: "icon-dingdan"},
      { path : '/school_users',title: 'Users',icon:"icon-haoyouliebiao"},
      { path : '/school_teachers',title: 'Teachers',icon:"icon-fuwushoucang"},
    ],

    service:[
      { path : '/classroom',title: 'Classroom',icon:"icon-zhuye"},
      { path : '/timeplan',title: 'Open Hours',icon:"icon-shijian1"},
      { path : '/timetable',title: 'Schedule',icon:"icon-shijianrili1"},
      { path : '/students',title: 'Student',icon:"icon-haoyouliebiao"},
      { path : "/school_timetable", title: "Timetables", icon: "icon-dingdan"},
      { path : '/school_users',title: 'Users',icon:"icon-haoyouliebiao"},
      { path : '/school_teachers',title: 'Teachers',icon:"icon-fuwushoucang"},
    ],

    manager:[
      { path : '/classroom',title: 'Classroom',icon:"icon-zhuye"},
      { path : '/timeplan',title: 'Open Hours',icon:"icon-shijian1"},
      { path : '/timetable',title: 'Schedule',icon:"icon-shijianrili1"},
      { path : '/students',title: 'Student',icon:"icon-haoyouliebiao"},
      { path : "/school_timetable", title: "Timetables", icon: "icon-dingdan"},
      { path : '/school_users',title: 'Users',icon:"icon-haoyouliebiao"},
      { path : '/school_teachers',title: 'Teachers',icon:"icon-fuwushoucang"},

    ]
  }
}
