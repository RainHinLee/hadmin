<!-- 记录课程组件
  props
    sn : 课程timetable_sn
 -->
<template lang="html">
  <div class="">
    <table>
      <thead><tr><th>Student</th><th>Date</th><th>State</th><th>Action</th></tr></thead>
      <tbody>
        <tr v-for="item of students">
          <td>{{item.student_name}}</td>
          <td>{{data.class_datetime.slice(0,10)}} {{data._stime}}</td>
          <td>{{item.timetable_user_stateS}}</td>
          <td>
            <template v-if="data._submiting">
              <fs-loading />
            </template>
            <template v-else>
              <template v-if="item.timetable_user_state==1">
                <span @click="record(item,3)">Record</span>
                <span @click="record(item,4)">Absent</span>
              </template>
              <template v-if="['3','4'].includes(item.timetable_user_state)">
                <span @click="record(item,1)">Reset</span>
              </template>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props:['sn'],
  methods:{
    record(item,state){
      return this.data._recordHandler(item.uid,state).then(res=>{
        setTimeout(()=>{
          this.$toasted.success('Successful')
        },600)
      }).catch(err=>{
        this.$toasted.error('Failure')
      })
    }
  },
  computed:{
    list(){
      return this.$store.state.timetable || []
    },

    data(){
      return this.list.find(item=>item.timetable_sn == this.sn) || {}
    },

    students(){
      return this.data.book_list || []
    },
  },

  watch:{
    list(){
      console.log('change')
    }
  }

}
</script>

<style lang="stylus" scoped="">
table
  width 100%
  th
  td
    padding 8px 0px
    border-bottom 1px solid #dbdbdb
    font-size 12px
    &:nth-of-type(1)
    &:nth-of-type(2)
      width 150px
    &:nth-of-type(3)
      width 120px
  th
    padding-top 0px
    font-size 13px
  td
    span
      text-decoration underline
      margin-right 10px
      cursor pointer
      transition 300ms
      &:hover
        color $color-warn

</style>
