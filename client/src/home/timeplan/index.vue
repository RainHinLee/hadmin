<template lang="html">
  <div class="timeplan">
    <div class="headerbox" v-if="['admin','service','manager'].includes(user._right)">
      <ul>
        <li>
          <span>Teacher:</span>
          <select v-model="options.teacher">
            <option :value="user.username">{{user.username}}</option>
            <option :value="item.post_title" v-for="item of teachers">{{item.post_title}}</option>
          </select>
        </li>
      </ul>
    </div>

    <article>
      <div class="calendarbox">
        <fs-calendar :autoClick='true' :badges="badges" @select="(day)=>select('day',day)"   />
      </div>
      <div class="timesbox">
        <header>
          <p>
            <span>{{day}}</span>
            <a v-tooltip.top="'Add'" @click="add"><i class="iconfont icon-add-o"></i></a>
          </p>
        </header>
        <ul>
          <template v-if="fetching.refresh || fetching.fetch">
            <li class='empty'><fs-loading /></li>
          </template>
          <template v-else>
            <template v-if="list.length">
              <li v-for="item of list">
                <!-- 课表  -->
                <template v-if="item.calender_state>=2">
                  <div class="time">{{item.stime}}-{{item.etime}} <span class='mark'>{{item.remark}}</span></div>
                </template>
                <template v-else>
                  <template v-if="item._editing">
                    <div class="selects">
                      <select v-model="item.cache.stime">
                        <option v-for="time of timelist" :value="time">{{time}}</option>
                      </select>
                      -
                      <select v-model="item.cache.etime">
                        <option v-for="time of timelist" :value="time">{{time}}</option>
                      </select>
                    </div>
                    <div class="btns">
                      <span class="has-text-success" v-tooltip.top="'Submit'" @click="select('save',item)"> <i class="iconfont icon-complete-o"></i> </span>
                      <span class="has-text-warn" v-tooltip.top="'Cancel'" @click="select('cancel',item)"> <i class="iconfont icon-close-o"></i> </span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="time">{{item.stime}}-{{item.etime}}</div>
                    <div class="btns">
                      <template v-if="item._submiting">
                        <span><fs-loading /></span>
                      </template>
                      <template v-else>
                        <span v-tooltip.top="'Modify'" @click="select('modify',item)"> <i class="iconfont icon-bianji"></i> </span>
                        <span v-tooltip.top="'Remove'" @click="select('remove',item)"> <i class="iconfont icon-close-o"></i> </span>
                      </template>
                    </div>
                  </template>
                </template>
              </li>
            </template>
            <template v-else>
              <li class='empty'>None</li>
            </template>
          </template>
        </ul>
      </div>
    </article>
  </div>
</template>

<script>
import moment from 'moment';
import util from 'util';

const STIME = "00:00";
const ETIME = "24:00";
const MUTATIONS = "update_times";

export default {
  data(){
    return {
      day: moment().format('YYYY-MM-DD'),
      timelist: util.hours(STIME,ETIME,60),
      newlist: [],  //--增加新的时间点
      layer:{
        open: false,
      },
      fetching:{
        refresh:false,
        fetch: false,
      },
      options:{
        teacher : window.user.username, //--老师名字
      }
    }
  },

  methods:{
    fetchTimes(){
      this.$store.commit(MUTATIONS,[]);
      this.fetching.fetch = true;
      return this.fetchTimesHandler().then(res=>{
        this.fetching.fetch = false;
      }).catch(err=>{
        this.fetching.fetch = false;
      })
    },

    fetchTimesHandler(){
      let days = moment(this.day).daysInMonth();
      let data = {
        sdate: `${this.month}-01`,
        edate: `${this.month}-${days}`
      };
      return util.handlers.option.findUserByName(this.options.teacher).then(user=>{
        data['uid'] = user.uid;
        return util.handlers.times.get(this.$store,data,true)
      })
    },

    select(type,data){
      switch(type){
        case 'day':
          this.day = data;
          this.refresh();
          break;
        case 'modify':
          data['_editing'] = true;
          break;
        case 'cancel':
          if(data.teacher_calender_sn){  //--修改
            data['_editing'] = false;
            data['cache'] = {stime : data.stime,etime : data.etime};
          }else{ //--新增数据
            this.newlist_pop(data._sn);  //---移除该项
          }
          break;
        case 'remove':
          this.$confirm('Are you sure you want to delete it?',()=>{
            data._removeHandler().then(res=>{
              this.$toasted.success("Successful")
            }).catch(err=>{
              this.$toasted.error(`Failure: ${err.message}`)
            })
          });
          break;
        case "save":
          let {stime,etime} = data.cache;
          let cache = {stime : data.stime,etime : data.etime};
          Object.assign(data,{_editing:false,stime,etime});

          this.validate(data).then(()=>{
            data._submiting = true;
            return util.handlers.option.findUserByName(this.options.teacher).then(user=>{
              console.log(user)
              return data._modifyHandler(stime,etime,user.uid);
            }).then(res=>{
              let {result_code,fail_list} = res;
              if(result_code>=0){
                this.$toasted.success("Successful")
              }else{
                return Promise.reject({message: fail_list[0]['errmsg']});
              }
            })
          }).catch(err=>{
            console.log(err.stack)
            data['_editing'] = true;
            data['_submiting'] = false;
            data['stime'] = cache.stime;
            data['etime'] = cache.etime;
            this.$toasted.error(`Failuer:${err.message}`);
          })
      };
    },

    validate(data){  //---校验,开始时间大于结束时间，
      let rex = /:/g;
      let stime = data.cache.stime.replace(rex,'');
      let etime = data.cache.etime.replace(rex,'');
      if(stime>=etime){
        return Promise.reject({message: 'The start time is greater than the end time'})
      }

      let target = this.idle_times.filter(item=>item['date_str']==this.day).find(item=>{  //--看是否有冲突
        let stime1 = item.stime.replace(rex,'');
        let etime1 = item.etime.replace(rex,'');
        return (item !=data) && ((stime>stime1 && stime<=etime1) || (etime>stime1 && etime <= etime1) || (stime<=stime1 && etime>=etime1))
      });

      if(target){
        return Promise.reject({message:  `Conflict with  ${target.stime}-${target.etime}`})
      };
      return Promise.resolve();
    },

    add(){  //--增加新的
      let rex = /-/g;
      let now = moment().format('YYYYMMDD');

      if(this.day.replace(rex,"")<now){
        return this.$alert("Expiration time!")
      }

      let newobj= util.handlers.times.generateObj(this.day,'00:00',"23:00");
      newobj['_modifyHandler'] = (stime,etime,uid)=>{
        return newobj._modify(stime,etime,uid).then(res=>{
          return this.fetchTimesHandler().then(()=>{ //--更新数据
            this.newlist_pop(newobj._sn); //--从newlist中移除该项
            return res;
          }).catch(err=>{
            return Promise.reject(res);
          })
        })
      };
      this.newlist.push(newobj);
    },

    newlist_pop(sn){   //--从newlist中移除项
      let index = this.newlist.find(item=>item._sn==sn);
      index ? this.newlist.splice(index,1): "";   //---从newlist中移除该项
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

    idle_times(){
      let idle_list = this.$store.state.times.idle_list || [];
      let arr = [].concat(idle_list).concat(this.newlist);
      let rex = /-/g;
      let now = moment().format('YYYYMMDD');
      return arr.filter(item=>item['date_str'].replace(rex,'')>=now)
    },

    busy_times(){
      let arr = this.$store.state.times.busy_list || [];
      let rex = /-/g;
      let now = moment().format('YYYYMMDD');
      return arr//.filter(item=>item['date_str'].replace(rex,'')>=now)
    },

    badges(){
      let res = {};
      this.idle_times.concat(this.busy_times).forEach(item=>{
        let date = item['date_str'];
        let arr = res[date] || [];
        arr.push(item);
        res[date] = arr;
      });
      return res;
    },
    //--当前日的数据列表
    list(){
      let arr = this.idle_times.concat(this.busy_times).filter(item=>item['date_str']==this.day);
      arr.sort((a,b)=> a.stime.replace(":","")-b.stime.replace(":",""));
      return arr
    },
    teachers(){
      return this.$store.state.school_teachers || []
    }
  },

  watch:{
    month(){
      this.fetchTimes();
    },
    "options.teacher":{
      handler(newVal){
        this.$toasted.success(`Switch to ${newVal}`);
        this.fetchTimes();
      }
    }
  },
  activated(){
    this.fetchTimes();
  }
}
</script>

<style lang="stylus" scoped="">
.timeplan
  max-width 940px
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
  article
    display flex
    justify-content space-between
    .calendarbox
      width 450px
      height 350px
    .timesbox
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
          .is-success
            color $color-success
          .empty
            border none
          .mark
            color #aaa
            margin-left 10px
          .btns
            span
              display inline-flex
              align-items center
              width 30px
              height 20px
              justify-content center
              cursor pointer
              font-weight bold
          select
            width 100px
            height 24px
            border 1px solid #dbdbdb
            border-radius 12px
            color #888
            padding-left 6px
            outline none

</style>
