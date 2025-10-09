<template>
  <div class="xtx-pay-page">
    <div class="container">
      <lycBread>
        <lycBreadItem to="/">首页</lycBreadItem>
        <lycBreadItem to="/cart">购物车</lycBreadItem>
        <lycBreadItem>支付订单</lycBreadItem>
      </lycBread>

      <!-- 付款信息 -->
      <div class="pay-info" v-if="order">
        <span class="icon iconfont icon-queren2"></span>
        <div class="tip">
          <p>订单提交成功！请尽快完成支付。</p>
          <p>
            支付还剩 <span>{{ timeText }}</span
            >，超时后将取消订单
          </p>
        </div>
      </div>

      <div class="amount">
        <span>应付总额：</span>
        <span>{{ order && order.payMoney ? order.payMoney : 0 }}元</span>
      </div>

      <!-- 付款方式 -->
      <div class="pay-type">
        <p class="head">选择以下支付方式付款</p>
        <div class="item">
          <p>支付平台</p>
          <a
            @click="activePay = 'wx'"
            :class="{ active: activePay === 'wx' }"
            class="btn wx"
            href="javascript:;"
          ></a>
          <a
            @click="activePay = 'alipay'"
            :class="{ active: activePay === 'alipay' }"
            class="btn alipay"
            :href="alipayUrl"
            target="_blank"
          ></a>
        </div>
        <div class="item">
          <p>支付方式</p>
          <a class="btn" href="javascript:;">招商银行</a>
          <a class="btn" href="javascript:;">工商银行</a>
          <a class="btn" href="javascript:;">建设银行</a>
          <a class="btn" href="javascript:;">农业银行</a>
          <a class="btn" href="javascript:;">交通银行</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useMessage } from "naive-ui";
import { getOrderDetailAPI } from "@/api/pay";
import { usePayTime } from "@/hooks";
import lycBread from "@/component/libiray/lyc-bread.vue";
import lycBreadItem from "@/component/libiray/lyc-bread-item.vue";
import { baseURL } from "@/utils/request";

const route = useRoute();
const message = useMessage();
const activePay = ref("alipay");
const order = ref(null);
// 加载订单详情
const loadOrderDetail = async () => {
  const orderId = route.query.orderId;
  if (!orderId) {
    message.error("订单编号不能为空");
    return;
  }
  try {
    const res = await getOrderDetailAPI(orderId);
    order.value = res.result;
    if (res.result.countdown > -1) {
      start(res.result?.countdown || 0);
    }
  } catch (e) {
    console.error(e);
    message.error("获取订单信息失败，请稍后重试");
  }
};
onMounted(loadOrderDetail);
const { start, timeText } = usePayTime();

// 支付地址
const redirect = encodeURIComponent("http://www.corho.com:8080/#/pay/callback");
const alipayUrl = `${baseURL}/pay/aliPay?orderId=${route.query.orderId}&redirect=${redirect}`;

// route.query.orderId是订单id，redirect是支付成功后跳转的地址，需要进行编码，否则会报错
</script>

<style scoped>
.xtx-pay-page {
  background: #f5f5f5;
  padding: 20px 0;
}

/* 付款信息 */
.pay-info {
  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;
}
.pay-info .icon {
  font-size: 80px;
  color: #1dc779;
}
.pay-info .tip {
  padding-left: 10px;
  flex: 1;
}
.pay-info .tip p:first-child {
  font-size: 20px;
  margin-bottom: 5px;
}
.pay-info .tip p:last-child {
  color: #999;
  font-size: 16px;
}

/* 应付总额 */
.amount {
  background: #fff;
  padding: 20px 80px;
  margin-top: 20px;
}
.amount span:first-child {
  font-size: 16px;
  color: #999;
}
.amount span:last-child {
  color: #e93b3d; /* priceColor */
  font-size: 20px;
}

/* 支付方式 */
.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;
}
.pay-type p {
  line-height: 70px;
  height: 70px;
  padding-left: 30px;
  font-size: 16px;
}
.pay-type .head {
  border-bottom: 1px solid #f5f5f5;
}
.btn {
  width: 150px;
  height: 50px;
  border: 1px solid #e4e4e4;
  text-align: center;
  line-height: 48px;
  margin-left: 30px;
  color: #666;
  display: inline-block;
}
.btn.active,
.btn:hover {
  border-color: #42b983; /* xtxColor */
}

/* 支付平台图标 */
.btn.alipay {
  background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png)
    no-repeat center / contain;
}
.btn.wx {
  background: url("@/assets/images/微信支付.png") no-repeat center / contain;
}
</style>
