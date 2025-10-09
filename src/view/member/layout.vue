<template>
  <div class="container">
    <AppMemberAside />
    <article class="article">
      <RouterView />
    </article>
  </div>
</template>

<script setup>
import AppMemberAside from "@/component/app-member-aside.vue";
import { RouterView } from "vue-router";
</script>

<style scoped lang="less">
.container {
  display: flex;
  padding-top: 20px;
  max-width: 1280px; /* 设置最大宽度 */
  margin: 0 auto; /* 居中显示 */
  gap: 20px; /* 侧边栏和内容区的间距 */

  .article {
    flex: 1; /* 自动占据剩余空间 */
    max-width: 1000px; /* 最大宽度限制 */
    min-width: 0; /* 防止内容溢出 */
  }
}
</style>
