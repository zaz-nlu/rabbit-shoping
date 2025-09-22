<template>
  <div class="cart-sku" ref="rootRef">
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>

    <div class="layer" v-if="visible">
      <div v-if="loading" class="loading"><lycSpining /></div>
      <goodsSku
        @update-sku-info="changeSku"
        v-else
        :goods="goods"
        @close="close"
        :sku-id="props.skuId"
      />
      <NButton @click="submitSku" v-if="!loading" type="primary">确认</NButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { getGoodsSku } from "@/api/cart";
import { NButton, useMessage } from "naive-ui";
import goodsSku from "@/view/goods/component/goods-sku.vue";
import lycSpining from "@/component/libiray/lyc-spining.vue";

const props = defineProps({
  // 传入商品id
  attrsText: {
    type: String,
    required: true,
  },
  skuId: { type: String, required: true },
});

console.log("父组件传来的 skuId ===>", props.skuId);

// 打开
const goods = ref(null);
const loading = ref(false);
const open = async () => {
  visible.value = true;
  loading.value = true;
  const res = await getGoodsSku(props.skuId);
  console.log("res===>", res.result);
  goods.value = res.result;
  loading.value = false;
};

// 关闭
const close = () => {
  visible.value = false;
};

// 切换
const toggle = () => {
  if (!visible.value) {
    open(); // 第一次打开要加载数据
  } else {
    close();
  }
};

// 点击空白处关闭
const rootRef = ref(null);
onClickOutside(rootRef, () => {
  close();
});

const visible = ref(false);

// 切换 SKU
const curSku = ref(null);
const changeSku = (sku) => {
  console.log("收到SKU变化事件，数据:", sku);
  curSku.value = sku;
};

// 向外发出事件，告诉父组件选中了哪个 SKU
const emits = defineEmits(["update-sku-info"]);
const message = useMessage();
const submitSku = () => {
  console.log("点击确认按钮");
  console.log("当前选中的SKU:", curSku.value);
  console.log("原始SKU ID:", props.skuId);
  if (
    curSku.value &&
    curSku.value.skuId &&
    curSku.value.skuId !== props.skuId
  ) {
    // 传递旧的 skuId 和新选择的 SKU 对象
    emits("update-sku-info", props.skuId, curSku.value);
    close();
  } else {
    // 可选：添加提示
    message.error("重新选择组件");
  }
};
</script>

<style scoped>
/* 主题色（把下面的颜色改成你项目的 @xtxColor 即可） */
:root {
  --xtxColor: #27ba9b; /* 自行替换为项目主色 */
}

/* 容器 */
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
}

/* 属性行 */
.cart-sku .attrs {
  line-height: 24px;
  display: flex;
}

/* 文字省略号 */
.cart-sku .attrs .ellipsis {
  max-width: 230px;
  font-size: 14px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 右侧小图标 */
.cart-sku .attrs i {
  margin-left: 5px;
  font-size: 14px;
}

/* 弹层 */
.cart-sku .layer {
  position: absolute;
  left: -1px;
  top: 40px;
  z-index: 10;
  width: 400px;
  border: 1px solid var(--xtxColor);
  /* 原来是 lighten(@xtxColor, 50%)，用半透明阴影替代 */
  box-shadow: 2px 2px 4px rgba(39, 186, 155, 0.5);
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
  padding: 20px;
}

/* 弹层的小三角 */
.cart-sku .layer::before {
  content: "";
  width: 12px;
  height: 12px;
  border-left: 1px solid var(--xtxColor);
  border-top: 1px solid var(--xtxColor);
  position: absolute;
  left: 12px;
  top: -8px;
  background: #fff;
  transform: scale(0.8, 1) rotate(45deg);
}

/* 加载区域（按你的路径） */
.cart-sku .loading {
  height: 224px;
  background: url(../../../assets/images/loading.gif) no-repeat center;
}
</style>
