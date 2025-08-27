<template>
  <router-link :to="path" class="xtx-more">
    <span>查看更多</span>
    <i class="iconfont icon-angle-right"></i>
  </router-link>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  path: {
    type: String,
    default: "/",
  },
});
</script>

<style scoped lang="less">
.xtx-more {
  margin-bottom: 2px;

  span {
    font-size: 16px;
    vertical-align: middle;
    margin-right: 4px;
    color: #999;
  }

  i {
    font-size: 14px;
    vertical-align: middle;
    position: relative;
    top: 2px;
    color: #ccc;
  }

  &:hover {
    span,
    i {
      color: #42b983;
    }
  }
}
</style>
