<template>
  <div class="member-home">
    <!-- 概览 -->
    <MemberHomeOverview />
    <!-- 收藏 -->
    <MemberHomePanel title="收藏">
      <GoodsItem v-for="item in collect" :key="item.id" :goods="item" />
    </MemberHomePanel>
    <!-- 足迹 -->
    <MemberHomePanel title="足迹">
      <GoodsItem v-for="item in footprint" :key="item.id" :goods="item" />
    </MemberHomePanel>
    <!-- 猜你喜欢 -->
    <GoodsRelevant />
  </div>
</template>

<script setup>
import { ref } from "vue";
import MemberHomeOverview from "./component/home-overview.vue";
import MemberHomePanel from "./component/home-panel.vue";
import GoodsRelevant from "@/view/goods/component/goods-relevant.vue";
import GoodsItem from "@/view/category/component/goods-item.vue";
import request from "@/utils/request";
import { findCollect } from "@/api/member";

// 调用mock接口
request("/my/test", "get").then((res) => {
  console.log(res);
});

// 收藏数据
const collect = ref([]);
const getCollect = async () => {
  const res = await findCollect({
    page: 1,
    pageSize: 10,
    collectType: 1,
  });
  // 正确提取数据：res.result.items
  collect.value = res.result.items;
  console.log("collect =>", collect.value);
};
getCollect();

// 足迹数据
const footprint = ref([]);
const getFootprint = async () => {
  const res = await request("/member/footprint", "get", {
    page: 1,
    pageSize: 10,
  });
  // 正确提取数据：res.result.items
  footprint.value = res.result.items;
  console.log("footprint =>", footprint.value);
};
getFootprint();
</script>

<style scoped>
.member-home {
  padding-bottom: 40px; /* 底部留白 */
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.member-info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

h3 {
  color: #666;
  margin-bottom: 10px;
}

/* 确保概览组件有上边距 */
:deep(.member-home-overview) {
  margin-bottom: 20px;
}

/* 确保每个面板之间有足够间距 */
:deep(.home-panel) {
  margin-bottom: 30px; /* 面板之间的间距 */
}

:deep(.goods-relevant) {
  --card-radius: 14px;
  --card-bg: rgba(255, 255, 255, 0.72);
  --card-border: 1px solid rgba(0, 0, 0, 0.06);
  --shadow-sm: 0 2px 14px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.15);
  --hairline: linear-gradient(180deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0));
  --accent: #0a84ff; /* 低饱和蓝，苹果系 */
  --muted: #6b7280;

  border-radius: var(--card-radius);
  border: var(--card-border);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  backdrop-filter: saturate(120%) blur(6px);
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.65),
      rgba(255, 255, 255, 0.85)
    ),
    radial-gradient(
      1000px 200px at 50% -120px,
      rgba(10, 132, 255, 0.06),
      transparent
    );
}
.goods-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* 头部：细分割线 + 极浅渐变 */
:deep(.goods-relevant .header) {
  background: linear-gradient(180deg, #fafafa 0%, #fff 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 16px 28px;
}

/* 标题：中性粗细，轻色 */
:deep(.goods-relevant .title) {
  font-weight: 600;
  letter-spacing: 0.2px;
  color: #1f2937;
}

/* 滑动区域：更宽的呼吸感 */
:deep(.goods-relevant .slider) {
  padding: 24px 32px;
  gap: 18px;
}

/* 卡片：玻璃卡 + 微动效 */
:deep(.goods-relevant .slider a) {
  background: var(--card-bg);
  border-radius: 16px;
  border: var(--card-border);
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.35s ease,
    border-color 0.35s ease,
    filter 0.35s ease;
  overflow: hidden;
  margin: 0 10px;
  will-change: transform, box-shadow;
}

:deep(.goods-relevant .slider a:hover) {
  transform: translateY(-6px) scale(1.01);
  box-shadow: var(--shadow-lg);
  border-color: rgba(10, 132, 255, 0.18);
  filter: saturate(108%);
}

/* 图片：充满+轻对比，圆角更柔 */
:deep(.goods-relevant .slider a img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
  filter: contrast(1.02) brightness(1.02);
  transition:
    transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
    filter 0.35s ease;
}

:deep(.goods-relevant .slider a:hover img) {
  transform: scale(1.03);
  filter: contrast(1.06) brightness(1.04);
}

/* （可选）卡片内文信息层：标题/价格的苹果式排版 */
:deep(.goods-relevant .slider a .meta) {
  padding: 14px 14px 16px;
}
:deep(.goods-relevant .slider a .meta .name) {
  font-weight: 600;
  color: #111827;
  line-height: 1.35;
}
:deep(.goods-relevant .slider a .meta .sub) {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
}
:deep(.goods-relevant .slider a .meta .price) {
  margin-top: 10px;
  font-weight: 600;
  color: #0b1220;
}

/* 导航箭头/指示点（若存在对应类名时会生效，不会破坏结构） */
:deep(.goods-relevant .arrow) {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(6px);
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}
:deep(.goods-relevant .arrow:hover) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(10, 132, 255, 0.22);
}

:deep(.goods-relevant .dots .dot) {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.18);
  transition:
    transform 0.25s ease,
    background 0.25s ease;
}
:deep(.goods-relevant .dots .dot.active) {
  transform: scale(1.3);
  background: var(--accent);
}
</style>
