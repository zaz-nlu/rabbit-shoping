<template>
  <div class="order-detail">
    <h1>订单详情</h1>
    <p>当前订单ID: {{ orderId }}</p>

    <!-- 测试链接 -->
    <div style="margin-top: 20px">
      <router-link to="/member/order/1001">查看订单1001</router-link>
      <br />
      <router-link to="/member/order/1002">查看订单1002</router-link>
      <br />
      <router-link to="/member/order">返回订单列表</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// 获取路由参数中的订单ID
const orderId = computed(() => route.params.id);
</script>

<style scoped>
.order-detail {
  min-height: 500px;
}

.order-status {
  padding: 30px 0;
}

.order-info,
.goods-list,
.order-amount {
  margin-top: 20px;
}

.order-info h3,
.goods-list h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.order-amount {
  max-width: 400px;
  margin-left: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.amount-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.amount-item.total {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.amount-item .price {
  font-weight: 600;
  color: #f40;
}

.amount-item .price.discount {
  color: #52c41a;
}

.order-actions {
  text-align: right;
  padding-top: 20px;
}
</style>
