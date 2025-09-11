<template>
  <div class="goods-relevant">
    <div class="header">
      <i class="icon" />
      <span class="title">{{ goodsId ? "相关推荐" : "猜你喜欢" }}</span>
    </div>
    <!-- 此处使用改造后的 xtx-carousel.vue -->
    <LycCarousel autoPlay v-if="sliders.length" :sliders="sliders" />
    <div v-else class="empty">暂无相关推荐商品</div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { findRelevantGoods } from "@/api/product";
import LycCarousel from "@/component/libiray/lyc-carousel.vue";
import { ref } from "vue";

const props = defineProps({
  goodsId: {
    type: [String, Number],
    default: "",
  },
});

const sliders = ref([]);
// 获取相关推荐商品用aysnc来写
// 最终需要的数据是sliders提供给轮播图使用
// 数据结构：sliders=[[4个商品数据]，[4个商品数据]，[4个商品数据]，[4个商品数据]]
const getRecommendList = async () => {
  // 从api获取数据
  const res = await findRelevantGoods({ id: props.goodsId });
  const raw = res.result || [];
  // 将sliders按照上面的数据结构分，保证结构正确
  // 定义一组几个商品
  const pageSize = 4; // 每组4个商品
  const count = Math.ceil(raw.length / pageSize); // 计算需要多少组
  const groups = [];
  for (let i = 0; i < raw.length; i += pageSize) {
    // 第 1 次：slice(0, 4) → 前 4 个
    // 第 2 次：slice(4, 8) → 第 5-8 个
    // 第 3 次：slice(8, 12) → 第 9-12 个
    // 第 4 次：slice(12, 16) → 第 13-16 个
    groups.push(raw.slice(i, i + pageSize));
  }
  sliders.value = groups;
};
getRecommendList();
</script>

<style scoped lang="less">
@xtxColor: #42b983;
@primaryColor: #e93b3d;

.goods-relevant {
  background: #fff;
  min-height: 460px;
  margin-top: 20px;
}

.goods-relevant .header {
  height: 80px;
  line-height: 80px;
  padding: 0 20px;
}

.goods-relevant .title {
  font-size: 20px;
  padding-left: 10px;
}

.icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  border-top: 4px solid @xtxColor;
  border-right: 4px solid @xtxColor;
  box-sizing: border-box;
  position: relative;
  transform: rotate(45deg);
}

.icon:before {
  content: "";
  width: 10px;
  height: 10px;
  position: absolute;
  left: 0;
  top: 2px;
  background: lighten(@xtxColor, 40%);
}
</style>
