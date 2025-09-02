<template>
  <RouterLink :to="`/product/${goods.id}`" class="goods-item">
    <img v-lazy="goods.picture" alt="" />
    <p class="name ellipsis">{{ goods.name }}</p>
    <p class="desc ellipsis">{{ goods.desc }}</p>
    <p class="price">&yen;{{ goods.price }}</p>
  </RouterLink>
</template>

<script setup>
const props = defineProps({
  goods: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});
</script>

<style scoped lang="less">
.goods-item {
  display: block;
  width: 220px;
  padding: 20px 30px;
  text-align: center;
}

/* hover 效果 */
.goods-item:hover {
  /* 原来 .hoverShadow() 混入，替换成具体阴影样式 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.goods-item img {
  width: 160px;
  height: 160px;
}

.goods-item p {
  padding-top: 10px;
}

.goods-item .name {
  font-size: 16px;
}

.goods-item .desc {
  color: #999;
  height: 29px;
}

.goods-item .price {
  color: #f40; /* 原来的 @priceColor，手动写一个变量值 */
  font-size: 20px;
}
</style>
