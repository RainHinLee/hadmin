<!-- alert,confirm
  props:
    type : string alert | confirm
    message : string 消息
    link : 点击确定按钮，重开页面的链接
    cancelHandler: 取消函数
    confirmHandler: 确定函数


弹框组件 -->
<template>
  <div class="dialog">
    <div class='dialog-bg'></div>
    <div class='dialog-content'>
      <p class='dialog-mark'>
        <i class="iconfont icon-tishi"></i>
      </p>
      <h3 class='dialog-title'>Tips</h3>
      <p class='dialog-text'>{{message}}</p>
      <div class='dialog-btns'>
        <a class='cancel' @click='cancel' v-if="type=='alert'" >cancel</a>
        <template v-if="link">
          <a class='confirm' @click="confirm" :href="link" target="_blank">confirm</a>
        </template>
        <template v-else>
          <a class='confirm' @click="confirm">confirm</a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "alert",
  props:['type','message','link','confirmHandler','cancelHandler'],
  methods:{
    cancel(){
      this.cancelHandler && this.cancelHandler();
      this.remove();
    },
    confirm(){
      this.confirmHandler && this.confirmHandler();
      this.remove();
    }
  }
}
</script>

<style lang="stylus" scoped="">
//--dialog
.dialog
	position fixed
	width 100%
	height 100%
	display flex
	align-items center
	justify-content center
	z-index 10000
	left 0px
	top 0px
	.dialog-bg
		position absolute
		width 100%
		height 100%
		left 0px
		top 0px
		z-index 1
		background rgba(0,0,0,0.5)
	.dialog-content
		position relative
		z-index 2
		margin-top 0px
		background #fff
		font-size 14px
		color $color-font
		width 320px
		padding 25px 30px
		line-height 1.0
		animation alertIn 500ms
		.dialog-mark
			text-align center
			line-height 1.0
			.iconfont
				font-size 36px
		.dialog-title
			font-weight bold
			text-align center
			padding 10px 0px
			font-size 16px
		.dialog-text
			color #888
			text-align center
			line-height 1.3
		.dialog-btns
			padding-top 25px
			text-align center
			a
				height 30px
				width 80px
				border 1px solid #ddd
				font-size 14px
				outline none
				background transparent
				cursor pointer
				line-height 1.0
				transition 300ms
				text-decoration none
				color $color-font
				display inline-flex
				align-items center
				justify-content center
				&.confirm
					color $color-warn
					margin-left 10px
				&:hover
					border-color #aaa

</style>
