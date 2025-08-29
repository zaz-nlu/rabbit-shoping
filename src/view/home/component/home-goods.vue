<template>
  <div class="goods-item">
    <!-- 修正：RouterLink 的 to 需要动态绑定，使用 :to + 模板字符串 -->
    <RouterLink :to="`/product/${goods.id}`" class="image">
      <img v-lazy="goods.picture" alt="" />
    </RouterLink>
    <!-- 利用 ellipsis来控制显示几行 -->
    <p class="name ellipsis-2">{{ goods.name }}</p>
    <p class="desc ellipsis">{{ goods.desc }}</p>
    <p class="price">&yen;{{ goods.price }}</p>
    <div class="extra">
      <RouterLink to="/">
        <span>找相似</span>
        <span>发现更多宝贝 &gt;</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
// 使用 <script setup> 语法糖：defineProps 是编译期宏，无需 import，
// 只能在 <script setup> 中使用；否则会出现运行时警告与 HMR 报错。
const props = defineProps({
  goods: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});
// 也可直接使用 props.goods，模板里已通过顶层解构名 goods 访问
const { goods } = props;
</script>

<style scoped lang="less">
@xtxColor: #42b983;
@priceColor: #e93b3d;
.goods-item {
  width: 240px;
  height: 300px;
  padding: 10px 30px;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  transition: all 0.5s;
}

.goods-item .image {
  display: block;
  width: 160px;
  height: 160px;
  margin: 0 auto;
}

.goods-item .image img {
  width: 100%;
  height: 100%;
}

.goods-item p {
  margin-top: 6px;
  font-size: 16px;
}

.goods-item .name {
  height: 44px;
}

.goods-item .desc {
  color: #666;
  height: 22px;
}

.goods-item .price {
  margin-top: 10px;
  font-size: 20px;
  color: @priceColor;
}

.goods-item .extra {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 86px;
  width: 100%;
  background: @xtxColor;
  text-align: center;
  transform: translate3d(0, 100%, 0);
  transition: all 0.5s;
}

.goods-item .extra span {
  display: block;
  color: #fff;
  width: 120px;
  margin: 0 auto;
  line-height: 30px;
}

.goods-item .extra span:first-child {
  font-size: 18px;
  border-bottom: 1px solid #fff;
  line-height: 40px;
  margin-top: 5px;
}

.goods-item:hover {
  border-color: @xtxColor;
}

.goods-item:hover .extra {
  transform: none;
}
</style>
