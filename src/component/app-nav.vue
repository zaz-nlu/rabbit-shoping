<template>
  <nav class="app-topnav">
    <ul>
      <!-- 如果已登录 -->
      <li v-if="userStore.profile.token">
        <i class="iconfont icon-user"></i> {{ userStore.profile.account }}
      </li>
      <li v-if="userStore.profile.token">
        <a @click="logout" href="javascript:;">退出登录</a>
      </li>

      <!-- 如果未登录 -->
      <li v-else>
        <router-link to="/login">请先登录</router-link>
        <router-link to="/register">免费注册</router-link>
      </li>

      <!-- 公共部分 -->
      <li><router-link to="/help">帮助中心</router-link></li>
      <li><router-link to="/about">关于我们</router-link></li>
      <li><router-link to="/orders">我的订单</router-link></li>
      <li>
        <router-link to="/profile">会员中心</router-link>
      </li>
      <li>
        <a href="javascript:;"> <i class="iconfont icon-phone"></i> 手机版 </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { useMessage } from "naive-ui";
import { useCartStore } from "@/stores/modules/cart";
import { useRouter } from "vue-router";
//利用pinia存储用户信息,之后利用token来判断，能否登录
const userStore = useUserStore();
const cartStore = useCartStore();
const message = useMessage();

// 退出登录
const router = useRouter();
const logout = () => {
  userStore.setUser({}); // 清空用户信息
  cartStore.clearCart([]); // 清空购物车
  message.success("退出登录成功");
  router.push("/login");
};
</script>

<style scoped lang="less">
@txtColor: #42b983; // 你想要的高亮颜色

.app-topnav {
  background: #495057;
  width: 100%;

  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;

    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;

        i {
          font-size: 14px;
          margin-right: 2px;
        }

        &:hover {
          color: @txtColor;
        }
      }

      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}
// ~ li 作用：选择当前选择器后台的所有元素
// 本例中相当于 .app-topnav li 后面的所有li都加波浪线在左侧形成 a|b|c这样的形势
</style>
