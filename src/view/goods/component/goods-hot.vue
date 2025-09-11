<template>
  <n-card class="hot-card" :bordered="false">
    <h3 class="title">{{ title }}</h3>
    <div v-if="goodsList" class="goods-list">
      <GoodsItem v-for="item in goodsList" :key="item.id" :goods="item" />
    </div>
  </n-card>
</template>

<script setup>
import GoodsItem from "@/view/category/component/goods-item.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { findHotsComment } from "@/api/product.js";
// 接收父组件传递的参数
const props = defineProps({
  // 当前类目
  type: {
    type: Number,
    default: 1,
  },
});
const route = useRoute();
const type = { 1: "今日热销", 2: "本周热销", 3: "本月热销" };
const title = computed(() => type[props.type] || "今日热销");
const goodsList = ref([]);
const getHots = async () => {
  try {
    const res = await findHotsComment({
      id: route.params.id,
      limit: 3,
      type: props.type,
    });
    goodsList.value = res.result;
  } catch (error) {
    console.error("Error fetching hot goods:", error);
  }
};
getHots();
</script>

<style scoped>
.hot-card {
  max-width: 320px;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  padding: 16px;
}
.hot-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
  letter-spacing: 0.5px;
  position: relative;
}
.title::after {
  content: "";
  display: block;
  width: 36px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #ff7a45, #ff4d4f);
  margin-top: 6px;
}

.goods-list {
  display: grid;
  gap: 12px;
}
</style>
