<template>
  <div class="goods-image">
    <div class="middle">
      <!-- 将小图的索引和大图同步 -->
      <img :src="images[currIndex]" alt="" />
    </div>
    <ul class="small">
      <li
        v-for="(img, i) in images"
        :key="img"
        :class="{ active: i === currIndex }"
      >
        <img @mouseenter="currIndex = i" :src="img" alt="" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});
// 默认索引从0开始
const currIndex = ref(0);
</script>

<style scoped>
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
}

.goods-image .middle {
  width: 400px;
  height: 400px;
  background: #f5f5f5;
}

.goods-image .small {
  width: 80px;
}

.goods-image .small li {
  width: 68px;
  height: 68px;
  margin-left: 12px;
  margin-bottom: 15px;
  cursor: pointer;
}

.goods-image .small li:hover,
.goods-image .small li.active {
  border: 2px solid #42b983; /* @xtxColor 替换为具体颜色 */
}
</style>
