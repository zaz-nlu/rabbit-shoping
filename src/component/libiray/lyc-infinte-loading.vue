<template>
  <div class="xtx-infinite-loading" ref="target">
    <div class="loading" v-if="loading">
      <LycSpining :size="28" text="正在加载中..." />
    </div>
    <div class="none" v-if="finished">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>

<script setup>
import LycSpining from "./lyc-spining.vue";
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
// 对外暴露两个控制属性：loading / finished
const props = defineProps({
  loading: { type: Boolean, default: false },
  finished: { type: Boolean, default: false },
});
const emit = defineEmits();
const target = ref(null);
const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      // 加载数据，条件是请求加载完成，数据加载完毕
      if (!props.loading && !props.finished) {
        // 之后去父组件sub那边加载触发事件getData
        emit("infinite");
        console.log("触发无限加载");
      }
    }
  },
  {
    threshold: 0,
  }
);
</script>

<style scoped lang="less">
.xtx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
  }
}

.none {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;

  .img {
    width: 200px;
    height: 134px;
    background: url(../../assets/images/loading.png) no-repeat center / contain;
  }

  .text {
    color: #999;
    font-size: 16px;
  }
}
</style>
