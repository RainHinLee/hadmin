<template >
  <div class="box" :style="{'height':minHeight}">
    <nav>
      <ul>
        <template v-for='item of links'>
          <li @click="$router.push(item.path)" :class="{'is-active': item.path == $route.fullPath}">
            <a><i class='iconfont' :class="item.icon"></i><span>{{item.title}}</span></a>
          </li>
        </template>
			</ul>
    </nav>
    <article>
      <header>
        <a> <i class="iconfont icon-zhuce"></i> {{user.name}}</a>
        <a @click="$logout">Exit</a>
      </header>
      <section>
        <transition name='fade' mode='out-in'>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </transition>
      </section>
    </article>
  </div>
</template>

<script>

const LINKS = [
  {path : '/classroom',title: 'Classroom',icon:"icon-zhuye"},
  {path : '/timeplan',title: 'Open Hours',icon:"icon-shijian1"},
  {path : '/timetable',title: 'Schedule',icon:"icon-shijianrili1"},
  {path : '/students',title: 'Students',icon:"icon-haoyouliebiao"},
]

export default {
  data(){
    return {
      minHeight: "",
      links: LINKS
    }
  },

  methods:{
    setMinHeight(){
      this.minHeight = document.documentElement.clientHeight+"px";
    }
  },

  filters:{
		classname(item){
			let path = document.location.pathname;
			if(path==item.href){
				return 'is-active'
			}else{
				return ''
			}
		}
	},
  mounted(){
    this.setMinHeight();
    window.addEventListener('resize', this.setMinHeight.bind(this))
  }
}

</script>

<style lang="stylus" scoped>
.box
  max-width 1400px
  margin 0px auto
  display flex
  position relative
  color $color-font
  font-size 14px
  nav
    width 200px
    background #444
    padding 35px 15px
    z-index 10
    li
      padding 15px
      color #fff
      position relative
      cursor pointer
      transition 300ms
      &.is-active
      &:hover
        color $color-warn
        background #666
      .iconfont
        font-size 18px
        margin-right 15px
      a
        color inherit
        text-decoration none
  article
    height 100%
    flex 1
    header
      width 100%
      height $height-header
      background #fff
      border-bottom 1px solid #dbdbdb
      display flex
      align-items center
      justify-content flex-end
      padding 0px 50px
      a
        margin-left 15px
        color inherit
        text-decoration none
        cursor pointer
        &:nth-of-type(1)
          cursor default
        &:nth-of-type(2):hover
          text-decoration underline
          color $color-warn
    section
      padding 30px
</style>
<style lang="stylus">
  @import './layout.styl'
</style>
