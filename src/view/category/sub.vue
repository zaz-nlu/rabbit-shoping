<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <subBread />
      <!-- 筛选区 -->
      <subFilter />
      <!-- 商品面板（排序+列表） -->
      <div class="good-list">
        <subSorted @sort-change="sortChange" />
        <!-- 商品展示 -->
        <ul :key="route.params.id">
          <li v-for="goods in goodsList" :key="goods.id">
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <LycInfiniteLoading
          :loading="loading"
          :finished="finished"
          @infinite="getData"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import subBread from "./component/sub-bread.vue";
import subFilter from "./component/sub-filter.vue";
import LycCheckbox from "@/component/libiray/lyc-checkbox.vue";
import subSorted from "./component/sub-sorted.vue";
import GoodsItem from "./component/goods-item.vue";
import LycInfiniteLoading from "@/component/libiray/lyc-infinte-loading.vue";
import { useRoute } from "vue-router";
import { findSubCategoryGoods } from "@/api/category.js";

import { onMounted, ref, watch } from "vue";
const selectedCheckBox = ref(true);
const route = useRoute();
// 加载中
const loading = ref(false);
// 是否加载完毕
const finished = ref(false);
// 商品列表数据
const goodsList = ref([]);

let reqParams = {
  page: 1,
  pageSize: 20,
};
const getData = async () => {
  loading.value = true;
  reqParams.categoryId = route.params.id;
  try {
    const res = await findSubCategoryGoods(reqParams);
    if (res.result.items.length) {
      //有数据就追加数据
      goodsList.value.push(...res.result.items);
      reqParams.page++;
    } else {
      //没有数据就加载完成
      finished.value = true;
    }
    loading.value = false;
  } catch (err) {
    loading.value = false;
  }
};
watch(
  () => route.params.id,
  (newVal) => {
    if (newVal && `/category/sub/${newVal}` === route.path) {
      //切换子类目时，重置数据
      goodsList.value = [];
      reqParams = {
        page: 1,
        pageSize: 20,
      };
      finished.value = false;
      getData();
    }
  }
);
onMounted(() => {
  getData();
});
// 1.更改排序组件的筛选数组，利用里面的条件重新请求数据
const sortChange = (sortParams) => {
  finished.value = false;
  reqParams = { ...reqParams, ...sortParams };
  reqParams.page = 1;
  goodsList.value = [];
  getData();
};
// 2.更改筛选组件的筛选数据，利用里面的条件重新请求数据
</script>

<style scoped lang="less">
.good-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
}
:deep(.lyc-checkbox) {
  padding: 10px;
}

.good-list ul {
  display: flex;
  flex-wrap: wrap;
  padding: 0 5px;
}

.good-list ul li {
  margin-right: 20px;
  margin-bottom: 20px;
}

.good-list ul li:nth-child(5n) {
  margin-right: 0;
}
</style>
