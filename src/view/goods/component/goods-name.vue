<template>
  <div>
    <p class="g-name">{{ goods.name }}</p>
    <p class="g-desc">{{ goods.desc }}</p>
    <p class="g-price">
      <span>{{ goods.price }}</span>
      <span>{{ goods.oldPrice }}</span>
    </p>

    <div class="g-service">
      <dl>
        <dt>促销</dt>
        <dd>12月好物放送，App领券购买直降120元</dd>
      </dl>
      <dl>
        <dt>配送</dt>
        <dd>
          至<lycCity @change="changeCity" :full-location="fullLocation" />
        </dd>
      </dl>
      <dl>
        <dt>服务</dt>
        <dd>
          <span>无忧退货</span>
          <span>快速退款</span>
          <span>免费包邮</span>
          <a href="javascript:;">了解详情</a>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script setup>
import lycCity from "@/component/libiray/lyc-city.vue";
import { ref } from "vue";
const props = defineProps({
  goods: {
    type: Object,
    default: () => ({}),
  },
});
// 没登陆默认显示四项数据
const provinceCode = ref("110000");
const cityCode = ref("119900");
const countyCode = ref("110101");
const fullLocation = ref("北京市 市辖区 东城区");
// 若登录了，则显示用户的地址信息
if (props.goods.userAddress) {
  const defaultAddress = props.goods.userAddress.find((item) => {
    return item.isDefault === 1;
  });
  if (defaultAddress) {
    provinceCode.value = defaultAddress.provinceCode;
    cityCode.value = defaultAddress.cityCode;
    countyCode.value = defaultAddress.countyCode;
    fullLocation.value = defaultAddress.fullLocation;
  }
}
// 监听城市选择变化
const changeCity = (newLocation) => {
  provinceCode.value = newLocation.provinceCode;
  cityCode.value = newLocation.cityCode;
  countyCode.value = newLocation.countyCode;
  fullLocation.value = newLocation.fullLocation;
};
</script>

<style scoped>
.g-name {
  font-size: 22px;
}

.g-desc {
  color: #999;
  margin-top: 10px;
}

.g-price {
  margin-top: 10px;
}

.g-price span::before {
  content: "¥";
  font-size: 14px;
}

.g-price span:first-child {
  color: var(--priceColor, #e1251b); /* 用 CSS 变量兜底 */
  margin-right: 10px;
  font-size: 22px;
}

.g-price span:last-child {
  color: #999;
  text-decoration: line-through;
  font-size: 16px;
}

.g-service {
  background: #f5f5f5;
  width: 500px;
  padding: 20px 10px 0 10px;
  margin-top: 10px;
}

.g-service dl {
  padding-bottom: 20px;
  display: flex;
  align-items: center;
}

.g-service dt {
  width: 50px;
  color: #999;
}

.g-service dd {
  color: #666;
}

.g-service dd:last-child span {
  margin-right: 10px;
}

.g-service dd:last-child span::before {
  content: "•";
  color: var(--xtxColor, #27ba9b);
  margin-right: 2px;
}

.g-service dd:last-child a {
  color: var(--xtxColor, #27ba9b);
}
</style>
