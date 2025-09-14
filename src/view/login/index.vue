<template>
  <LoginHeader>欢迎登录</LoginHeader>
  <section class="login-section">
    <div class="wrapper">
      <nav class="login-tabs">
        <a
          href="javascript:;"
          :class="{ active: activeName === 'account' }"
          @click="activeName = 'account'"
          >账户登录</a
        >
        <a
          href="javascript:;"
          :class="{ active: activeName === 'qrcode' }"
          @click="activeName = 'qrcode'"
          >扫码登录</a
        >
      </nav>

      <LoginForm v-if="activeName === 'account'"> </LoginForm>

      <div v-else class="qrcode-box">
        <img src="@/assets/images/login.png" alt="二维码" />
        <p>打开 <a href="javascript:;">小兔鲜App</a> 扫码登录</p>
      </div>
    </div>
  </section>
  <LoginFooter />
</template>
<script setup>
import LoginHeader from "./component/login-header.vue";
import LoginFooter from "./component/login-footer.vue";
import LoginForm from "./component/login-form.vue";
import { useRoute } from "vue-router";

import { useUserStore } from "@/stores/modules/user";
import { ref } from "vue";
const route = useRoute();
const activeName = ref("account");
const store = useUserStore();
store.setRedirectUrl(route.query.redirectUrl || "/");
</script>

<style scoped lang="less">
.login-section {
  background: url(../../assets/images/background.jpg) no-repeat center / cover;
  height: 488px;
  position: relative;
}

.login-section .wrapper {
  width: 380px;
  background: #fff;
  min-height: 400px;
  position: absolute;
  left: 50%;
  top: 54px;
  transform: translate3d(100px, 0, 0);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}

.login-section .wrapper nav {
  height: 55px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  padding: 0 40px;
  text-align: right;
  align-items: center;
}

.login-section .wrapper nav a {
  flex: 1;
  line-height: 1;
  display: inline-block;
  font-size: 18px;
  position: relative;
}

.login-section .wrapper nav a:first-child {
  border-right: 1px solid #f5f5f5;
  text-align: left;
}

.login-section .wrapper nav a:active {
  color: var(--xtbColor);
  font-weight: bold;
}

/* 二维码容器 - 平铺式 */
.qrcode-box {
  display: flex;
  flex-direction: column; /* 纵向排列 */
  align-items: center; /* 水平居中 */
  justify-content: center;
  gap: 20px; /* 元素之间间距 */
  padding: 40px 20px;
  text-align: center;
}

.qrcode-box img {
  max-width: 160px;
  height: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.qrcode-box p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.qrcode-box p a {
  margin-left: 6px;
  color: var(--xtxColor);
  font-size: 16px;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.qrcode-box p a:hover {
  color: #cc9966; /* darken(@xtxColor, 10%) 可以替换成具体颜色 */
}

.login-tabs a.active {
  color: #27ba9b;
}
</style>
