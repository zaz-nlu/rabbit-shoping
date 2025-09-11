<template>
  <n-card class="product-tabs" style="margin-bottom: 16px">
    <n-tabs type="line" animated :theme-overrides="tabTheme">
      <n-tab-pane name="detail" tab="商品详情">
        <goodsDetail></goodsDetail>
      </n-tab-pane>
      <n-tab-pane name="comment">
        <!-- 自定义标签 -->
        <template #tab>
          商品评价 <span class="count">({{ goods.commentCount }})</span>
        </template>
        <goodsComment></goodsComment>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import { NCard, NTabPane } from "naive-ui";
import { onMounted, ref, inject } from "vue";
import goodsDetail from "@/view/goods/component/goods-detail.vue";
import goodsComment from "./good-comment.vue";
// 定义 tab 主题

const tabTheme = {
  Tabs: {
    tabFontSizeLarge: "18px", // tab 字体大一些
    tabGapLarge: "40px", // tab 之间的间距
    tabPaddingLarge: "0 20px", // tab 内边距
    barHeight: "3px", // 下划线粗一些
    barColor: "#2db47a", // 下划线颜色（绿色）
  },
};

const props = defineProps({
  goodsId: {
    type: String,
    required: true,
  },
  detailHtml: {
    type: String,
    required: true,
  },
});
const goods = inject("goods");
</script>

<style scoped lang="less">
.product-tabs {
  max-width: 960px; /* 限定一个合适的宽度 */
  margin: 0 auto 16px; /* 居中 */
}

:deep(.n-tabs .n-tab) {
  font-weight: 500; /* 字重更明显 */
}
</style>
