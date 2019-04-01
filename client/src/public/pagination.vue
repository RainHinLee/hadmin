<!--
	翻页组件:
		props:
			total : 总条数
			size : 每页条数
			index: 当前页数 从1开始
			disabled_nums : 只保留上下切换按钮
			position: flex-start,flex-end  对齐方式

		events:
			select
-->
<template>
  <ul :style="{'justify-content':this.position || 'center'}">
  	<li><button  @click='prev' :disabled="index==1"><i class='iconfont icon-zuo'></i></button></li>
   	<template v-for='val,key of list' v-if="!disabled_nums">
			<li>
				<template v-if="val==0">
					<span>&hellip;</span>
				</template>
				<template v-else>
					<button :class="{'is-active': index==val}" @click="click(val)">{{val}}</button>
				</template>
			</li>
		</template>
  	<li><button @click='next' :disabled="index>=num"><i class='iconfont icon-you'></i></button></li>
  </ul>
</template>

<script>

	export default {
		props:['total','size','index','disabled_nums','position','max'],
		data(){
			return {
				num: Math.ceil(this.total / this.size) //--总页数
			}
		},
		methods:{
			prev(){
				this.$emit('select',Number(this.index)-1)
			},
			next(){
				this.$emit('select',Number(this.index)+1)
			},
			click(index){
				if(this.index==index){
					return
				}
				this.$emit('select',index)
			},
		},

		computed:{
			list(){ //--页数,超过6页则使用省略号
				let list = [];
				let index = Number(this.index);

				if(this.num>=6){ //--
					if(index<=3){
						list = list.concat([1,2,3,4,0,this.num]);
					}else{
						if(this.index<this.num-2){
							list = list.concat([1,0,index-1,index,index+1,0,this.num]);
						}else{
							list = list.concat([1,0,this.num-3,this.num-2,this.num-1,this.num]);
						}
					}
				}else{
					for(let i=1;i<=this.num;i++){
						list.push(i)
					}
				};
				return list;
			},
		}
	}
</script>

<style lang="stylus" scoped="scoped">
ul
  display flex
  align-items center
	justify-content center
li
  margin-right 5px
	button
    background #fff
    cursor pointer
    width 24px
    height 24px
    border 1px solid #ccc
    outline none
    border-radius 50%
    color #888
    font-size 12px
    outline none
    &:disabled
      background #ccc
      cursor not-allowed
      color #eee
    &.is-active
      background $color-warn
      border-color $color-warn
      color #fff
    .iconfont
      line-height 1.0
      font-size 12px
    &:focus
      outline none
      border-color #b5b5b5

</style>
