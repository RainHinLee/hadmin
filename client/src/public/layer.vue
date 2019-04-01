<!--浮层组件
		props:
			open : 是否显示
			lock: 锁着，不可关闭,
			title: 显示标题
			width : 宽度
			height : 高度
			bodyClass: 添加到modal-content样式
			isFixed : 固定的
		events:
			close: 关闭事件
-->
<template>
	<div class="layer" :class="{'is-active':open}" :style="{top: isFixed ? 0 : y, width:layout_width,height:layout_height}" >
	  <div class="layer-background"></div>
	  <div class="layer-content" :style="{width:width,height:height}" >
		  <header>
		    <h3>{{title}}</h3>
		    <p @click="$emit('close')"><i class='iconfont icon-close-o'></i></p>
		  </header>
		  <article><slot></slot></article>
	  </div>
	</div>
</template>

<script>

export default {
  props:{
    open:{
      type: Boolean,
      default: false
    },

    width : {
      type: String,
      default: '600px'
    },

    height : {
      type: String,
      default: 'auto'
    },

    title : {
      type: String,
      default: ''
    },

    isFixed: {
      type: Boolean,
      default : false
    }
  },

  data(){
    return {
      y : '0',
      layout_width : '0',
      layout_height :'0'
    }
  },

  methods:{
    refresh(){
      this.layout_width = window.innerWidth+'px';
      this.layout_height = window.innerHeight+'px';
      this.y =  (window.scrollY ||  window.pageYOffset)+'px'
    }
  },

  watch:{
    open(){
      if(this.open){
        this.refresh();
        document.documentElement.style.overflowY = 'hidden';
      }else{
        document.documentElement.style.overflowY = 'auto';
      }
    }
  },

  mounted(){
    this.resizeHandler = (ev)=>{this.refresh();};
    this.refresh();
    window.addEventListener('resize',this.resizeHandler)
  },

  destroyed(){
    document.documentElement.style.overflowY = 'auto';
    window.removeEventListener('resize',this.resizeHandler);
  }
}

</script>

<style lang="stylus" scoped="">
.layer
	position fixed
	left 0px
	top 0px
	width 100%
	height 100%
	background rgba(0,0,0,0.5)
	align-items center
	justify-content center
	z-index 1000
	display  none
	&.is-active
		display flex
	.layer-content
		background #fff
		min-height 300px
		border-radius 3px
		padding-bottom 30px
		animation slideInTop 300ms forwards
		header
			display flex
			height 44px
			justify-content space-between
			align-items center
			padding 0px 15px
			h3
				font-size 14px
				font-weight normal
				color #262626
			p
				transition 600ms
				cursor pointer
				.iconfont
					font-size 20px
				&:hover
					transform rotateZ(180deg)
		article
			padding 15px
</style>
