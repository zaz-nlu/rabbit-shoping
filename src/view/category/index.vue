<template>
  <div class="top-category">
    <div class="container">
      <!-- 页面布局 -->
      <!-- 面包屑 -->
      <LycBread>
        <template #default>
          <LycBreadItem :to="{ path: '/' }">首页</LycBreadItem>
          <LycBreadItem to="parentPath">电器</LycBreadItem>
          <LycBreadItem>空调</LycBreadItem>
        </template>
      </LycBread>
      <!-- 轮播图 -->
      <!-- 全部分类 -->
      <!-- 各个分类推荐商品 -->
    </div>
  </div>
</template>
<script setup>
import LycBread from "@/component/libiray/lyc-bread.vue";
import LycBreadItem from "@/component/libiray/lyc-bread-item.vue";
</script>
