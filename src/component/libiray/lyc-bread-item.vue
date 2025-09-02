<template>
  <!-- 调整为单根节点：过渡需作用于组件根，避免多根导致过渡失效 -->
  <div class="xtx-bread-item">
    <RouterLink v-if="to" :to="to"><slot></slot></RouterLink>
    <span v-else><slot></slot></span>
    <!-- 箭头放入根元素内部，便于容器样式统一控制最后一个的显示/隐藏 -->
    <i class="iconfont icon-angle-right"></i>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
const props = defineProps({
  // 当前类目名称
  to: {
    type: [String, Object],
    required: true,
    default: "",
  },
});
</script>
