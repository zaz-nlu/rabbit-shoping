<template>
  <div class="xtx-goods-page">
    <div class="container">
      <!-- 加载中 -->
      <lycSpining
        v-if="loading"
        :size="18"
        color="#999"
        text="加载中...稍安勿躁"
      />

      <!-- 内容区 -->
      <div v-else v-if="goods">
        <!-- 面包屑 -->
        <lycBread>
          <lycBreadItem to="/">首页</lycBreadItem>
          <lycBreadItem :to="`/category/${goods.categories[1].id}`">
            {{ goods.categories[1].name }}
          </lycBreadItem>
          <lycBreadItem :to="`/category/${goods.categories[0].id}`">
            {{ goods.categories[0].name }}
          </lycBreadItem>
          <lycBreadItem>{{ goods.name }}</lycBreadItem>
        </lycBread>

        <!-- 商品信息 -->
        <div class="goods-info">
          <div class="media">
            <GoodsImage :images="goods.mainPictures" />
            <GoodsSales />
          </div>
          <div class="spec">
            <GoodsName :goods="goods" />
            <!-- Sku组件 -->
            <GoodsSku
              :goods="goods"
              :skuId="goods.skuId"
              @update-sku-info="changeSku"
            />

            <!-- 数量选择组件 -->
            <div class="sku-row">
              <lycNumberbox
                label="数量"
                v-model="count"
                :max="goods.inventory"
              />
            </div>
            <!-- 提交按钮 -->
            <div>
              <n-button
                @click="insertCart"
                class="submit-button"
                strong
                secondary
                round
                type="primary"
              >
                加入购物车
              </n-button>
            </div>
          </div>
        </div>

        <!-- 商品推荐 -->
        <GoodsRelevant />

        <!-- 商品详情 -->
        <div class="goods-footer">
          <div class="goods-article">
            <goods-tab
              :goods-id="goods.skuId"
              :detail-html="goods.details"
              @tab-change="onTabChange"
            />
            <goodsWarn />
          </div>
          <!-- 热榜 -->
          <div class="goods-aside">
            <goodsHot />
            <br />
            <goodsHot :type="2" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import GoodsRelevant from "@/view/goods/component/goods-relevant.vue";
import lycBreadItem from "@/component/libiray/lyc-bread-item.vue";
import lycBread from "@/component/libiray/lyc-bread.vue";
import GoodsImage from "@/view/goods/component/goods-image.vue";
import GoodsSales from "@/view/goods/component/goods-sales.vue";
import GoodsName from "@/view/goods/component/goods-name.vue";
import lycSpining from "@/component/libiray/lyc-spining.vue";
import GoodsSku from "@/view/goods/component/goods-sku.vue";
import lycNumberbox from "@/component/libiray/lyc-numberbox.vue";
import goodsTab from "@/view/goods/component/goods-tab.vue";
import goodsHot from "@/view/goods/component/goods-hot.vue";
import goodsWarn from "@/view/goods/component/goods-warn.vue";
import { useMessage } from "naive-ui";
import { useCartStore } from "@/stores/modules/cart.js";
import { useRoute } from "vue-router";
import { findGoods } from "@/api/product.js";
import { provide, ref, watch } from "vue";

// 1.获取商品详情，进行渲染，先定义一个API
const message = useMessage();
const goods = ref(null);
const loading = ref(false);
const route = useRoute();
const useGoods = () => {
  const loadGoods = async (id) => {
    try {
      loading.value = true;
      goods.value = null;
      const res = await findGoods(id);
      goods.value = res.result;
      console.log(res);
      console.log("goods =>", goods.value);
    } catch (error) {
      console.error("Error fetching goods:", error);
    } finally {
      loading.value = false;
    }
  };

  watch(
    () => route.params.id,
    (newVal) => {
      if (newVal && `/product/${newVal}` === route.path) {
        loadGoods(newVal);
      }
    },
    { immediate: true }
  );

  return goods;
};
useGoods();
// 这块利用了父子传值，将子组件的sku信息给父组件，之后父组件再交给购物车
const currSku = ref(null);
const changeSku = (skuInfo) => {
  console.log("skuInfo =>", skuInfo);
  if (skuInfo.skuId) {
    goods.value.price = skuInfo.price;
    goods.value.stock = skuInfo.stock;
    goods.value.skuId = skuInfo.skuId;
  }
  // 记录选择后的SKU，可能有数据也可能没有
  currSku.value = skuInfo;
};
const count = ref(1);
// 利用provide给组件提供goods
provide("goods", goods);

// 加入购物车
const cartStore = useCartStore();
// 购物车的逻辑，首先我们新建一个currSku，然后当你goodsSku组件选择完规格后
// 会把选择的结果通过事件传递给父组件，然后父组件把结果放到currSku里面
// 然后当你点击加入购物车按钮时，就把currSku里面的内容放到pinia里面
const insertCart = async () => {
  // 先看看父值是否被curSku接到了吗，没有就报错
  if (!currSku.value || !currSku.value.skuId) {
    return message.error("请选择完整规格");
  }
  const { skuId, specsText: attrsText, inventory: stock } = currSku.value;
  const { id, name, price, mainPictures } = goods.value || {};
  try {
    await cartStore.insertCart({
      id,
      skuId,
      name,
      attrsText,
      picture: mainPictures?.[0] || "",
      price,
      nowPrice: price,
      selected: true,
      stock,
      count: count.value,
      isEffective: true,
    });
    message.success("已加入购物车");
  } catch (e) {
    console.error("加入购物车失败:", e);
    message.error("加入购物车失败，请稍后再试");
  }
};
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
}

.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}

.goods-tabs {
  min-height: 600px;
  background: #fff;
}

.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}

.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
}

.goods-info .media {
  width: 580px;
  height: 600px;
  padding: 30px 50px;
}

.goods-info .spec {
  flex: 1;
  padding: 30px 30px 30px 0;
}
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  min-height: 600px; /* 给容器一个高度 */
}
.spec {
  display: flex;
  flex-direction: column;
}

.sku-row {
  display: flex;
  align-items: center;
}

.sku-row .label {
  width: 60px;
  color: #999;
}
:deep(.submit-button) {
  width: 30%;
  height: 44px;
  margin-top: 30px;
  font-size: 14px;
  margin-left: 10px;
}
</style>
