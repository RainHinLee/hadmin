<!-- 学校课表 -->
<template lang="html">
  <div class="school-timetable">
    <div class="headerbox" >
      <ul>
        <li>
          <span>Teacher:</span>
          <select v-model="options.teacher">
            <option value="">All</option>
            <option :value="item.post_title" v-for="item of teachers">{{item.post_title}}</option>
          </select>
        </li>
        <li>
          <span>Student:</span>
          <fs-user-search :name="options.student" width="180px" height="30px" radius="15px" @select="selectStudent" />
        </li>
        <li>
          <button @click="showLayer('add')">Add</button>
        </li>
      </ul>
    </div>

    <article>
      <section class='left'>
        <fs-calendar :autoClick='true' :badges="badges" @select="selectDay" />
      </section>

      <section class='right'>
        <header><p><span>{{day}}</span></p></header>
        <ul>
          <template v-if="loading.fetch || loading.refresh">
            <li class='empty'><fs-loading /></li>
          </template>
          <template v-else>
            <template v-if="filterList.length">
              <li v-for="item of filterList">
                <p class="has-text-ellipsis">
                  {{item._stime}}-{{item._etime}} <br>
                  <span class="has-text-grey" style="font-size:13px">{{item.teacher_name}}</span>
                </p>
                <p class="has-text-ellipsis">{{item.username_str}}</p>
                <p>{{item.timetable_stateS}}</p>
                <p class="btns">
                  <span v-tooltip.top="'Modify'" @click="showLayer('modify',item)"> <i class="iconfont icon-bianji"></i> </span>
                </p>
              </li>
            </template>
            <template v-else>
              <li class='empty'>None</li>
            </template>
          </template>
        </ul>
      </section>
    </article>
    <fs-layer :open="layer.open" :title="layer.title" @close="closeLayer" :isFixed="true">
      <f-add @close="closeLayer" @success="addSuccess" v-if="layer.type=='add'"/>
      <f-modify :data="layer.data" @success="addSuccess" @close="closeLayer" v-if="layer.type=='modify'"/>
    </fs-layer>
  </div>
</template>

<script>
import util from "util";
import moment from "moment";
import Add from './add.vue';
import Modify from "./modify.vue";

export default {
  components:{
    'f-add' : Add,
    'f-modify' : Modify
  },
  data(){
    return {
      loading:{
        fetch: false,
        refresh: false
      },
      options:{
        teacher:"",
        student: ""
      },
      layer:{
        open: false,
        type: "",
        data: ""
      },
      day: moment().format("YYYY-MM-DD")
    }
  },

  methods:{
    fetch(){  //---获取整个课表
      let date = moment(this.day,'YYYY-MM-DD');;
      let days = date.daysInMonth();
      let data={
        sdate : `${date.format('YYYYMM')}01`,
        edate : `${date.format('YYYYMM')}${days}`
      };

      this.loading.fetch = true;
      return util.handlers.school_timetables.get(this.$store,data,true).then(res=>{
        this.loading.fetch = false;
      }).catch(err=>{
        this.loading.fetch = false;
        this.$toasted.error(`Failure: {err.message}`);
      });
    },

    showLayer(type,data){
      let title = type=="add" ? "Creating New Courses" : "Modifying Course";
      Object.assign(this.layer,{title,data,type,open:true});
    },

    closeLayer(){
      this.layer.open = false;
      this.layer.type = "";
    },

    selectDay(day){
      this.day = day;
      this.refresh();
    },

    selectStudent(user){  //---选择学生
      this.options.student = user.username;
    },

    refresh(){
      clearTimeout(this.timer);
      this.loading.refresh = true;
      setTimeout(()=>{
        this.loading.refresh = false;
      },300)
    },

    addSuccess(){  //--增加成功
      this.fetch();
      this.layer.open = false;
      this.layer.type = "";
      this.$toasted.success("Successful");
    },
  },

  computed:{
    list(){
      let {student,teacher} = this.options;
      let list = this.$store.state.school_timetables;
      return list.filter(item=>{ //--老师的
        return teacher ? item.teacher_name.toLowerCase() == teacher.toLowerCase() : true
      }).filter(item=>{ //--学生的
        if(student){
          return item.book_list.find(item1=>item1.student_name.toLowerCase()==student.toLowerCase())
        }else{
          return true;
        }
      });
    },

    filterList(){
      return this.list.filter(item=>{ //---当天的
        return item._date == this.day
      })
    },

    badges(){
      let res = {};
      this.list.forEach(item=>{
        let date = item['_date'];
        res[date]= res[date] || [];
        res[date].push(item);
      })
      return res
    },

    students(){
      return this.$store.state.school_students || []
    },

    teachers(){
      return this.$store.state.school_teachers || []
    }
  },

  watch:{
    day(newVal,oldVal){
      if(oldVal.slice(0,7) != newVal.slice(0,7)){
        this.fetch();
      }
    },
    options:{
      deep: true,
      handler(){
        this.refresh();
      }
    }
  },

  activated(){
    this.fetch()
  }
}
</script>

<style lang="stylus" scoped="">
.school-timetable
  max-width 1020px
  .headerbox
    height 50px
    padding-bottom 10px
    position relative
    z-index 10
    ul
      display flex
      align-items center
      li
        padding-right 25px
        select
          width 180px
          height 30px
          border-radius 15px
          outline none
          border 1px solid #dbdbdb
          color #888
          padding 0px 5px
          display inline-block
        button
          width 80px
          height 30px
          border none
          outline none
          border 1px solid $color-warn
          background #fff
          color $color-warn
          font-size 14px
          border-radius 15px
          cursor pointer
          transition 300ms
          &:hover
            background #eaeaea

  article
    display flex
    justify-content space-between
    section
      width 48%
      height 350px
    section.right
      border 1px solid #dbdbdb
      border-radius 5px
      header
        height 48px
        padding 0px 20px
        display flex
        justify-content space-between
        align-items center
        border-bottom 1px solid #dbdbdb
        a
          display inline-flex
          border 1px solid #888
          align-items center
          justify-content center
          color $color-font
          width 20px
          height 20px
          border-radius 50%
          margin-left 10px
          cursor pointer
          transition 300ms
          .iconfont
            font-size 14px
          &:hover
            background #eee
        button
          width 70px
          height 26px
          border 1px solid $color-warn
          color $color-warn
          border-radius 6px
          outline none
          background #fff
          font-size 12px
          cursor pointer
          &:hover
            background #eaeaea
      ul
        padding 10px 10px
        height calc(100% - 48px)
        overflow-y auto
        li
          font-size 13px
          padding 10px 5px
          border-bottom 1px dashed #eaeaea
          display flex
          align-items center
          justify-content space-between
          transition 300ms
          cursor default
          &:nth-last-of-type(1)
            border-bottom none
          &:hover
            background #EAE7E4
          &.empty
            border none
          p
            line-height 1.3
          p:nth-of-type(1)
            flex 2.5
            padding-right 10px
          p:nth-of-type(2)
            flex 3
            padding-right 10px
          p:nth-of-type(3)
            flex 1.2
          p:nth-of-type(4)
            flex 1
            text-align right
          .btns
            span
              display inline-flex
              align-items center
              width 30px
              height 20px
              justify-content center
              cursor pointer
              font-weight bold
</style>
