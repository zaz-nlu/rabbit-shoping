<template>
  <div ref="target" class="home-product">
    <!-- 修正：title 需要动态绑定，使用 :title="item.name" 而非字符串字面量 -->
    <HomePanel :title="item.name" v-for="item in productList" :key="item.id">
      <template v-slot:right>
        <div class="sub">
          <!-- 修正：to 需为动态绑定 + 模板字符串 -->
          <RouterLink
            v-for="sub in item.children"
            :key="sub.id"
            :to="`/category/sub/${sub.id}`"
            >{{ sub.name }}</RouterLink
          >
        </div>
        <LycMore :path="`/category/${item.id}`" />
      </template>
      <div class="box">
        <!-- 修正：to 使用动态绑定模板字符串 -->
        <RouterLink class="cover" :to="`/category/${item.id}`">
          <img v-lazy="item.picture" alt="" />
          <strong class="label">
            <span>{{ item.name }}馆</span>
            <span>{{ item.sale }}</span>
          </strong>
        </RouterLink>
        <ul class="goods-list">
          <li v-for="i in item.goods" :key="i.id">
            <HomeGoods :goods="i" />
          </li>
        </ul>
      </div>
    </HomePanel>
  </div>
</template>
<script setup>
import { useLazyData } from "@/hooks";
import HomeGoods from "./home-goods.vue";
import HomePanel from "./home-panel.vue";
import { ref } from "vue";
// 修复：api/home.js 未默认导出，使用具名导出 findProduct
import { findProduct } from "@/api/home";
// 修复：重复导入会导致 “Identifier 'LycMore' has already been declared” 报错
import LycMore from "@/component/libiray/lyc-more.vue";

const target = ref(null);
const productList = useLazyData(target, findProduct);
</script>

<style scoped lang="less">
@xtxColor: #42b983;
.home-product {
  background: #fff;
  height: 2900px;
}

.home-product .sub {
  margin-bottom: 2px;
}

.home-product .sub a {
  padding: 2px 12px;
  font-size: 16px;
  border-radius: 4px;
}

.home-product .sub a:hover {
  background: @xtxColor;
  color: #fff;
}

.home-product .sub:last-child {
  margin-right: 80px;
}

.home-product .box {
  display: flex;
}

.home-product .box .cover {
  width: 240px;
  height: 610px;
  margin-right: 10px;
  position: relative;
}

.home-product .box .cover img {
  width: 100%;
  height: 100%;
  //   裁切多余部分，保证图片能完全填满容器
  object-fit: cover;
}

.home-product .label {
  width: 188px;
  height: 66px;
  display: flex;
  font-size: 18px;
  color: #fff;
  line-height: 66px;
  font-weight: normal;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate3d(0, -50%, 0);
}

.home-product .label span {
  text-align: center;
}

.home-product .label span:first-child {
  width: 76px;
  background: rgba(0, 0, 0, 0.9);
}

.home-product .label span:last-child {
  flex: 1;
  background: rgba(0, 0, 0, 0.7);
}

.home-product .goods-list {
  width: 990px;
  display: flex;
  flex-wrap: wrap;
}

.home-product .goods-list li {
  width: 240px;
  height: 300px;
  margin-right: 10px;
  margin-bottom: 10px;
}

.home-product .goods-list li:nth-last-child(-n + 4) {
  margin-bottom: 0;
}

.home-product .goods-list li:nth-child(4n) {
  margin-right: 0;
}
</style>
