<template>
  <div class="xtx-carousel">
    <!-- 轮播图容器 -->
    <ul class="carousel-body">
      <li
        class="carousel-item"
        v-for="(item, i) in props.sliders"
        :key="i"
        :class="{ fade: i === index }"
      >
        <RouterLink to="/">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
      </li>
    </ul>
    <!-- 上一张 -->
    <a href="javascript:;" class="carousel-btn prev">
      <i class="iconfont icon-angle-left"></i>
    </a>
    <!-- 下一张 -->
    <a href="javascript:;" class="carousel-btn next">
      <i class="iconfont icon-angle-right"></i>
    </a>
    <!-- 五个点 -->
    <div class="carousel-indicator">
      <!-- 利用active来激活点， -->
      <span
        v-for="(item, i) in props.sliders"
        :key="item.id"
        :class="{ active: i === index }"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { ref } from "vue";

const props = defineProps({
  // sliders用于接收后端返回的轮播图数据，然后传给轮播图
  sliders: {
    type: Array,
    default: () => [],
  },
});
const index = ref(0);
</script>

<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;

  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }

    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      // 一开始每个轮播图透明度都是0，然后累加放在一起，之后加入fade，不断给轮播图透明度变成1，z-index变成1这样来显示不同的图片，显示那个图片给那个图片加fade
      &.fade {
        opacity: 1;
        z-index: 1;
      }

      img {
        width: 100%;
        height: 100%;
      }
    }

    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;

      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #fff;
        opacity: 0.5;
        margin: 0 6px;
      }

      .active {
        opacity: 1;
      }
    }

    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;

      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }

  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
</style>
