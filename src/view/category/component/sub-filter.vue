<template>
  <!-- 加载中 -->
  <div class="sub-filter loading" v-if="filterLoading">
    <Spinner :size="28" text="筛选项加载中..." />
  </div>

  <!-- 有数据 -->
  <div class="sub-filter" v-else-if="filterData">
    <!-- 品牌 -->
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          href="javascript:void(0)"
          @click="changeFilter(brand.id)"
          :class="{ active: brand.id === filterData.brands.selectedBrand }"
          v-for="brand in filterData.brands"
          :key="brand.id ?? 'all'"
        >
          {{ brand.name }}
        </a>
      </div>
    </div>

    <!-- 销售属性 -->
    <div class="item" v-for="sp in filterData.saleProperties" :key="sp.id">
      <div class="head">{{ sp.name }}：</div>
      <div class="body">
        <a
          @click="changeProp(sp, prop.id)"
          href="javascript:void(0)"
          :class="{ active: sp.selectedAttr === prop.id }"
          v-for="prop in sp.properties"
          :key="prop.id ?? 'all'"
        >
          {{ prop.name }}
        </a>
      </div>
    </div>
  </div>

  <!-- 空态/失败兜底（可选） -->
  <div class="sub-filter empty" v-else>暂无可用的筛选条件</div>
</template>

<script setup>
import Spinner from "@/component/libiray/lyc-spining.vue";
import { useRoute } from "vue-router";
import { findSubCategoryFilter } from "@/api/category";
import { ref, watch } from "vue";
// 监听二级类目ID便变化获取筛选数据
const route = useRoute();
const filterData = ref(null);
const filterLoading = ref(false);
watch(
  () => route.params.id,
  (newVal) => {
    if (newVal && `/category/sub/${newVal}` === route.path) {
      filterLoading.value = true;
      // 发送请求获取筛选数据
      const data = async () => {
        try {
          const res = await findSubCategoryFilter(route.params.id);
          res.result.brands.selectedBrand = null;
          console.log("res =>", res.result);
          //  1.给每个品牌都加上全部
          res.result.brands.unshift({ id: null, name: "全部" }); //加null因为不参与筛选
          //  2.给每个选项加上全部
          res.result.saleProperties.forEach((item) => {
            item.selectedAttr = null;
            item.properties.unshift({ id: null, name: "全部" });
          });
          filterData.value = res.result;
          console.log("filterData =>", filterData.value);
        } catch (error) {
          console.error("Failed to fetch sub-category filter data:", error);
        }
        filterLoading.value = false;
      };
      data();
    }
  },
  { immediate: true }
);
// 1.记录当前选择的品牌
const changeFilter = (id) => {
  if (filterData.value.brands.selectedBrand === id) return;
  filterData.value.brands.selectedBrand = id;
};
// 2.记录你选择的销售属性
const changeProp = (sp, propId) => {
  if (sp.selectedAttr === propId) return;
  sp.selectedAttr = propId;
};
</script>

<style scoped>
.sub-filter {
  background: #fff;
  padding: 20px 24px;
  border: 1px solid #eee;
  border-radius: 8px;
}

/* 加载态容器，居中展示 Spinner */
.sub-filter.loading {
  display: grid;
  place-items: center;
  min-height: 72px;
}

.sub-filter .item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
}

.sub-filter .item + .item {
  border-top: 1px dashed #eee;
}

.sub-filter .head {
  width: 84px;
  flex-shrink: 0;
  color: #999;
  font-weight: 500;
  text-align: right;
  padding-right: 8px;
  line-height: 32px;
}

.sub-filter .body {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px; /* 行间距10px，列间距12px */
}

/* 标签样式 */
.sub-filter .body a {
  display: inline-block;
  max-width: 200px; /* 防止超长撑爆布局 */
  padding: 4px 10px;
  font-size: 13px;
  line-height: 20px;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 16px;
  background: #fafafa;
  transition: all 0.2s;
  white-space: nowrap; /* 不自动换行 */
  overflow: hidden; /* 超长省略 */
  text-overflow: ellipsis;
}

.sub-filter .body a:hover {
  border-color: #42b983;
  color: #42b983;
  background: rgba(66, 185, 131, 0.08);
}

.sub-filter .body a.active {
  border-color: #42b983;
  background: rgba(66, 185, 131, 0.15);
  color: #42b983;
  font-weight: 600;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .sub-filter .item {
    flex-direction: column;
    gap: 6px;
  }
  .sub-filter .head {
    width: auto;
    text-align: left;
  }
}
</style>
