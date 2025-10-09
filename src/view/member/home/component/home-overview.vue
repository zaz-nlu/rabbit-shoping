<template>
  <!-- 概览 -->
  <div class="home-overview">
    <!-- 用户信息 -->
    <div class="user-meta">
      <div class="avatar">
        <img
          :src="
            userStore.profile.avatar ||
            'https://yanxuan-item.nosdn.127.net/7b8e4a7c4b3e4b3e4b3e4b3e4b3e4b3e.jpg'
          "
          alt="avatar"
        />
      </div>
      <h4>{{ userStore.profile.nickname || userStore.profile.account }}</h4>
    </div>

    <div class="item">
      <a href="javascript:;">
        <span class="iconfont icon-hy"></span>
        <p>会员中心</p>
      </a>
      <a href="javascript:;">
        <span class="iconfont icon-aq"></span>
        <p>安全设置</p>
      </a>
      <a href="javascript:;">
        <span class="iconfont icon-dw"></span>
        <p>地址管理</p>
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { computed } from "vue";
const userStore = useUserStore();
</script>

<style scoped>
.home-overview {
  height: 132px;
  background: linear-gradient(135deg, #ffd8a8 0%, #e8590c 100%);
  display: flex;

  /* 添加过渡效果 */
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  /* 可选：添加阴影效果增强上浮感 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  /* 可选：添加圆角 */
  border-radius: 8px;
}

/* 鼠标悬停时的上浮效果 */
.home-overview:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.user-meta {
  flex: 1;
  display: flex;
  align-items: center;
}

.avatar {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 60px;
}

.avatar img {
  width: 100%;
  height: 100%;
}

.user-meta h4 {
  padding-left: 26px;
  font-size: 18px;
  font-weight: normal;
  color: white;
}

.item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.item a {
  color: white;
  font-size: 16px;
  text-align: center;
}

.item a .iconfont {
  font-size: 32px;
}

.item a p {
  line-height: 32px;
}
</style>
