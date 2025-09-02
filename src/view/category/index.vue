<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <!-- 使用 PascalCase 组件名，避免模板解析为原生标签导致异常 -->
      <LycBread>
        <LycBreadItem to="/">首页</LycBreadItem>
        <LycBreadItem>
          <transition name="fade" mode="out-in" appear="true">
            <span :key="route.params.id">{{ topCategory?.name || "" }}</span>
          </transition>
        </LycBreadItem>
      </LycBread>

      <!-- 轮播图 -->
      <!-- 注意：ref 需要绑定到真实 DOM 元素上，避免 IO/patch 时访问了不存在的 parentNode -->
      <div ref="target">
        <LycCarousel
          auto-play
          class="my-carousel"
          :sliders="sliders"
          style="height: 500px"
        />
      </div>

      <!-- 所有二级分类 -->
      <div
        class="sub-list"
        v-if="
          topCategory && topCategory.children && topCategory.children.length
        "
      >
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img v-lazy="sub.picture" />
              <p>{{ sub.name }}</p>
            </a>
          </li>
        </ul>
      </div>

      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="item in recommendList" :key="item.id">
        <div class="head">
          <h3>{{ item.name }}</h3>
          <p class="tag">{{ item.desc }}</p>
          <!-- 修正：动态路径须使用 :prop + 模板字符串，而非 Mustache 插值 -->
          <LycMore :path="`/category/sub/${item.id}`" />
        </div>
        <div class="body">
          <GoodsItem
            v-for="goods in item.goods"
            :key="goods.id"
            :goods="goods"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 合并导入，补上 watch；使用 PascalCase 命名与模板一致
import { ref, computed, watch } from "vue";
import LycBread from "@/component/libiray/lyc-bread.vue";
import LycBreadItem from "@/component/libiray/lyc-bread-item.vue";
import LycCarousel from "@/component/libiray/lyc-carousel.vue";
import { findBanner } from "@/api/home";
import { useLazyData } from "@/hooks";
import { useCategoryStore } from "@/stores/modules/category.js";
import { useRoute } from "vue-router";
import LycMore from "@/component/libiray/lyc-more.vue";
import GoodsItem from "./component/goods-item.vue";
import { findTopCategory } from "@/api/category";
//轮播图
const target = ref(null);
// 保持 useLazyData 的签名 (target, apiFn)，多余参数会被忽略
const sliders = useLazyData(target, findBanner);

//面包屑加所有子分类利用pinia
const categoryStore = useCategoryStore();
const route = useRoute();
// 防御：list 可能尚未就绪时使用可选链，避免 undefined.find 报错
const topCategory = computed(
  () =>
    categoryStore.list?.find?.(
      (item) => String(item.id) === String(route.params.id)
    ) || null
);

// 获取各个子类目下推荐商品
const recommendList = ref([]);
const getList = () => {
  findTopCategory(route.params.id).then((data) => {
    if (Array.isArray(data?.result?.children)) {
      recommendList.value = data.result.children;
    }
  });
};
// 监听路由参数变化，首次加载也执行，避免复用组件时不刷新
watch(
  () => route.params.id,
  (newVal) => {
    // 当路由参数 id 变化时触发
    // 这里不仅 /category/:id 有 id，/category/sub/:id 也会有 id
    // 所以需要额外判断当前路径是不是一级分类页面
    if (newVal && `/category/${newVal}` === route.path) {
      // 这里是一级分类页面
      getList();
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="less">
@xtxColor: #42b983;
.top-category h3 {
  font-size: 28px;
  color: #666;
  font-weight: normal;
  text-align: center;
  line-height: 100px;
}

.top-category .sub-list {
  margin-top: 20px;
  background-color: #fff;
}

.top-category .sub-list ul {
  display: flex;
  padding: 0 32px;
  flex-wrap: wrap;
}

.top-category .sub-list ul li {
  width: 168px;
  height: 160px;
}

.top-category .sub-list ul li a {
  text-align: center;
  display: block;
  font-size: 16px;
}

.top-category .sub-list ul li a img {
  width: 100px;
  height: 100px;
}

.top-category .sub-list ul li a p {
  line-height: 40px;
}

.top-category .sub-list ul li a:hover {
  color: @xtxColor; /* 如果有 less 变量，这里需要换成实际颜色值 */
}

.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
}

.ref-goods .head {
  position: relative;
}

.ref-goods .xtx-more {
  position: absolute;
  top: 20px;
  right: 20px;
}

.ref-goods .tag {
  text-align: center;
  color: #999;
  font-size: 20px;
  position: relative;
  top: -20px;
}

.ref-goods .body {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0 65px 30px;
}
:deep(.fade-enter-from) {
  opacity: 0;
  transform: translateY(-20px);
}
:deep(.fade-enter-to) {
  opacity: 1;
  transform: translateY(0);
}
:deep(.fade-enter-active),
:deep(.fade-leave-active) {
  transition: all 0.5s ease;
}
:deep(.fade-leave-from) {
  opacity: 1;
  transform: translateY(0);
}
:deep(.fade-leave-to) {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
