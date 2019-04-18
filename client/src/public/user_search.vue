<!-- 查询用户组件
  events:
    select

-->
<template lang="html">
  <div class="user_search_box" :style="{width,height}">
    <input @focus="show=true" @blur="blur" v-tooltip.top="'Please enter more than 3 characters'" :style="{borderRadius: radius}" v-model="username">
    <ul v-if="show">
      <template v-if="loading.fetch">
        <li class='empty'><fs-loading /></li>
      </template>
      <template v-else>
        <template v-if="list.length">
          <li v-for="item of list" @click="select(item)">{{item.username}}</li>
        </template>
        <template v-else>
          <li class="empty">None</li>
        </template>
      </template>
    </ul>
  </div>
</template>

<script>
import util from "util";

let requestID = 0;
export default {
  props:['width','height','radius','name'],
  data(){
    return {
      username: this.name || "",
      user: {},
      list:[],
      show: false,
      loading:{
        fetch : false
      }
    }
  },

  methods:{
    fetch(){
      this.list = [];
      this.user = {};
      this.loading.fetch = true;
      util.handlers.option.findUsersByName(this.username, ++requestID).then(res=>{
        if(res.requestID==requestID){
          this.loading.fetch = false
          this.list = this.canSearch ? res.user_list : [];
        }
      }).catch(err=>{
        this.loading.fetch = false
      })
    },

    search(){
      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        this.canSearch && this.fetch();
      },500);
    },

    select(user){
      this.user = user;
      this.username = user.username;
      this.$emit("select",user);
    },

    blur(){
      setTimeout(()=>{
        this.show = false
      },200)
    }
  },

  computed:{
    canSearch(){
      return this.username.length>=3
    }
  },

  watch:{
    username(newVal){
      if(this.canSearch){
        this.user.username !=newVal && this.search()
      }else{
        newVal.length==0 && this.$emit('select',{});
        this.list = [];
      }
    }
  },

  mounted(){
    this.username.length>=3 && this.search();
  }
}

</script>

<style lang="stylus" scoped="">
.user_search_box
  position relative
  left 0px
  top 0px
  width 100%
  height 100%
  display inline-flex
  input
    width 100%
    height 100%
    border 1px solid #dbdbdb
    color #888
    padding 0px 12px
    display inline-block
    outline none
  ul
    position absolute
    top calc(100% + 1px )
    left 0px
    width 100%
    min-width 190px
    padding 10px
    max-height 200px
    min-height 100px
    overflow-y auto
    border 1px solid #dbdbdb
    background #fff
    li
      color #888
      padding 5px 0px
      cursor pointer
      &:hover
      &.is-active
        color $color-warn
        background #dbdbdb
</style>
