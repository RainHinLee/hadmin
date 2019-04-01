<template lang="html">
  <div class="classroom">
    <template v-if="loading.fetch">
      <div class='empty'><fs-loading /></div>
    </template>
    <template v-else>
      <template v-if="list.length">
        <ul>
          <li v-for="item of list"><f-item :data="item" /></li>
        </ul>
      </template>
      <template v-else>
        <div class="empty">There is no schedule for the last week!</div>
      </template>
    </template>
  </div>
</template>

<script>
import util from 'util';
import moment from 'moment';
import Item from './item.vue';

export default {
  components:{
    'f-item' : Item,
  },

  data(){
    return {
      loading:{
        fetch: false,
        refresh: false
      }
    }
  },

  methods:{
    fetch(){
      this.loading.fetch = true;
      this.fetchHandler().then(res=>{
        this.poll();
        this.loading.fetch = false;
      }).catch(err=>{
        this.poll();
        this.loading.fetch = false;
        this.$toasted.error(`Failure: ${err.message}`);
      })
    },

    fetchHandler(){
      return util.handlers.classroom.get(this.$store,true);
    },

    poll(){
      clearInterval(this.timer);
      setInterval(this.fetchHandler.bind(this),10000);
    }
  },

  computed:{
    list(){
      return this.$store.state.classroom
    }
  },

  activated(){
    this.fetch();
  },
}
</script>

<style lang="stylus" scoped="">
ul
  width 100%
  margin 0px -10px
  li
    float left
    width 25%
    padding 10px
    &:nth-last-of-type(1)
      margin-right 0px

</style>
