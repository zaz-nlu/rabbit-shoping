<template>
  <header class="login-header">
    <div class="container">
      <div class="logo">
        <RouterLink to="/">
          <img :src="logo" alt="LOGO" />
        </RouterLink>
        <h3 class="sub"><slot /></h3>
      </div>
      <RouterLink class="entry" to="/">
        进入网站首页
        <i class="iconfont icon-angle-right"></i>
        <i class="iconfont icon-angle-right"></i>
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import logo from "@/assets/images/LYC.png";
import { RouterLink } from "vue-router";
</script>

<style scoped lang="less">
@xtbColor: #69db7c;

.login-header {
  background: #dee2e6;
  border-bottom: 1px solid #eee;
  padding: 12px 24px;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px; // logo 和文字间距

  img {
    height: 80px;
    width: auto;
  }

  .sub {
    font-size: 18px;
    font-weight: 500;
    color: #555;
    margin: 0;
  }
}

.entry {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  color: @xtbColor;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;

  i {
    font-size: 14px;
    color: @xtbColor;
  }

  &:hover {
    color: darken(@xtbColor, 10%);
    i {
      color: darken(@xtbColor, 10%);
    }
  }
}
</style>
