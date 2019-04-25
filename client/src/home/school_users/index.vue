<!-- 学校用户 -->
<template lang="html">
  <div class="school_users">
    <div class="headerbox" >
      <ul>
        <li>
          <span>User:</span>
          <fs-user-search width="180px" height="30px" radius="15px" @select="selectStudent" />
        </li>
      </ul>
    </div>

    <template v-if="loading.fetch">
      <fs-loading />
    </template>
    <template v-else>
      <table>
        <thead><tr><th>Name</th><th>Register</th><th>Email</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="item of list">
            <td>{{item.username}}</td>
            <td>{{item.regdate}}</td>
            <td>{{item.email}}</td>
            <td>
              <template v-if="item._reseting">
                <fs-loading />
              </template>
              <template v-else>
                <a @click="reset(item)">Reset</a>
                <a>Orders</a>
                <a>Teachers</a>
                <a>Vacation</a>
                <a :href="item._href" target="_blank">Account</a>

              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:20px" v-if="!loading.fetch">
        <fs-pagination :total="page.total" :size="page.size" :index="page.index" @select="selectPage"/>
      </div>
    </template>
  </div>
</template>

<script>
import util from "util";
import moment from "moment";

export default {
  data(){
    return {
      list:[],
      loading:{
        fetch: false
      },
      page:{
        index: 1,
        size : 12,
        total: 1
      },
      options:{
        username : "",
      }
    }
  },

  methods:{
    fetch(){
      this.loading.fetch = true;
      return util.handlers.school_users.getByPage(this.page.index).then(res=>{
        this.page.total = res.total_rows;
        this.list = res['user_list'];
        this.loading.fetch = false;
      }).catch(err=>{
        this.$toasted.error(`Failure: ${err.message}`);
        this.loading.fetch = false
      })
    },

    search(){
      this.loading.fetch = true;
      this.page.index = 1;
      util.handlers.school_users.getByName(this.options.username).then(res=>{
        this.page.total = res.total_rows;
        this.list = res['user_list'];
        this.loading.fetch = false;
      }).catch(err=>{
        this.$toasted.error(`Failure: ${err.message}`);
        this.loading.fetch = false
      })
    },

    selectStudent(user){  //--选择用户
      if(user.username){
        this.options.username = user.username;
        this.search();
      }else{
        this.options.username = "";
        this.fetch()
      }
    },

    reset(data){
      this.$confirm("Are you sure to reset the password",()=>{
        data._resetHandler().then(res=>{
          this.$toasted.success('Successful, new password:123456')
        }).catch(err=>{
          this.$toasted.success(`Failure:${err.message}`);
        })
      })
    },

    selectPage(index){ //--分页
      this.page.index = index;
      this.fetch();
    },
  },

  mounted(){
    this.fetch();
  }
}
</script>

<style lang="stylus" scoped="">
.school_users
  max-width 960px
  padding-bottom 60px
  .headerbox
    height 50px
    padding-bottom 10px
    position relative
    z-index 10
    ul
      display flex
      align-items center
      li
        margin-right 20px
        button
          width 80px
          height 30px
          border none
          outline none
          border 1px solid #dbdbdb
          background #fff
          font-size 14px
          border-radius 15px
          cursor pointer
          transition 300ms
          color $color-font
          &:hover
            border-color $color-warn
            color $color-warn
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
      &:nth-of-type(2)
        width 180px
      &:nth-of-type(3)
        width 300px
        padding-right 35px
        max-width 100%
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
        margin-right 5px
        &:hover
          color $color-warn
    tr:hover
      background #ebebeb
    tr.empty
      td
        border-bottom none
</style>
