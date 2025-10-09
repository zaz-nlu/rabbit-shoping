<template>
  <div class="xtx-pay-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem to="/cart">购物车</XtxBreadItem>
        <XtxBreadItem>支付结果</XtxBreadItem>
      </XtxBread>
      <!-- 支付结果 -->
      <div class="pay-result" v-if="order">
        <span
          v-if="$route.query.payResult"
          class="iconfont icon-queren2 green"
        ></span>
        <span v-else class="iconfont icon-shanchu red"></span>
        <p class="tit">
          订单支付{{ $route.query.payResult ? "成功" : "失败" }}
        </p>
        <p class="tip">我们将尽快为您发货，收货期间请保持手机畅通</p>
        <p>支付方式：<span>支付宝支付</span></p>
        <p>
          支付金额：<span class="red"
            >¥{{ order && order.payMoney ? order.payMoney : 0 }}</span
          >
        </p>
        <div class="btn">
          <NButton
            @click="$router.push('/member/order')"
            type="primary"
            style="margin-right: 20px"
            >查看订单</NButton
          >
          <NButton @click="$router.push('/')" type="gray">进入首页</NButton>
        </div>
        <div class="alert">
          <span class="iconfont icon-tip"></span>
          <p>
            温馨提示：LYC货郎不会以订单异常、系统升级为由，要求您点击任何网址链接进行退款操作，保护资金，请谨慎操作。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getOrderDetailAPI } from "@/api/pay";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { NButton } from "naive-ui";

const route = useRoute();
const order = ref(null);
const getOrderDetail = async () => {
  const res = await getOrderDetailAPI(route.query.orderId);
  order.value = res.result;
};

onMounted(() => {
  getOrderDetail();
});
</script>

<style scoped lang="less">
@xtxColor: #42b983; // 你想要的高亮颜色
.pay-result {
  padding: 100px 0;
  background: #fff;
  text-align: center;
}

.pay-result .iconfont {
  font-size: 100px;
}

.pay-result .green {
  color: #1dc779;
}

.pay-result .red {
  color: var(--priceColor);
}

.pay-result .tit {
  font-size: 24px;
}

.pay-result .tip {
  color: #999;
}

.pay-result p {
  line-height: 40px;
  font-size: 16px;
}

.pay-result .btn {
  margin-top: 50px;
}

.pay-result .alert {
  font-size: 12px;
  color: #999;
  margin-top: 50px;
}
</style>
