<template>
  <ul class="navs">
    <li class="home"><router-link to="/">首页</router-link></li>
    <li
      v-for="item in categoryStore.list"
      class="menu-item has-layer"
      :key="item.id"
      @mouseenter="categoryStore.showMenu(item.id)"
      @mouseleave="categoryStore.hideMenu(item.id)"
    >
      <router-link
        @click="categoryStore.hideMenu(item.id)"
        :to="`/category/${item.id}`"
        >{{ item.name }}</router-link
      >
      <div class="layer" :class="{ open: item.open }">
        <ul>
          <li v-for="sub in item.children" :key="sub.id">
            <router-link
              @click="categoryStore.hideMenu(item.id)"
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
import { useCategoryStore } from "@/stores/modules/category.js";

const categoryStore = useCategoryStore();

// 现在的问题是跳转的时候不会关闭二级类目，我们要定义一个布尔值open，放到一级菜单就是true，放到二级就是false
// 1.pinia每个分类加上open数据
// 2，pinia提供显示和隐藏函数
// 3.在组件中调用这些函数
console.log("id =>", categoryStore.$id, "keys =>", Object.keys(categoryStore));
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
