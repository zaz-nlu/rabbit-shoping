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
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px; /* 固定宽度，确保 flex 布局正常 */
  padding: 15px;
  text-align: center;
  box-sizing: border-box;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #fff;
  text-decoration: none; /* 去除链接下划线 */
}

/* hover 效果 */
.goods-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.goods-item img {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  display: block; /* 防止图片底部空隙 */
}

.goods-item p {
  width: 100%;
  padding-top: 10px;
  margin: 0;
}

.goods-item .name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
}

.goods-item .desc {
  color: #999;
  height: 40px; /* 固定高度，保持对齐 */
  font-size: 14px;
  line-height: 1.4;
  overflow: hidden; /* 隐藏溢出文本 */
}

.goods-item .price {
  color: #f40;
  font-size: 18px;
  font-weight: 600;
  margin-top: 5px;
}
</style>
