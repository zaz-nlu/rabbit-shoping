<template>
  <header class="app-header">
    <div class="container">
      <!-- Logo -->
      <h1 class="logo">
        <img src="../assets/images/LYC.png" alt="" />
      </h1>

      <!-- 导航 -->
      <app-header-nav />

      <!-- 搜索框 -->
      <div class="search">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="搜一搜" />
      </div>

      <!-- 购物车 -->
      <div class="cart">
        <a class="curr" href="#">
          <i class="iconfont icon-cart"></i>
          <em>2</em>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup>
import appHeaderNav from "./app.header.nav.vue";
</script>

<style scoped lang="less">
/* 通用重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

img {
  max-height: 8.5rem;
}
a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

/* 头部整体 */
.app-header {
  background: #e9ecef; /* 苹果/亚马逊常用深色背景 */
  height: 6.5rem;
  display: flex;
  align-items: center;
  color: #343a40;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial;
}

.app-header .container {
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* logo */
.logo a {
  font-size: 22px;
  font-weight: bold;
  color: #212529;
}

/* 导航 */
.navs {
  display: flex;
  gap: 25px;
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

/* 搜索框 */
.search {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20px;
  padding: 5px 10px;
}

.search i {
  color: #666;
  margin-right: 5px;
}

.search input {
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
  width: 180px;
}

/* 购物车 */
.cart a {
  position: relative;
  display: flex;
  align-items: center;
  color: #212529;
  font-size: 20px;
}

.cart em {
  position: absolute;
  top: -5px;
  right: -10px;
  background: #f60;
  color: #fff;
  font-size: 12px;
  font-style: normal;
  padding: 2px 6px;
  border-radius: 50%;
}
</style>
