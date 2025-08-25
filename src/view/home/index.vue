<template>
  <div class="container">
    <!-- 首页入口 -->
    <div class="home-entry">
      <!-- 左侧分类 -->
      <HomeCategory></HomeCategory>
      <!-- 轮播图 -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import HomeCategory from "./component/home-category.vue";

const name = ref("HomePage");
</script>
