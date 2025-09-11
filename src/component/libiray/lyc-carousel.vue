<template>
  <div
    class="xtx-carousel"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 轮播图容器 -->
    <ul class="carousel-body">
      <li
        class="carousel-item"
        v-for="(item, i) in props.sliders"
        :key="i"
        :class="{ fade: i === index }"
      >
        <!-- 图片轮播图 -->
        <RouterLink v-if="item.imgUrl" to="/">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
        <!-- 新版本里面应该放商品列表 -->
        <div v-else class="slider">
          <RouterLink
            v-for="goods in item"
            :key="goods.id"
            :to="`/product/${goods.id}`"
          >
            <img :src="goods.picture" alt="" />
            <p class="name ellipsis">{{ goods.name }}</p>
            <p class="price">￥{{ goods.price }}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <!-- 上一张 -->
    <a href="javascript:;" class="carousel-btn prev" @click="toggle('prev')">
      <i class="iconfont icon-angle-left"></i>
    </a>
    <!-- 下一张 -->
    <a href="javascript:;" class="carousel-btn next" @click="toggle('next')">
      <i class="iconfont icon-angle-right"></i>
    </a>
    <!-- 五个点 -->
    <div class="carousel-indicator">
      <!-- 利用active来激活点， -->
      <!-- index和i控制当前展示的轮播图 -->
      <!-- i是v-for遍历时候的下标,index是当前展示的轮播图下标,二者相等,则激活该点 -->
      <!--  { id: 1, imgUrl: "banner1.png" },
            { id: 2, imgUrl: "banner2.png" },
            { id: 3, imgUrl: "banner3.png" } 这样的,index.value=0时,i===index,这样就可以加上active类,点被激活,然后
             index.value===1时候 i1!===index.value i2===index,i3!==index.value, i===2这个点激活-->
      <span
        @click="index = i"
        v-for="(item, i) in props.sliders"
        :key="item.id"
        :class="{ active: i === index }"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, watch } from "vue";
import { defineProps } from "vue";
import { ref } from "vue";

const props = defineProps({
  // sliders用于接收后端返回的轮播图数据，然后传给轮播图
  sliders: {
    type: Array,
    default: () => [],
  },
  autoPlay: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 3000,
  },
});
// 定义一个响应式变量，用于记录当前展示的轮播图下标
const index = ref(0);

// 定义一个timer,,然后控制时间自动播放,这里是自动轮播的逻辑
let timer = null;
const autoPLAY = () => {
  // 每次都清空一下
  clearInterval(timer);
  timer = setInterval(() => {
    index.value++;
    if (index.value > props.sliders.length - 1) {
      index.value = 0;
    }
  }, props.duration);
};
// 时间开始播放的条件:1.autoplay为true,2.sliders得有数据
// 因为要时刻观察sliders的变化,所以用watch
watch(
  () => props.sliders,
  (newVal) => {
    if (props.autoPlay && newVal.length) {
      autoPLAY();
    }
  },
  { immediate: true }
);
// 关于鼠标进入暂停自动轮播,离开开启自动播放
const carousel = ref(null);
const handleMouseEnter = () => {
  clearInterval(timer);
  timer = null;
};
const handleMouseLeave = () => {
  if (props.autoPlay && props.sliders.length) {
    autoPLAY();
  }
};

// 关于用按钮控制轮播图
const toggle = (direction) => {
  clearInterval(timer);
  timer = null;
  if (direction === "prev") {
    index.value--;
    if (index.value < 0) {
      index.value = props.sliders.length - 1;
    }
  } else {
    index.value++;
    if (index.value > props.sliders.length - 1) {
      index.value = 0;
    }
  }
};
// 关于组件卸载时清理定时器
onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped lang="less">
@priceColor: #e93b3d;
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
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
}

.slider a {
  width: 240px;
  text-align: center;
}

.slider a img {
  padding: 20px;
  width: 230px !important;
  height: 230px !important;
}

.slider .name {
  font-size: 16px;
  color: #666;
  padding: 0 40px;
}

.slider .price {
  font-size: 16px;
  color: @priceColor;
  margin-top: 15px;
}
</style>
