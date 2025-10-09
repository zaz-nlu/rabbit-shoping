<template>
  <div class="xtx-pay-checkout-page">
    <div class="container">
      <lyc-bread>
        <lyc-bread-item to="/">首页</lyc-bread-item>
        <lyc-bread-item to="/cart">购物车</lyc-bread-item>
        <lyc-bread-item>填写订单</lyc-bread-item>
      </lyc-bread>

      <div class="wrapper">
        <!-- 收货地址 -->
        <h3 class="box-title">收货地址</h3>
        <div class="box-body">
          <!-- 收货地址组件 -->
          <checkout-address
            @change="handleAddressChange"
            :list="order.userAddresses"
          />
        </div>

        <!-- 商品信息 -->
        <h3 class="box-title">商品信息</h3>
        <div class="box-body">
          <table class="goods">
            <thead>
              <tr>
                <th width="520">商品信息</th>
                <th width="170">单价</th>
                <th width="170">数量</th>
                <th width="170">小计</th>
                <th width="170">实付</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.goods" :key="item.skuId">
                <td>
                  <a href="javascript:;" class="info">
                    <img :src="item.picture" alt="" />
                    <div class="right">
                      <p>{{ item.name }}</p>
                      <p>{{ item.attrsText }}</p>
                    </div>
                  </a>
                </td>
                <td>&yen;{{ item.price }}</td>
                <td>{{ item.count }}</td>
                <td>&yen;{{ item.totalPrice }}</td>
                <td>&yen;{{ item.totalPayPrice }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 配送时间 -->
        <h3 class="box-title">配送时间</h3>
        <div class="box-body">
          <n-radio-group v-model:value="deliveryTime">
            <n-radio-button value="any"
              >不限送货时间：周一至周日</n-radio-button
            >
            <n-radio-button value="workday"
              >工作日送货：周一至周五</n-radio-button
            >
            <n-radio-button value="weekend"
              >双休日、假日送货：周六至周日</n-radio-button
            >
          </n-radio-group>
        </div>

        <!-- 支付方式 -->
        <h3 class="box-title">支付方式</h3>
        <div class="box-body">
          <n-radio-group v-model:value="payMethod">
            <n-radio-button value="online">在线支付</n-radio-button>
            <n-radio-button value="cod">货到付款</n-radio-button>
          </n-radio-group>
          <span style="color: #999">（货到付款需付5元手续费）</span>
        </div>

        <!-- 金额明细 -->
        <h3 class="box-title">金额明细</h3>
        <div class="box-body">
          <div class="total">
            <dl>
              <dt>商品件数：</dt>
              <dd>{{ order.summary.goodsCount }}件</dd>
            </dl>
            <dl>
              <dt>商品总价：</dt>
              <dd>{{ order.summary.totalPrice }}元</dd>
            </dl>
            <dl>
              <dt>运<i></i>费：</dt>
              <dd>{{ order.summary.postFee }}元</dd>
            </dl>
            <dl>
              <dt>应付总额：</dt>
              <dd class="price">{{ order.summary.totalPayPrice }}元</dd>
            </dl>
          </div>
        </div>

        <!-- 提交订单 -->
        <div class="submit">
          <NButton @click="submitOrder" type="primary">提交订单</NButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import lycBread from "@/component/libiray/lyc-bread.vue";
import lycBreadItem from "@/component/libiray/lyc-bread-item.vue";
import checkoutAddress from "@/view/member/pay/component/checkout-address.vue";
import { useRouter } from "vue-router";
import { NRadioGroup, NRadioButton } from "naive-ui";
import { createOrderAPI, submitOrderAPI } from "@/api/pay";
import { NButton, useMessage } from "naive-ui";
import { reactive, ref } from "vue";

const deliveryTime = ref("any"); // 默认选中不限
const payMethod = ref("online"); // 默认选中在线支付
const message = useMessage();
const router = useRouter();
// 获取订单信息
const order = ref({ goods: [], summary: {} });
const getOrder = async () => {
  const res = await createOrderAPI();

  console.log("[createOrderAPI res]", res);
  console.log("[goods]", res.result?.goods);
  console.log("[goods.length]", res.result?.goods?.length);
  order.value = res.result;
  reqParams.goods = res.result.goods.map((item) => ({
    skuId: item.skuId,
    count: item.count,
  })); // 把商品列表放到结算参数里
};
getOrder();
// 处理地址变更
const addressId = ref(null);
const handleAddressChange = (newAddress) => {
  console.log("选中的地址变更为：", newAddress.id);
  addressId.value = newAddress.id;
  reqParams.addressId = newAddress.id; // 直接在这里同步给提交参数
};

// 结算功能
// 首先我们要写一个对象，对象里存储了当前订单的所有数据
// 我们要把他的字段和后端一样，方便交给后端
const reqParams = reactive({
  deliveryTimeType: 1, // 配送时间：1=不限/2=工作日/3=双休日
  payType: 1, // 支付方式：1=在线支付/2=货到付款
  payChannel: 1, // 支付渠道：1=PC/2=微信/3=支付宝
  buyerMessage: "", // 买家留言
  goods: [],
  addressId: null, // 收货地址 ID
});

// 提交订单
const submitOrder = async () => {
  if (!reqParams.addressId) {
    message.error("亲，请先选择收货地址");
    return;
  }
  const res = await submitOrderAPI(reqParams);
  console.log("[submitOrderAPI res]", res);
  message.success("订单提交成功");
  // 跳转去支付页面，且还要携带订单编号
  router.push(`/member/pay?orderId=${res.result.id}`);
};
</script>

<style scoped lang="less">
@xtxColor: #42b983; // 你想要的高亮颜色
@priceColor: #e93b3d; // 价格颜色
.xtx-pay-checkout-page {
  .wrapper {
    background: #fff;
    padding: 0 20px;
    .box-title {
      font-size: 16px;
      font-weight: normal;
      padding-left: 10px;
      line-height: 70px;
      border-bottom: 1px solid #f5f5f5;
    }
    .box-body {
      padding: 20px 0;
    }
  }

  .goods {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    .info {
      display: flex;
      text-align: left;
      img {
        width: 70px;
        height: 70px;
        margin-right: 20px;
      }
      .right {
        line-height: 24px;
        p {
          &:last-child {
            color: #999;
          }
        }
      }
    }
    tr {
      th {
        background: #f5f5f5;
        font-weight: normal;
      }
    }
    td,
    th {
      text-align: center;
      padding: 20px;
    }
  }
  .my-btn {
    width: 228px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-right: 25px;
    color: #666666;
    display: inline-block;
    &.active,
    &:hover {
      border-color: @xtxColor;
    }
  }
  .total {
    dl {
      display: flex;
      justify-content: flex-end;
      line-height: 50px;
      dt i {
        display: inline-block;
        width: 2em;
      }
      dd {
        width: 240px;
        text-align: right;
        padding-right: 70px;
        &.price {
          font-size: 20px;
          color: @priceColor;
        }
      }
    }
  }
  .submit {
    text-align: right;
    padding: 60px;
    border-top: 1px solid #f5f5f5;
  }
}
</style>
