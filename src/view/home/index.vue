<template>
  <!-- 首页入口 -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory></HomeCategory>
      <!-- 轮播图 -->
      <HomeBanner></HomeBanner>
    </div>
  </div>
  <!-- 新鲜好物 -->
  <!-- 人气推荐 -->
</template>

<script setup>
import { ref } from "vue";
import HomeCategory from "./component/home-category.vue";

import HomeBanner from "./component/home-banner.vue";

const name = ref("HomePage");
</script>

<style scoped>
.container {
  background-color: #dee2e6;
}
</style>
