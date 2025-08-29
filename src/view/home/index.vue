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
  <!-- 热门品牌 -->
  <HomeBrand />
  <!-- 产品分类 -->
  <HomeProduct />
  <!-- 专题板块 -->
  <HomeSpecial />
</template>

<script setup>
import { ref } from "vue";
import HomeCategory from "./component/home-category.vue";
import HomeNew from "./component/home-new.vue";
import HomeBanner from "./component/home-banner.vue";
import HomeHot from "./component/home-hot.vue";
import HomeBrand from "./component/home-brand.vue";
import HomeProduct from "./component/home-product.vue";
import HomeSpecial from "./component/home-special.vue";

const name = ref("HomePage");
</script>

<style scoped>
/* 使用tranistion组件实现动画 一个元素或者组件的进入和离开 */
</style>
