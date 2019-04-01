<template lang="html">
  <div class="classroom-item">
    <header>
      <h3>{{data.class_date}} <small>{{data.class_stime}}-{{data.class_etime}}</small> </h3>
      <p>{{data.lesson_num}}x{{data.class_timelen}}Mins {{data.class_stateS}}</p>
    </header>

    <section>
      <div class="classroom-info">
        <p>{{data.lesson_typeS}}</p>
        <p class="has-text-ellipsis" ><span class="key">Teacher：</span>{{data.teacher_name}}</p>
        <p class="has-text-ellipsis" ><span class="key">Student：</span>{{data.student_username_str}}</p>
      </div>

      <div class="classroom-state">
        <template v-if='data.classroom_id'>
          <p><span class="key">ID: </span>{{data.classroom_id}}</p>
          <p><span class="key">Classroom：</span>{{data.room_id}}</p>
        </template>
        <template v-else>
          <p v-if='data.losed'>Link failed</p>
          <p v-else>No classroom arrangement</p>
        </template>
      </div>

      <div class="classroom-note">
        <p class='note'>This link will be available in 2 mins, you will need to apply again after 2 mins.</p>
      </div>
    </section>

    <footer>
      <template v-if="data._requesting">
        <button>Processing</button>
      </template>
      <template v-else>
        <template v-if='data.classroom_id'>
          <a :href="data.teacher_url" target='_blank'>Join</a>
          <button  @click='request'>Reapply</button>
        </template>
        <template v-else>
          <button  @click='request'>Apply</button>
        </template>
      </template>
    </footer>
  </div>
</template>

<script>
export default {
  props:['data'],
  methods:{
    request(){  //---申请教室
      this.data._requestHandler().then(res=>{
        let {result_code,result_msg} = res;
        if(result_code>=0){
          this.$toasted.success("Successful");
        }else{
          return Promise.reject({message: result_msg});
        }
      }).catch(err=>{
        this.$toasted.error(`Failure: ${err.message}`)
      });
    }
  }
}
</script>

<style lang="stylus" scoped="">
.classroom-item
  width 100%
  padding 15px
  height 315px
  border 1px solid #dbdbdb
  transition 200ms
  &:hover
    box-shadow 2px 3px 5px #ccc
  header
    width 100%
    height 45px
    border-bottom 1px solid #dbdbdb
    h3
      font-size 15px
      small
        margin-left 3px
        color $color-warn
    p
      color #888
      font-size 13px
      margin-top 5px
  section
    padding 15px 0px
    font-size 13px
    p
      padding-bottom 5px
      width 100%
    .key
      color #aaa
    .classroom-state
      height 70px
      padding 15px 0px
  footer
    a
    button
      display inline-flex
      align-items center
      justify-content center
      height 34px
      outline none
      border none
      cursor pointer
      color #fff
      border-radius 3px
    a
      background $color-success
      width 70px
      margin-right 10px
    button
      background $color-warn
      width 100px




</style>
