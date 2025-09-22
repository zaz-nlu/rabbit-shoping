<template>
  <div
    class="cart"
    @mouseenter="showLayer = true"
    @mouseleave="showLayer = false"
  >
    <!-- 购物车图标 -->
    <a class="curr" href="javascript:;">
      <i class="iconfont icon-cart"></i>
      <em class="count">{{ cartStore.validTotal }}</em>
    </a>

    <!-- 下拉购物车层 -->
    <div class="layer" :class="{ show: showLayer }">
      <div class="list">
        <div class="item" v-for="item in cartStore.validList" :key="item.skuId">
          <RouterLink :to="`/product/${item.id}`" class="content">
            <img :src="item.picture" alt="" />
            <div class="center">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="attr ellipsis">{{ item.attrsText }}</p>
            </div>
            <div class="right">
              <p class="price">¥{{ item.nowPrice }}</p>
              <p class="count">×{{ item.count }}</p>
            </div>
          </RouterLink>
          <i
            class="iconfont icon-close-new"
            @click="cartStore.removeCart(item.skuId)"
          ></i>
        </div>
      </div>

      <div class="foot">
        <div class="total">
          <p>共 {{ cartStore.validTotal }} 件商品</p>
          <p>¥{{ cartStore.validAmount }}</p>
        </div>
        <n-button
          @click="router.push('/cart')"
          strong
          secondary
          round
          type="primary"
        >
          去购物车结算
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NButton } from "naive-ui";
import { useCartStore } from "@/stores/modules/cart";
import { useMessage } from "naive-ui";
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();
const cartStore = useCartStore();
const message = useMessage();

// 悬浮层显示控制（之前模板引用 showLayer 未定义导致告警）
const showLayer = ref(false);

// 可选：首次挂载时尝试刷新一次本地价格/库存（未登录）
onMounted(() => {
  cartStore.updateCart().catch((error) => {
    console.warn("[app-header-cart] updateCart failed:", error);
  });
});
</script>

<style scoped lang="less">
/* 触发区 */
.cart {
  position: relative;
  display: inline-block;
  z-index: 999; /* 确保在其他元素之上 */
}

/* 购物车图标与角标 */
.cart a.curr {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  text-decoration: none;
  font-size: 22px;
  transition: color 0.3s;
  height: 40px; /* 明确高度 */
  padding: 0 10px;
}

.cart a.curr:hover {
  color: #42b983;
}

.cart .icon-cart {
  font-size: 26px;
}

.cart .count {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 0 6px;
  line-height: 18px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  min-width: 20px;
  text-align: center;
}

/* 下拉层：默认隐藏 */
.cart .layer {
  position: absolute;
  top: 100%; /* 紧贴底部 */
  right: 0;
  width: 320px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  padding: 10px;
  z-index: 1000;
  margin-top: 8px;

  /* 默认隐藏状态 */
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

/* 显示状态 - 通过 Vue 控制 */
.cart .layer.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* 备用方案：如果 Vue 控制失效，使用 CSS hover */
.cart:hover .layer {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* 列表与条目样式 */
.cart .layer .list {
  max-height: 240px;
  overflow-y: auto;

  /* 美化滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;

    &:hover {
      background: #555;
    }
  }
}

.cart .layer .item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
  position: relative;

  &:last-child {
    border-bottom: 0;
  }

  a {
    display: flex;
    flex: 1;
    text-decoration: none;
  }
}

.cart .layer .item img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  margin-right: 10px;
  object-fit: cover;
}

.cart .layer .item .center {
  flex: 1;
  min-width: 0; /* 防止内容撑开 */
}

.cart .layer .item .center .name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.4;
}

.cart .layer .item .center .attr {
  font-size: 12px;
  color: #888;
}

.cart .layer .item .right {
  text-align: right;
  margin-left: 10px;
}

.cart .layer .item .right .price {
  color: #e1251b;
  font-weight: 700;
  font-size: 14px;
}

.cart .layer .item .right .count {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* 删除按钮 */
.cart .layer .item .icon-close-new {
  margin-left: 8px;
  cursor: pointer;
  color: #aaa;
  font-size: 16px;
  transition: color 0.3s;
  flex-shrink: 0;

  &:hover {
    color: #e1251b;
  }
}

/* 底部汇总 */
.cart .layer .foot {
  padding-top: 10px;
  margin-top: 10px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart .layer .foot .total {
  p {
    margin: 0;
    font-size: 14px;

    &:first-child {
      color: #555;
      margin-bottom: 4px;
    }

    &:last-child {
      color: #e1251b;
      font-weight: 700;
      font-size: 16px;
    }
  }
}

/* 省略样式 */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
