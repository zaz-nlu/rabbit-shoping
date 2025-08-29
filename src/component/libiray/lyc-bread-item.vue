<template>
  <div class="xtx-bread-item">
    <RouterLink v-if="to" :to="to"><slot></slot></RouterLink>
    <span v-else><slot></slot></span>
  </div>
  <!-- 箭头 -->
  <i class="iconfont icon-angle-right"></i>
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
