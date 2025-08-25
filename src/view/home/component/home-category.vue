<template>
  <div class="home-category">
    <ul class="menu">
      <li
        v-for="item in menuList"
        :key="item.id"
        @mouseenter="categoryId = item.id"
        @mouseleave="categoryId = null"
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
      </li>
    </ul>

    <!-- 弹层 -->
    <div class="layer">
      <h4>
        分类推荐
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
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useCategoryStore } from "@/stores/modules/category.js";

// 菜单
const categoryStore = useCategoryStore();
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
const menuList = computed(() => {
  const list = categoryStore.list.map((item) => {
    return {
      id: item.id,
      name: item.name,
      children: item.children && item.children.slice(0, 2),
      goods: item.goods,
    };
  });
  return [brand, ...list];
});

// 得到弹出层推荐商品数据
const categoryId = ref(null);
const currCategory = computed(() => {
  return menuList.value.find((item) => item.id === categoryId.value);
});

// 获取品牌数据
</script>

<style scoped lang="less">
@xbColor: #42b983; // 你项目的主题色
/* 主题色，原来是 @xbColor: #42b983; */
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
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
  display: none;
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

/* hover 显示弹层（这里建议用具体选择器，不要全局 hover） */
.home-category:hover .layer {
  display: block;
}
</style>
