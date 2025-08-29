<template>
  <HomePanel title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a
        href="javascript:;"
        @click="toggle(-1)"
        :class="{ disabled: index === 0 }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="point"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </a>
      <a
        href="javascript:;"
        @click="toggle(1)"
        :class="{ disabled: index === 1 }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="point"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
          />
        </svg>
      </a>
    </template>
    <div ref="target" class="box">
      <ul
        ref="box"
        class="list"
        :style="{ transform: `translateX(${-index * 1240}px)` }"
      >
        <li v-for="item in brands" :key="item.id">
          <RouterLink to="/">
            <img v-lazy="item.picture" :alt="item.name" />
          </RouterLink>
        </li>
      </ul>
    </div>
  </HomePanel>
</template>

<script setup>
import HomePanel from "./home-panel.vue";
import { onMounted, ref } from "vue";
import { findBrand } from "@/api/home";
import { useLazyData } from "@/hooks";

const target = ref(null);

const brands = useLazyData(target, findBrand, 10);

// 切换图片效果
const index = ref(0);
const toggle = (step) => {
  const newIndex = index.value + step;
  if (newIndex >= 0 && newIndex < brands.value.length) {
    index.value = newIndex;
  }
};
</script>

<style scoped>
.home-panel {
  background: #f5f5f5;
}

.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
}

.list {
  width: 200%;
  display: flex;
  transition: all 0.5s;
}

.list li {
  margin-right: 10px;
  width: 240px;
}

.list li:nth-child(5n) {
  margin-right: 0;
}

.list li img {
  width: 240px;
  height: 305px;
}
.point {
  width: 36px;
  height: 36px;
  border-radius: 50%; /* 圆形按钮 */
  background: #42b983; /* 半透明黑背景 */
  color: #fff; /* 箭头颜色白色 */
  display: flex; /* 用 flex 居中 svg */
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 8px;
  transition: background 0.3s, transform 0.2s;
}

.point:hover {
  background: #42b983; /* 电商主色高亮 */
  transform: scale(1.1); /* 微微放大 */
}
a.disabled {
  pointer-events: none; /* 禁止点击 */
  cursor: not-allowed;
  opacity: 0.5; /* 半透明，视觉效果更明显 */
}
</style>
