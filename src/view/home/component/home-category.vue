<template>
  <!-- 将关闭逻辑绑定到根容器：只有鼠标离开“菜单+弹层”的整体区域时才关闭，避免从菜单移到弹层被误判离开而闪闭 -->
  <!-- 动态添加 is-open 类：仅在弹层打开时扩大覆盖宽度，平时不挡住轮播的按钮/分页点 -->
  <div
    class="home-category"
    :class="{ 'is-open': !!categoryId }"
    @mouseleave="categoryId = null"
  >
    <!-- 隐藏逻辑从这里移除，避免鼠标移入 layer 时立即触发关闭 -->
    <ul class="menu">
      <!-- 仅在移入时设置当前分类，不在此处移出时清空，防止在菜单与弹层之间移动时误触关闭 -->
      <li
        :class="{ active: categoryId === item.id }"
        v-for="item in menuList"
        :key="item.id"
        @mouseenter="categoryId = item.id"
      >
        <!-- 一级菜单 -->
        <router-link :to="`/category/${item.id}`">{{ item.name }}</router-link>
        <!-- 下面俩是二级菜单 -->
        <template v-if="item.children">
          <router-link
            v-for="sub in item.children"
            :key="sub.id"
            :to="`/category/${sub.id}`"
            >{{ sub.name }}</router-link
          >
        </template>
        <template v-else>
          <LycSkeleton
            height="18px"
            width="60px"
            bg="rgba(255, 255, 255, 0.1)"
            style="margin-right: 5px"
          ></LycSkeleton>
          <LycSkeleton
            height="18px"
            width="50px"
            bg="rgba(255, 255, 255, 0.1)"
            style="margin-right: 5px"
          ></LycSkeleton>
        </template>
      </li>
    </ul>

    <!-- 弹层：使用 v-show 而非 v-if，隐藏不销毁，避免数据和 DOM 被重建导致“像丢了” -->
    <div class="layer" v-show="categoryId">
      <h4>
        {{ currCategory && currCategory.id === "brand" ? "品牌" : "分类" }}推荐
        <small>根据您的购买或浏览记录推荐</small>
      </h4>
      <ul v-if="currCategory && currCategory.goods">
        <li v-for="item in currCategory.goods" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>

      <ul v-if="currCategory && currCategory.brands">
        <li class="brand" v-for="brand in currCategory.brands" :key="brand.id">
          <RouterLink to="/">
            <img :src="brand.picture" alt="" />
            <div class="info">
              <p class="place">
                <i class="iconfont icon-dingwei"></i> {{ brand.place }}
              </p>
              <p class="name ellipsis">{{ brand.name }}</p>
              <p class="desc ellipsis-2">{{ brand.desc }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useCategoryStore } from "@/stores/modules/category.js";
import { findBrand } from "@/api/home";
import LycSkeleton from "@/component/libiray/lyc-skeleton.vue";

// 菜单
const categoryStore = useCategoryStore();
// 品牌占位：把品牌“类目”当作一级项插入到菜单最前，从而共用同一套弹层渲染逻辑
// 使用 reactive 保持对象属性可追踪；不在关闭时清空，避免数据频繁重置
const brand = reactive({
  id: "brand",
  name: "品牌",
  children: [
    {
      id: "brand-children",
      name: "品牌推荐",
    },
  ],
  brands: [],
});
// 组装菜单数据：将品牌插入到接口返回的分类列表之前，并裁剪二级分类数量
const menuList = computed(() => {
  // 从pinia拿到list，但是后端请求来的字段很多，所以用map筛选出来只要需要的字段
  const list = categoryStore.list.map((item) => {
    return {
      id: item.id,
      name: item.name,
      children: item.children && item.children.slice(0, 2),
      goods: item.goods,
    };
  });
  // 将brand和list放到一起
  return [brand, ...list];
});

// 得到弹出层推荐商品数据
// 当前激活的一级分类 id；为 null 时隐藏弹层（v-show）
const categoryId = ref(null);
const currCategory = computed(() => {
  return menuList.value.find((item) => item.id === categoryId.value);
});

// 获取品牌数据
// 品牌数据只在组件挂载时拉取一次；配合 v-show，隐藏时不销毁，不会丢数据
const getBrand = async () => {
  const data = await findBrand();
  brand.brands = data.result;
  console.log("brand =>", brand.brands);
};

onMounted(() => {
  getBrand();
});
</script>

<style scoped lang="less">
@xbColor: #42b983; // 你项目的主题色
/* 主题色，原来是 @xbColor: #42b983; */
.home-category {
  // 默认仅占菜单宽度，避免平时挡住轮播图的按钮/分页点
  // 采用绝对定位：不占据文档流，让轮播能在其下方显示
  // 注意：父级需要 position: relative; 且高度 >= 500px，用于定位与占位
  width: 250px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;

  // 容器空白区域不拦截鼠标事件，让下方轮播按钮/分页点可点击
  pointer-events: none;

  // 实际可交互区域开启指针事件
  .menu,
  .layer {
    pointer-events: auto;
  }
}

// 弹层打开时再扩大覆盖范围到 1240px，确保从菜单滑到弹层不中断
.home-category.is-open {
  width: 1240px; // 菜单(250) + 弹层(990)
}

.home-category .menu {
  // 将黑色背景放到 .menu 区域，避免整个 1240px 区域都变暗
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
}

.home-category .menu li {
  padding-left: 40px;
  height: 50px;
  line-height: 50px;
}

.home-category .menu li:hover {
  background: #42b983; /* 展开后的主题色 */
}

.home-category .menu li a {
  margin-right: 4px;
  color: #fff;
}

.home-category .menu li a:first-child {
  font-size: 16px;
}

/* 弹层样式 */
.layer {
  width: 990px;
  height: 500px;
  background: rgba(255, 255, 255, 0.8);
  position: absolute;
  left: 250px;
  top: 0;
  // 显隐由 v-show 控制，不使用 :hover 或 display 切换，避免抖动
  padding: 0 15px;
}

.layer h4 {
  font-size: 20px;
  font-weight: normal;
  line-height: 80px;
}

.layer h4 small {
  font-size: 16px;
  color: #666;
}

.layer ul {
  display: flex;
  flex-wrap: wrap;
}

.layer ul li {
  width: 310px;
  height: 120px;
  margin-right: 15px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  background: #fff;
}

.layer ul li:nth-child(3n) {
  margin-right: 0;
}

.layer ul li a {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 10px;
}

.layer ul li a:hover {
  background: #e3f9f4;
}

.layer ul li a img {
  width: 95px;
  height: 95px;
}

.layer ul li a .info {
  padding-left: 10px;
  line-height: 24px;
  width: 190px;
}

.layer ul li a .name {
  font-size: 16px;
  color: #666;
}

.layer ul li a .desc {
  color: #999;
}

.layer ul li a .price {
  font-size: 22px;
  color: #42b983; /* 原来是 @priceColor，改成主题色 */
}

.layer ul li a .price i {
  font-size: 16px;
}

/* 弹层显示交给 v-show 控制 */

li.brand {
  height: 180px;
}

li.brand a {
  align-items: flex-start;
}

li.brand a img {
  width: 120px;
  height: 160px;
}

li.brand .info p {
  margin-top: 8px;
}

li.brand .info .place {
  color: #999;
}
.active {
  background: #42b983;
}
.LycSkeleton {
  animation: fade 1s linear infinite alternate;
}

@keyframes fade {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.5;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.1;
  }
}
</style>
