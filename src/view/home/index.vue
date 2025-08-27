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
  <HomeNew />
  <!-- 人气推荐 -->
  <HomeHot />
</template>

<script setup>
import { ref } from "vue";
import HomeCategory from "./component/home-category.vue";
import HomeNew from "./component/home-new.vue";
import HomeBanner from "./component/home-banner.vue";
import HomeHot from "./component/home-hot.vue";

const name = ref("HomePage");
</script>

<style scoped>
:deep(.home-entry) {
  background-color: red;
}
</style>
