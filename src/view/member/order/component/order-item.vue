<template>
  <div class="order-item">
    <!-- 头部信息条 -->
    <div class="head">
      <div class="left">
        <span>下单时间：{{ order.createTime }}</span>
        <span class="sep">订单编号：{{ order.id }}</span>
      </div>
      <div class="right" v-if="order.orderState === 1 && order.countdown > 0">
        <i class="iconfont icon-down-time"></i>
        <span class="muted">付款截止：</span>
        <b class="deadline">{{ timeText }}</b>
      </div>
      <a
        class="del"
        v-if="[5, 6].includes(order.orderState)"
        href="javascript:;"
        >删除</a
      >
    </div>

    <!-- 主体：左商品列表 + 右三列 -->
    <div class="body">
      <!-- 左：商品列表（可多条） -->
      <div class="column goods">
        <ul>
          <li v-for="item in order.skus" :key="item.id" class="goods-line">
            <a class="image" href="javascript:;">
              <img :src="item.image" :alt="item.name" />
            </a>
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="attr ellipsis">
                {{ item.attrsText }}
              </p>
            </div>
            <div class="price">￥{{ item.curPrice }}</div>
            <div class="count">x{{ item.quantity }}</div>
          </li>
        </ul>
      </div>

      <!-- 右：状态 -->
      <div class="column state">
        <p class="state-text" :style="{ color: orderStateColor }">
          {{ orderStateText }}
        </p>
        <p class="pay-type">{{ payTypeText }}</p>
      </div>

      <!-- 右：金额 -->
      <div class="column amount">
        <p class="total">￥{{ order.payMoney }}</p>
        <p class="freight">（含运费：￥{{ order.postFee || 0 }}）</p>
      </div>

      <!-- 右：操作 -->
      <div class="column action">
        <!-- 待付款 -->
        <NButton
          v-if="order.orderState === 1"
          @click="$router.push(`/member/pay?orderId=${order.id}`)"
          type="success"
        >
          立即付款
        </NButton>
        <a
          v-if="order.orderState === 1"
          class="link"
          href="javascript:;"
          @click="handleCancel"
          >取消订单</a
        >

        <!-- 待发货 -->
        <a
          v-if="order.orderState === 2"
          class="link"
          href="javascript:;"
          @click="$router.push(`/product/${order.skus[0].spuId}`)"
          >查看详情</a
        >

        <!-- 待收货 -->
        <NButton
          v-if="order.orderState === 3"
          type="warning"
          @click="handleConfirm"
        >
          确认收货
        </NButton>
        <a
          v-if="order.orderState === 3"
          class="link"
          href="javascript:;"
          @click="handleViewDetail"
          >查看物流</a
        >

        <!-- 待评价 -->
        <NButton
          v-if="order.orderState === 4"
          type="primary"
          @click="handleComment"
        >
          去评价
        </NButton>

        <!-- 已完成 -->
        <a
          v-if="order.orderState === 5"
          class="link"
          href="javascript:;"
          @click="handleViewDetail"
          >查看详情</a
        >

        <!-- 已取消 -->
        <a
          v-if="order.orderState === 6"
          class="link"
          href="javascript:;"
          @click="handleViewDetail"
          >查看详情</a
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { NButton } from "naive-ui";
import { computed } from "vue";
import { usePayTime } from "@/hooks/index.js";
import { onMounted } from "vue";

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
});

// 订单状态文本映射
const orderStateMap = {
  1: "待付款",
  2: "待发货",
  3: "待收货",
  4: "待评价",
  5: "已完成",
  6: "已取消",
};

// 订单状态颜色映射
const orderStateColorMap = {
  1: "#fd7e14", // 待付款 - 橙色
  2: "#40c057", // 待发货 - 绿色
  3: "#1c7ed6", // 待收货 - 蓝色
  4: "#f59f00", // 待评价 - 黄色
  5: "#6b7280", // 已完成 - 灰色
  6: "#6b7280", // 已取消 - 灰色
};

// 支付方式文本映射
const payTypeMap = {
  1: "在线支付",
  2: "货到付款",
};

const orderStateText = computed(
  () => orderStateMap[props.order.orderState] || "未知状态"
);
const orderStateColor = computed(
  () => orderStateColorMap[props.order.orderState] || "#6b7280"
);
const payTypeText = computed(
  () => payTypeMap[props.order.payType] || "在线支付"
);

// 操作方法
const handlePay = () => {
  console.log("立即付款", props.order.id);
  // TODO: 跳转到支付页面
};

const handleViewDetail = () => {
  console.log("查看详情", props.order.id);
  // TODO: 跳转到订单详情页
};

const handleCancel = () => {
  console.log("取消订单", props.order.id);
  // TODO: 调用取消订单接口
};

const { start, timeText } = usePayTime();

onMounted(() => {
  // 只有待付款订单（orderState === 1）且有倒计时才启动
  if (props.order.orderState === 1 && props.order.countdown > 0) {
    start(props.order.countdown);
  }
});
</script>
<style scoped>
:root {
  --border: rgba(0, 0, 0, 0.08);
  --muted: #6b7280;
  --text: #1f2937;
  --orange: #fd7e14; /* 主题橙 */
  --green: #40c057; /* 主题绿 */
}

/* 外层容器（非整卡交互） */
.order-item {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  margin-bottom: 18px;
}

/* 顶部灰条 */
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(180deg, #fafafa, #fff);
  border-bottom: 1px solid var(--border);
  font-size: 13px;
  color: #555;
}
.head .left .sep {
  margin-left: 24px;
}
.head .right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.head .right .muted {
  color: var(--muted);
}
.head .deadline {
  color: var(--orange);
}

/* 主体四列：左边商品列 + 右三列 */
.body {
  display: grid;
  grid-template-columns: 1fr 140px 160px 140px;
  gap: 0;
  padding: 12px 16px;
}

/* 左侧商品列表 */
.column.goods {
  padding-right: 16px;
  border-right: 1px solid var(--border);
}
.column.goods ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.goods-line {
  display: grid;
  grid-template-columns: 72px 1fr 90px 50px;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed var(--border);
}
.goods-line:last-child {
  border-bottom: none;
}

.image {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
}
.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  min-width: 0;
}
.name {
  font-size: 15px;
  color: var(--text);
  font-weight: 600;
  line-height: 1.4;
}
.attr {
  margin-top: 4px;
  font-size: 13px;
  color: var(--muted);
  display: flex;
  gap: 12px;
}
.price {
  text-align: right;
  color: #111827;
  font-weight: 600;
}
.count {
  text-align: center;
  color: var(--muted);
}

/* 右三列公共 */
.column.state,
.column.amount,
.column.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-right: 1px solid var(--border);
}
.column.action {
  border-right: none;
}

/* 状态列 */
.state-text {
  color: var(--green);
  font-weight: 700;
}
.pay-type {
  color: var(--muted);
  margin-top: 6px;
}

/* 金额列 */
.total {
  color: var(--orange);
  font-weight: 700;
  font-size: 16px;
}
.freight {
  color: var(--muted);
  margin-top: 6px;
}

/* 操作列 */
.btn {
  appearance: none;
  border: 1px solid transparent;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn.primary {
  background: var(--green);
  color: #fff;
  border-color: rgba(0, 0, 0, 0.02);
  box-shadow: 0 2px 8px rgba(64, 192, 87, 0.25);
}
.btn.primary:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.link {
  display: block;
  margin-top: 8px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s ease;
}
.link:hover {
  color: var(--orange);
}

/* 文本工具 */
.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式：窄屏堆叠右三列 */
@media (max-width: 960px) {
  .body {
    grid-template-columns: 1fr;
  }
  .column.goods {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 10px;
  }
  .column.state,
  .column.amount,
  .column.action {
    border-right: none;
    border-top: 1px solid var(--border);
    padding: 12px 0;
  }
}
</style>
