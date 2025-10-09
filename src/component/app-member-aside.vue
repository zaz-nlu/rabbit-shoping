<template>
  <div class="member-aside">
    <n-card title="会员中心" size="small" hoverable class="member-aside-card">
      <n-collapse :default-expanded-names="['account']" accordion>
        <n-collapse-item
          v-for="group in groups"
          :key="group.name"
          :name="group.name"
          :title="group.title"
        >
          <n-space vertical size="small" class="links">
            <RouterLink
              v-for="(link, i) in group.links"
              :key="i"
              :to="link.path"
              class="link-item"
              :class="{ active: isLinkActive(link.path) }"
            >
              {{ link.name }}
            </RouterLink>
          </n-space>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </div>
</template>

<script setup>
import { NCard, NCollapse, NCollapseItem, NSpace } from "naive-ui";
import { RouterLink, useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

// 判断链接是否激活（支持子路由）
const isLinkActive = (path) => {
  const currentPath = route.path;
  // 如果是订单相关路由，只要以 /member/order 开头就算激活
  if (path === "/member/order") {
    return currentPath.startsWith("/member/order");
  }
  // 其他路由精确匹配
  return currentPath === path;
};

const groups = [
  {
    name: "account",
    title: "我的账户",
    links: [
      { name: "个人中心", path: "/member/home" },
      { name: "消息通知", path: "/member/message" },
      { name: "个人信息", path: "/member/profile" },
      { name: "安全设置", path: "/member/security" },
      { name: "地址管理", path: "/member/address" },
      { name: "我的积分", path: "/member/points" },
      { name: "我的足迹", path: "/member/footprint" },
      { name: "邀请有礼", path: "/member/invite" },
      { name: "幸运抽奖", path: "/member/lottery" },
    ],
  },
  {
    name: "trade",
    title: "交易管理",
    links: [
      { name: "我的订单", path: "/member/order" },
      { name: "优惠券", path: "/member/coupon" },
      { name: "礼品卡", path: "/member/giftcard" },
      { name: "评价管理", path: "/member/review" },
      { name: "售后服务", path: "/member/service" },
    ],
  },
  {
    name: "favorite",
    title: "我的收藏",
    links: [
      { name: "收藏的商品", path: "/member/collect/goods" },
      { name: "收藏的专题", path: "/member/collect/topic" },
      { name: "关注的品牌", path: "/member/collect/brand" },
    ],
  },
  {
    name: "help",
    title: "帮助中心",
    links: [
      { name: "帮助中心", path: "/help" },
      { name: "在线客服", path: "/service" },
    ],
  },
];
</script>

<style scoped>
/* 侧边栏容器 - 设置固定宽度 */
.member-aside {
  width: 240px;
  margin-right: 20px;
  flex-shrink: 0;
}

/* 卡片整体样式 */
.member-aside-card {
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

/* 链接样式 */
.link-item {
  display: block;
  line-height: 1.8;
  color: #666;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
}

.link-item:hover {
  color: #27ba9b;
  background-color: #f0f9f6;
}

/* 激活状态的链接 */
.link-item.router-link-active,
.link-item.active {
  color: #27ba9b;
  background-color: #e6f7f1;
  font-weight: 600;
}

/* 折叠面板标题优化（更明显分区感） */
:deep(.n-collapse-item__header-main) {
  font-weight: 600;
  color: #333;
}

:deep(.n-card__content) {
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
