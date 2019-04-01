<!-- 日历组件
  props:
    badegs:{ '2019-04-01':[]}
  }
 -->
<template lang="html">
  <div class="calendar">
    <header>
      <div class="prev"><a @click='prev'><i class='iconfont icon-zuo'></i></a></div>
      <div class="month">{{day.slice(0,7)}}</div>
      <div class="next"><a @click='next' ><i class='iconfont icon-you'></i></a></div>
    </header>

    <section>
      <table>
        <thead><tr><th v-for='w of weeks'>{{w}}</th></tr></thead>
        <tbody>
          <tr v-for='list of days'>
            <td v-for='d of list' ref="items" :data-day="d">
              <template v-if="d">
                <a :class="getItemClass(d)" @click='click($event,d)'>
                  {{d.slice(8,10)}}
                  <span class='badges' v-if="badges[d]">{{badges[d].length}}</span>
                </a>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>

import moment from 'moment';
import util from 'util';
const WEEKS_EN =  ['Mon','Tues','Wed','Thur','Fri','Sat','Sun'];
const MONTHS_EN = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov","Dec"];

export default {
  props:{
    'badges' : {
      type: Object,
      default: ()=>{return {}}
    },
    "startDate":{
      default:()=>moment()
    },
    "type":{
      default : 'default'
    },
    'autoClick':{
      default: false
    }
  },
  data(){
    let date = this.getDateByDefault();
    return {
      days: util.calendar(date),
      weeks:WEEKS_EN,
      day: moment().format('YYYY-MM-DD'),
      date,
    }
  },

  methods:{
    prev(){ //--上个月
      if(!this.prevMonthDisabled){
        this.date = this.date.subtract(1,'month');
        this.change();
      }
    },

    next(){ //--下个月
      this.date = this.date.add(1,'month');
      this.change();
    },

    change(){
      this.days = util.calendar(this.date);
      this.day = moment().format('YYYY-MM-DD');
      this.autoClick && this.$nextTick(this.initClick.bind(this));
      this.$emit('change',this.day);
    },

    initClick(){  //--月份变化后，默认选择日期
      let now_month = moment().format('YYYY-MM');
      let cur_month = this.date.format('YYYY-MM');
      let day = now_month==cur_month ? moment().format('YYYY-MM-DD') : `${cur_month}-01`;

      let el = this.$refs.items.find(item=>item.dataset.day==day);
      this.click({currentTarget:el},day);
    },

    click(ev,day){ //--单击事件
      let el = ev.currentTarget;
      if(this.disabled && el.classList.contains('is-expired')){
        return
      };

      if(day){
        this.day = day;
        this.$emit('select',this.day)
      }
    },

    getDateByDefault(){
      if(this.startDate){
        return moment.isMoment(this.startDate)  ? this.startDate : moment(this.startDate,'YYYY-MM-DD');
      }else{
        return moment();
      }
    },

    getItemClass(day){ //--date-item样式
      let now = moment();
      let target = moment(day,'YYYY-MM-DD');
      let arr = [];
      if(day==this.day){
        arr.push('is-active')
      };

      if(day && target.isBefore(now,'date')){ //--过期时间
        arr.push('is-expired');
      };

      return arr.join(' ');
    },
  },

  mounted(){
    this.change();
  }
}
</script>

<style lang="stylus" scoped="">
.calendar
  width 100%
  height 100%
  border 1px solid #dbdbdb
  border-radius 6px
  header
    display flex
    align-items center
    justify-content space-between
    height 48px
    padding 0px 7px
    border-bottom 1px solid #dbdbdb
    a
      width 30px
      height 30px
      display inline-flex
      align-items center
      justify-content center
      border-radius 50%
      transition 300ms
      cursor pointer
      &:hover
        background $color-warn
        color #fff
  section
    padding-bottom 10px
    table
      width 100%
      th
        padding 15px 0px
        text-align center
        font-weight normal
        font-size 13px
        color #4a4a4a
      td
        padding 6px 0px
        text-align center
        font-weight normal
        font-size 12px
        a
          position relative
          color inherit
          display inline-flex
          align-items center
          justify-content center
          width 26px
          height 26px
          border-radius 50%
          transition 300ms
          cursor pointer
          .badges
            position absolute
            width 18px
            height 18px
            background $color-success
            color #fff
            font-size 12px
            right -10px
            top -10px
            border-radius 50%
            display flex
            align-items center
            justify-content center
            transform scale(0.8)
          &.is-active
            background $color-warn
            color #fff
          &.is-expired
            color #ccc
            &.is-active
              background #ccc
              color #fff
            .badges
              background #ccc







</style>
