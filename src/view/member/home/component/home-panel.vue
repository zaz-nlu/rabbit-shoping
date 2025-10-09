<template>
  <div class="home-panel">
    <div class="header">
      <h4>{{ title }}</h4>
      <LycMore to="/" />
    </div>

    <!-- 商品列表 -->
    <div class="goods-list">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import LycMore from "@/component/libiray/lyc-more.vue";
import { defineProps } from "vue";

defineOptions({
  name: "MemberHomeOrder",
});

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.home-panel {
  background-color: #fff;
  padding: 0 20px 20px; /* 底部也加padding */
  margin-top: 20px;
  min-height: 300px; /* 改为最小高度，而不是固定高度 */
  border-radius: 8px; /* 添加圆角 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 添加轻微阴影 */
  overflow: hidden; /* 防止内容溢出 */
}

.header {
  height: 66px;
  border-bottom: 1px solid #f5f5f5;
  padding: 18px 0;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.header h4 {
  font-size: 22px;
  font-weight: normal;
  color: #333;
}

/* 商品列表使用flex布局水平排列 */
.goods-list {
  display: flex;
  justify-content: flex-start; /* 改为左对齐 */
  align-items: flex-start;
  gap: 15px; /* 商品之间的间距 */
  padding: 20px 0;
  flex-wrap: wrap; /* 允许换行 */
}

/* 确保每个商品项有合适的宽度 */
.goods-list :deep(.goods-item) {
  flex: 0 0 auto; /* 不伸缩，保持固定宽度 */
  width: calc(25% - 12px); /* 4个商品一行，减去间距 */
  max-width: 220px; /* 最大宽度限制 */
  min-width: 180px; /* 最小宽度 */
}

@media (max-width: 768px) {
  .goods-list {
    flex-direction: column;
    gap: 10px;
  }

  .goods-list :deep(.goods-item) {
    width: 100%;
    max-width: 100%;
    min-width: auto;
  }
}
</style>
