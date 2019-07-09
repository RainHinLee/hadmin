<!-- 增加新课程组件 -->
<template lang="html">
  <div class="addbox">
    <ul>
      <li>
        <p class="key">Date:</p>
        <p class="value"><input type="date" v-model="values.date"> </p>
      </li>
      <li>
        <p class="key">Time:</p>
        <p class="value"><input type="time" v-model="values.time"></p>
      </li>
      <li>
        <p class="key">Type:</p>
        <p class="value">
          <select v-model="values.type">
            <option :value="item.value" v-for="item of types">{{item.text}}</option>
          </select>
        </p>
      </li>
      <li>
        <p class="key">Personel:</p>
        <p class="value">
          <select v-model="values.personel">
            <option :value="item.value" v-for="item of personels">{{item.text}}</option>
          </select>
        </p>
      </li>
      <li>
        <p class="key">Teacher:</p>
        <p class="value">
          <select v-model="values.teacher">
            <option :value="item.post_title" v-for="item of teachers">{{item.post_title}}</option>
          </select>
        </p>
      </li>
      <li>
        <p class="key">Student:</p>
        <p class="value">
          <fs-user-search :name="values.student" height="30px" radius="3px" @select="selectStudent" />

          <!-- <select v-model="values.student">
            <option :value="item.uid" v-for="item of students">{{item.username}}</option>
          </select> -->
        </p>
      </li>
      <li>
        <p class="key">Lessons:</p>
        <p class="value">
          <select v-model="values.lesson">
            <option :value="item.value" v-for="item of lessons">{{item.text}}</option>
          </select>
        </p>
      </li>

      <li style="margin-top:20px">
        <p class="key"></p>
        <p class='value'>
          <button @click="$emit('close')">Cancel</button>
          <button class='is-active' @click="submit">{{loading.submit?"Processing..." : "Submit"}}</button>
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import moment from 'moment';
import util from "util";

export default {
  data(){
    return {
      values:{
        date: moment().format('YYYY-MM-DD'),  //--日期
        time : moment().format('HH:mm'), //--时间
        teacher: "", //--老师
        student: "", //--学生
        type : "", //--课程类型
        personel:"", //--人数
        lesson:"", //--课时数
      },
      loading:{
        submit: false
      }
    }
  },

  methods:{
    submit(){
      if(this.loading.submit){  //---还在请求中
        return
      };

      let data = this.getData();
      if(this.validate()){
        this.loading.submit= true
        util.handlers.option.findUserByName(data.teacher).then(user=>{
          data['teacher'] = user.uid;
          return util.handlers.school_timetables.add(data);
        }).then(res=>{
          if(res.result_code>=0){
            this.loading.submit = false
            this.$emit("success");
          }else{
            return Promise.reject({message: res.result_msg})
          }
        }).catch(err=>{
          this.loading.submit= false;
          this.$toasted.error(`Failuer: ${err.message}`);
        })
      }
    },

    getData(){
      return {
        "course_date": this.values.date, //--课程日期
        "course_time": this.values.time, //--课程时间
        "course_level" : this.values.type,  // 课程类型
        "class_limit": this.values.personel,  //--上课人数
        "lesson_num" : this.values.lesson,
        "teacher" : this.values.teacher,
        "student" : this.values.student,
      }
    },

    validate(){  //--校验数据
      let data = this.getData();
      let isok = Object.values(data).every(item=>item);

      isok || this.$toasted.error("Please fill in all form information.");
      return isok;
    },

    selectStudent(student){
      this.values.student = student.uid;
    }
  },

  computed:{
    students(){
      return this.$store.state.school_students || []
    },

    teachers(){
      return this.$store.state.school_teachers || []
    },

    types(){
      
      return [
        {text:"General",value:"1"},
        {text:"Special",value:"2"},
        {text:"Trial",value:"3"}
      ]
    },

    personels(){
      return [
        {text:"Private",value:"1"},
        {text:"1-On-2 ",value:"2"},
        {text:"1-On-3 ",value:"3"},
        {text:"1-On-4 ",value:"4"},
        {text:"1-On-8 ",value:"8"}
      ]
    },
    lessons(){
      return [
        {text:"1 Lesson",value:"1"},
        {text:"2 Lessons",value:"2"},
        {text:"3 Lessons",value:"3"},
      ]
    }
  },

  mounted(){

  }
}

</script>

<style lang="stylus" scoped="">
ul
  padding 0px 120px
  li
    display flex
    align-items center
    margin-bottom 10px
    p.key
      width 80px
      text-align right
      padding-right 15px
    p.value
      flex 1
      input
      select
      button
        width 100%
        border 1px solid #ccc
        border-radius 3px
        background #fff
        padding 5px 10px
        height 30px
        color #888
      button
        width 100px
        border-color $color-warn
        color $color-warn
        cursor pointer
        outline none
        &.is-active
          background $color-warn
          color #fff



</style>
