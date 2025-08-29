<template>
  <div class="home-skeleton">
    <div class="item" v-for="i in 4" :key="i" :style="{ backgroundColor: bg }">
      <LycSkeleton bg="#e4e4e4" width="306px" height="306px" animated />
      <LycSkeleton bg="#e4e4e4" width="160px" height="24px" animated />
      <LycSkeleton bg="#e4e4e4" width="120px" height="24px" animated />
    </div>
  </div>
</template>

<script>
import LycSkeleton from "@/component/libiray/lyc-skeleton.vue";

export default {
  name: "HomeSkeleton",
  components: { LycSkeleton },
  props: {
    bg: {
      type: String,
      default: "#fff",
    },
  },
};
</script>

<style scoped lang="less">
.home-skeleton {
  width: 1240px;
  height: 406px;
  display: flex;
  justify-content: space-between;

  .item {
    width: 306px;
    // 作用到子组件根元素（.xtx-skeleton）的相邻骨架块
    :deep(.xtx-skeleton + .xtx-skeleton) {
      display: block;
      margin: 16px auto 0;
    }
  }
}
</style>
