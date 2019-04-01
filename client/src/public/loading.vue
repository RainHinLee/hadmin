<!-- loading 加载组件 -->
<template lang="html">
  <vue-loading style="display:inline-block" :type="type" :color="color" :size="{ 'width': size, 'height': size }"></vue-loading>
</template>

<script>
export default {
  props:{
    type:{
      default : "bars"
    },
    color:{
      default: "#888"
    },
    size:{
      default: "16px"
    }
  }
}
</script>
