<template lang="html">
  <div class="timetbale">
    <div class="calendarbox">
      <fs-calendar :autoClick='true' :badges="badges" @select="select" />
    </div>
    <div class="listbox">
      <header><p><span>{{day}}</span></p></header>
      <section>
        <template v-if="fetching.refresh">
          <div class='empty'><fs-loading /></div>
        </template>
        <template v-else>
          <template v-if="pageList.length">
            <ul>
              <li v-for="item of pageList">
                <div class='infobox'>
                  <p>{{item._stime}}-{{item._etime}}</p>
                  <p>{{item.username_str}}</p>
                  <p>{{item.timetable_stateS}}</p>
                </div>
                <div class='actionbox'>
                  <button @click="record(item)" v-if="item._isEnded">Record</button>
                  <button class="is-disabled" v-else>Record</button>
                </div>
              </li>
            </ul>
          </template>
          <template v-else>
            <div class='empty'>None</div>
          </template>
        </template>
      </section>
    </div>
    <fs-layer title="Record" width="560px" :open="layer.open" :isFixed="true" @close="layer.open=false">
      <f-record :sn="layer.sn" />
    </fs-layer>
  </div>
</template>

<script>
import moment from "moment";
import util from "util";
import Record from './record.vue';

export default {
  components:{
    "f-record" : Record
  },
  data(){
    return {
      day: moment().format('YYYY-MM-DD'),
      fetching:{
        refresh:false,
      },
      layer:{
        open: false,
        sn: "",
      }
    }
  },

  methods:{
    fetch(){
      let days = moment(this.day).daysInMonth();
      let month = this.month.replace(/-/g,'');

      let data = {
        teacher_uid: this.user.uid,
        sdate: `${month}01`,
        edate: `${month}${days}`
      };
      return util.handlers.timetable.get(this.$store,data)
    },

    select(day){
      this.day = day;
      this.refresh();
    },

    record(data){  //--记录课程
      this.layer.open=true;
      this.layer.sn = data.timetable_sn
    },

    refresh(){
      clearTimeout(this.timer);
      this.fetching.refresh = true;
      setTimeout(()=>{
        this.fetching.refresh = false;
      },300)
    },
  },

  computed:{
    month(){
      return this.day.slice(0,7);
    },

    list(){
      let arr = this.$store.state.timetable || []
      return arr
    },

    badges(){
      let res = {};
      this.list.forEach(item=>{
        let date = item['class_datetime'].slice(0,10);
        let arr = res[date] || [];
        arr.push(item);
        res[date] = arr;
      });
      return res;
    },

    pageList(){
      return this.list.filter(item=>{
        let date = item['class_datetime'].slice(0,10);
        return date == this.day;
      })
    }
  },

  watch:{
    month(){
      this.fetch();
    }
  },

  activated(){
    this.fetch();
  }
}
</script>

<style lang="stylus" scoped="">
.timetbale
  max-width 940px
  display flex
  justify-content space-between
  .calendarbox
    width 450px
    height 350px
  .listbox
    width 450px
    height 350px
    border 1px solid #dbdbdb
    border-radius 5px
    header
      height 48px
      padding 0px 20px
      display flex
      justify-content space-between
      align-items center
      border-bottom 1px solid #dbdbdb
    section
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
        &:hover
          background #EAE7E4
        .infobox
          flex 1
          padding-right 10px
          p:nth-of-type(2)
          p:nth-of-type(3)
            font-size 13px
            margin-top 3px
          p:nth-of-type(3)
            color #aaa
        .actionbox
          display flex
          width 60px
          justify-content flex-end
          button
            width 100%
            height 24px
            border none
            background $color-warn
            color #fff
            font-size 12px
            outline none
            cursor pointer
            border-radius 3px
            &.is-disabled
              background #ccc
              color #fff
              cursor not-allowed
      div.empty
        display flex
        height 60px
        justify-content center
        align-items center

</style>
