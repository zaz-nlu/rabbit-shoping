<template>
  <div class="xtx-cart-page">
    <div class="container">
      <lycBread>
        <lycBreadItem to="/">首页</lycBreadItem>
        <lycBreadItem>购物车</lycBreadItem>
      </lycBread>
      <div class="cart">
        <table>
          <thead>
            <tr>
              <th width="120">
                <lycCheckbox v-model="cartStore.isCheckAll">全选</lycCheckbox>
              </th>
              <th width="400">商品信息</th>
              <th width="220">单价</th>
              <th width="180">数量</th>
              <th width="180">小计</th>
              <th width="140">操作</th>
            </tr>
          </thead>

          <!-- 有效商品 -->
          <tbody>
            <tr v-for="item in cartStore.validList" :key="item.skuId">
              <td><lycCheckbox v-model="item.selected" /></td>
              <td>
                <div class="goods">
                  <RouterLink :to="`/product/${item.id || item.skuId}`">
                    <img :src="item.picture" alt="" />
                  </RouterLink>
                  <div>
                    <p class="name ellipsis">
                      {{ item.name }}
                    </p>
                    <!-- 选择规格组件 -->
                    <cartSku
                      @update-sku-info="updateSkuInfo"
                      :sku-id="item.skuId"
                      :attrsText="item.attrsText"
                    />
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
                <p v-if="item.price > item.nowPrice">
                  比加入时降价
                  <span class="red">&yen;{{ item.price - item.nowPrice }}</span>
                </p>
              </td>
              <td class="tc">
                <lycNumbox
                  :max="item.stock"
                  @change="updateCart(item.skuId, $event)"
                  v-model="item.count"
                />
              </td>
              <td class="tc">
                <p>
                  &yen;{{
                    Math.round((item.nowPrice * 100 * item.count) / 100)
                  }}
                </p>
              </td>
              <td class="tc">
                <p>
                  <a
                    class="green"
                    href="javascript:;"
                    @click.prevent="confirmDel(item)"
                    >删除</a
                  >
                </p>
                <p><a href="javascript:;">移入收藏夹</a></p>
              </td>
            </tr>
          </tbody>

          <!-- 失效商品 -->
          <tbody v-if="cartStore.invalidList.length > 0">
            <tr>
              <td colspan="6" class="tit">失效商品</td>
            </tr>
            <tr
              v-for="item in cartStore.invalidList"
              :key="item.skuId"
              class="disabled"
            >
              <!-- 原来是 <td>—</td> 现在放复选框 -->
              <td>
                <lycCheckbox v-model="item.selected" />
              </td>
              <td>
                <div class="goods">
                  <img :src="item.picture" alt="" />
                  <div>
                    <p class="name ellipsis">{{ item.name }}</p>
                    <p class="attr ellipsis">{{ item.attrsText }}</p>
                  </div>
                </div>
              </td>
              <td class="tc">
                <p>&yen;{{ item.nowPrice }}</p>
              </td>
              <td class="tc">{{ item.count }}</td>
              <td class="tc">
                <p>
                  &yen;{{
                    Math.round((item.nowPrice * 100 * item.count) / 100)
                  }}
                </p>
              </td>
              <td class="tc">
                <p>
                  <a
                    @click.prevent="confirmDel(item)"
                    class="green"
                    href="javascript:;"
                    >删除</a
                  >
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 操作栏 -->
      <div class="action">
        <div class="batch">
          <lycCheckbox @change="checkAll" v-model="cartStore.isCheckAll"
            >全选</lycCheckbox
          >
          <a @click="selectedDelete(false)" href="javascript:;">删除商品</a>
          <a href="javascript:;">移入收藏夹</a>
          <a @click="selectedDelete(true)" href="javascript:;">清空失效商品</a>
        </div>
        <div class="total">
          共
          <span class="red">{{ cartStore.validTotal }}</span>
          件商品，已选择{{ cartStore.selectedProductTotal }} 件，商品合计：
          <span class="red">&yen;{{ cartStore.selectedAmount }}</span>
          <NButton type="primary">下单结算</NButton>
        </div>
      </div>

      <!-- 猜你喜欢 -->
      <GoodRelevant />
    </div>
  </div>
</template>

<script setup>
import GoodRelevant from "@/view/goods/component/goods-relevant.vue";
import { useDialog, NButton, useMessage } from "naive-ui";
import lycBread from "@/component/libiray/lyc-bread.vue";
import lycBreadItem from "@/component/libiray/lyc-bread-item.vue";
import lycCheckbox from "@/component/libiray/lyc-checkbox.vue";
import { useCartStore } from "@/stores/modules/cart.js";
import lycNumbox from "@/component/libiray/lyc-numberbox.vue";
import cartSku from "./component/cart-sku.vue";

const cartStore = useCartStore();
const message = useMessage();
// 复选框逻辑
const checkAll = (selected) => {
  cartStore.checkAllCart(selected);
};

const dialog = useDialog();

const confirmDel = (item) => {
  const d = dialog.warning({
    title: "确认删除",
    content: `确定删除「${item.name}」吗？`,
    positiveText: "删除",
    negativeText: "取消",
    maskClosable: false,
    async onPositiveClick() {
      try {
        d.loading = true;
        await cartStore.removeCart(item.skuId);
        message.success("已删除");
        // 不 return => 自动关闭
      } catch (e) {
        console.error(e);
        message.error("删除失败，请稍后重试");
        return false; // 阻止关闭
      } finally {
        d.loading = false;
      }
    },
  });
};

const selectedDelete = (isClearing) => {
  const d = dialog.warning({
    title: "确认批量删除",
    content: `确定删除${isClearing ? "所有失效商品" : "所有已选商品"}吗？`,
    positiveText: "批量删除",
    negativeText: "取消",
    maskClosable: false,
    async onPositiveClick() {
      try {
        d.loading = true;
        await cartStore.batchDeleteCart(isClearing);
        message.success("已删除");
      } catch (e) {
        console.error(e);
        message.error("批量删除失败");
        return false;
      } finally {
        d.loading = false;
      }
    },
  });
};

// 更新购物车商品数量
const updateSkuInfo = (oldSkuId, newSku) => {
  cartStore.updateCartSku(oldSkuId, newSku);
};
</script>

<style scoped lang="less">
@priceColor: #42b983;
@xtxColor: #ff424f;
.xtx-cart-page {
  .cart {
    background: #fff;
    margin-top: 20px;
  }
}

/* 居中工具类 */
.tc {
  text-align: center;
  .xtx-numbox {
    margin: 0 auto;
    width: 120px;
  }
}

/* 颜色/字号 */
.red {
  color: @priceColor;
}
.green {
  color: @xtxColor;
}
.f16 {
  font-size: 16px;
}

/* 商品信息单元格布局 */
.goods {
  display: flex;
  align-items: center;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }

  > div {
    width: 280px;
    font-size: 16px;
    padding-left: 10px;

    .attr {
      font-size: 14px;
      color: #999;
    }
  }
}

/* 操作栏 */
.action {
  display: flex;
  background: #fff;
  margin-top: 20px;
  height: 80px;
  align-items: center;
  font-size: 16px;
  justify-content: space-between;
  padding: 0 30px;

  .xtx-checkbox {
    color: #999;
  }

  .batch {
    a {
      margin-left: 20px;
    }
  }

  .red {
    font-size: 18px;
    margin-right: 20px;
    font-weight: bold;
  }
}

/* 标题（如表头上方的小标题占位） */
.tit {
  color: #666;
  font-size: 16px;
  font-weight: normal;
  line-height: 50px;
}

/* 表格 */
table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  line-height: 24px;

  th,
  td {
    padding: 10px;
    border-bottom: 1px solid #f5f5f5;

    &:first-child {
      text-align: left;
      padding-left: 30px;
      color: #999;
    }
  }

  th {
    font-size: 16px;
    font-weight: normal;
    line-height: 50px;
    background: #fff;
  }
}

/* 文本溢出省略 */
.name.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
