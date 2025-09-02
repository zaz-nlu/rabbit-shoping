<template>
  <ul class="navs">
    <li class="home"><router-link to="/">首页</router-link></li>
    <li
      v-for="item in categoryStore.list"
      class="menu-item has-layer"
      :key="item.id"
      @mouseenter="activeId = item.id"
      @mouseleave="activeId = null"
    >
      <router-link @click="activeId = null" :to="`/category/${item.id}`">{{
        item.name
      }}</router-link>
      <!-- 改造：使用本组件的局部 state 控制展开，避免与吸附头共用时相互影响 -->
      <div class="layer" :class="{ open: activeId === item.id }">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <router-link
              @click="activeId = null"
              :to="`/category/sub/${sub.id}`"
            >
              <img :src="sub.picture" alt="" />
              <p>{{ sub.name }}</p>
            </router-link>
          </li>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script setup>
// 说明：两个头部（主头 & 吸附头）都会渲染本组件，
// 如果用 Pinia 里的 item.open 共享展开状态，会导致两个导航同时展开。
// 这里改为组件内局部状态 activeId，每个实例互不影响，天然互斥。
import { ref } from "vue";
import { useCategoryStore } from "@/stores/modules/category.js";

const categoryStore = useCategoryStore();
// 当前悬停的一级类目 id（局部 state）
const activeId = ref(null);

// 跳转时在模板中 @click 已置空 activeId，从而关闭下拉层
</script>
<style scoped lang="less">
@xtxColor: #42b983; // 你项目的主题色

/* 导航 */
.navs {
  display: flex;
  gap: 25px;
  /* 确保导航位于轮播等大组件之上，避免下拉被覆盖 */
  position: relative;
  z-index: 3000;
}
.menu-item {
  /* 为每个菜单项建立定位上下文，使 .layer 的 absolute 参照该项 */
  position: relative;
}

.navs li a {
  position: relative;
  font-size: 15px;
  color: #212529;
  padding: 10px 0;
  transition: color 0.2s ease;
}

.navs li a:hover {
  color: #099268; /* 悬停高亮 */
}

/* 下拉层（收起态） */
.layer {
  width: 1240px;
  background-color: #fff;
  position: absolute;
  left: -200px;
  top: 56px;
  height: 0; /* 默认收起 */
  overflow: hidden;
  opacity: 0;
  box-shadow: 0 0 5px #ccc;
  transition: all 0.2s 0.1s; /* 属性时长 0.2s，延迟 0.1s */
  /* 提升下拉层级，确保覆盖首页轮播等区域 */
  z-index: 3050;
}

/* 下拉层内容布局 */
.layer ul {
  display: flex;
  flex-wrap: wrap;
  padding: 0 70px;
  align-items: center;
  height: 124px;
}

.layer ul li {
  width: 110px;
  text-align: center;
}

.layer ul li img {
  width: 60px;
  height: 60px;
}

.layer ul li p {
  padding-top: 10px;
}

/* 普通项：前缀匹配就高亮 */
.navs li a.router-link-active,
.navs li a.router-link-exact-active {
  color: @xtxColor;
  font-weight: 600;
}

/* 首页特殊处理：只有精确匹配时才高亮 */
.navs li.home a.router-link-active {
  /* 覆盖掉前缀匹配导致的高亮 */
  color: #212529;
  font-weight: 400;
}
.navs li.home a.router-link-exact-active {
  color: @xtxColor;
  font-weight: 600;
}

/* 在 <style scoped> 下让父项 hover 生效 */
.layer {
  height: 0;
  opacity: 0;
  transition: all 0.3s;
}

.layer.open {
  height: 124px; // 展开的高度
  opacity: 1;
}
</style>
