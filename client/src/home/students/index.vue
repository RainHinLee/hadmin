<template lang="html">
  <div class="students">
    <template v-if="loading.fetch">
      <div class='empty'><fs-loading /></div>
    </template>
    <template v-else>
      <template v-if="list.length">
        <table>
          <thead><tr><th>Name</th><th>Level</th><th>Action</th></tr></thead>
          <tbody>
            <template v-if="loading.refresh">
              <tr class='empty'><td colspan="3"><fs-loading /></td></tr>
            </template>
            <template v-else>
              <tr v-for="item of pageList">
                <td>{{item.username}}</td>
                <td>{{item._level_type}}</td>
                <td><a :href="item._href" target="_blank">Progress</a></td>
              </tr>
            </template>
          </tbody>
        </table>
        <div style="margin-top:20px" v-if="!loading.refresh">
          <fs-pagination :total="list.length" :size="page.size" :index="page.index" @select="selectPage"/>
        </div>
      </template>
      <template v-else>
        <div class="empty">None </div>
      </template>
    </template>
  </div>
</template>

<script>
import util from 'util';

export default {
  data(){
    return {
      loading:{
        fetch: false,
        refresh: false
      },
      page:{
        index: "1",
        size : '10',
      },
    }
  },
  methods:{
    fetch(){
      this.loading.fetch = true;
      return util.handlers.students.get(this.$store).then(res=>{
        this.loading.fetch = false;
      }).catch(err=>{
        this.loading.fetch = false;
        this.$toasted.error(`Failure: ${err.message}`)
      })
    },

    selectPage(index){ //--分页
      this.page.index = index;
      this.refresh();
    },

    refresh(){  //--模拟更新
      this.loading.refresh = true;
      setTimeout(()=>{
        this.loading.refresh = false
      },500)
    },
  },

  computed:{
    list(){
      return this.$store.state.students;
    },
    pageList(){ //--获取分页数据
      let {index,size} = this.page;
      let start = (index-1) * size;
      let end = Number(start) + Number(size);
      return this.list.slice(start,end);
    }
  },

  activated(){
    this.fetch();
  }
}
</script>

<style lang="stylus" scoped="">
.students
  max-width 450px
  table
    width 100%
    th
    td
      padding 8px 0px
      border-bottom 1px solid #dbdbdb
      font-size 13px
      width 33%
      &:nth-of-type(1)
      &:nth-of-type(2)
        width 150px
      &:nth-of-type(3)
        width 120px
    th
      padding-top 0px
      font-size 14px
    td
      a
        color $color-font
        text-decoration underline
        transition 300ms
        &:hover
          color $color-warn
    tr.empty
      td
        border-bottom none


</style>
