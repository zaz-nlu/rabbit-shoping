<template>
  <div class="app-header-sticky" :class="{ show: y >= 78 }">
    <div class="container" v-show="y >= 78">
      <router-link class="logo" to="/"
        ><img src="../assets/images/LYC.png" alt=""
      /></router-link>
      <AppHeaderNav />
      <div class="right">
        <router-link to="/">品牌</router-link>
        <router-link to="/">专题</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useWindowScroll } from "@vueuse/core";
import AppHeaderNav from "./app.header.nav.vue";
// 原生JS实现
// 记录y轴卷曲高度
// const scrollY = ref(0);
// onMounted(() => {
//   window.onscroll = () => {
//     const scroll = document.documentElement.scrollTop;
//     scrollY.value = scroll;
//   };
// });
// 使用 Composition API
const { y } = useWindowScroll();
</script>

<style scoped lang="less">
@xtxColor: #42b983; // 你项目的主题色

.app-header-sticky {
  width: 100%;
  height: 70px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s linear;

  .container {
    display: flex;
    align-items: center;
  }

  .logo {
    width: 200px;
    height: 80px;
    background: url(../assets/images/logo.png) no-repeat right 2px;
    background-size: 160px auto;
  }

  .right {
    width: 220px;
    display: flex;
    text-align: center;
    padding-left: 40px;
    border-left: 2px solid @xtxColor;

    a {
      width: 80px;
      margin-right: 40px;
      font-size: 16px;
      line-height: 1;

      &:hover {
        color: @xtxColor;
      }
    }
  }
}

.show {
  transform: none;
  opacity: 1;
}
</style>
