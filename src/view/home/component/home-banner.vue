<template>
  <div class="home-banner">
    <!-- 给子组件标签加类名，作为父级样式作用的锚点 -->
    <LycCarousel auto-play class="lyc-carousel" :sliders="bannerData" />
  </div>
</template>

<script setup>
import LycCarousel from "@/component/libiray/lyc-carousel.vue";
import { findBanner } from "@/api/home";
import { ref, onMounted } from "vue";
// 注意：这里需要的是“数据数组”，而不是一个异步函数
const bannerData = ref([]);

onMounted(async () => {
  const data = await findBanner();
  bannerData.value = data.result || [];
  console.log("banner =>", bannerData.value);
});
</script>

<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: relative;
  left: 0;
  right: 0;
  z-index: 98;
}
/*
  说明：
  1) 父组件样式是 scoped 的，需使用 :deep() 穿透子组件的 scoped 边界
  2) 通过给 <LycCarousel> 添加类名 .lyc-carousel，作为选择器的作用域锚点
  3) 下面两个选择器用于偏移轮播按钮与底部指示器，适配左侧 250px 分类菜单
*/
.lyc-carousel :deep(.carousel-btn.prev) {
  left: 270px;
}

.lyc-carousel :deep(.carousel-indicator) {
  padding-left: 250px;
}
</style>
