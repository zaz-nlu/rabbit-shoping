<template>
  <nav><AppNav /></nav>

  <header><AppHeader /></header>
  <!-- Sticky Header -->
  <header><AppHeaderSticky /></header>
  <!-- 内容容器 -->
  <div class="app-body">
    <main><router-view></router-view></main>
  </div>
  <footer><AppFooter /></footer>
</template>

<script setup>
import { ref } from "vue";
import { useCategoryStore } from "@/stores/modules/category";

import AppNav from "@/component/app-nav.vue";
import AppHeader from "@/component/app-header.vue";
import AppFooter from "@/component/app-footer.vue";
import AppHeaderSticky from "@/component/app.header-sticky.vue";

const categoryStore = useCategoryStore();
categoryStore.getList();

const name = ref("Layout");
</script>

<style scoped lang="less">
.app-body {
  min-height: 600px;
}
</style>
