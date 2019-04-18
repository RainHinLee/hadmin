<!-- 学校老师 -->
<template lang="html">
  <div class="school_teachers">
    <template v-if="loading.fetch || loading.refresh">
      <fs-loading />
    </template>
    <template v-else>
      <table>
        <thead><tr><th>Name</th><th>Experience</th><th>Introduction</th><th>Action</th></tr></thead>
        <tbody>
          <tr v-for="item of list">
            <td>{{item.post_title}}</td>
            <td>{{item.experience}}</td>
            <td>{{item.introduction}}</td>
            <td>
              <a :href="item._href" target="_blank">Account</a>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
export default {
  data(){
    return {
      loading:{
        fetch: false,
        refresh: false
      },
    }
  },

  methods:{
    selectPage(index){ //--分页
      this.page.index = index;
      this.refresh();
    },

    refresh(){  //--模拟更新
      this.loading.refresh = true;
      setTimeout(()=>{
        this.loading.refresh = false
      },300)
    },
  },

  computed:{
    list(){
      return this.$store.state.school_teachers
    }
  },

  watch:{
    list(){
      this.loading.fetch = false;
    }
  },

  mounted(){
    this.loading.fetch = this.list.length ? false : true;
  }
}
</script>

<style lang="stylus" scoped="">
.school_teachers
  max-width 1020px
  padding-bottom 60px
  table
    width 100%
    max-width 100%
    table-layout fixed
    th
    td
      padding 10px 0px
      border-bottom 1px solid #dbdbdb
      font-size 13px
      padding-right 20px
      &:nth-of-type(1)
        width 150px
      &:nth-of-type(2)
        width 120px
      &:nth-of-type(3)
        width 560px
        padding-right 35px
        max-width 100%
        line-height 1.3
      &:nth-of-type(4)
        padding-right 0px
    th
      padding-top 0px
      font-size 14px
    td
      a
        color $color-font
        text-decoration underline
        transition 300ms
        cursor pointer
        &:hover
          color $color-warn
    tr:hover
      background #ebebeb
    tr.empty
      td
        border-bottom none
</style>
