<template>
  <div class="home-hot">
    <!-- 注意：HomePanel 的 subTitle 属性在模板里应写成 kebab-case：sub-title -->
    <HomePanel title="人气推荐" sub-title="热门商品推荐">
      <template #right>
        <LycMore path="/" />
      </template>
      <!-- 新鲜好物列表占位渲染 -->
      <ul class="goods-list" v-if="recommendList.length">
        <li v-for="item in recommendList" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <p class="name ellipsis-2">{{ item.title }}</p>
            <p class="price">{{ item.alt }}</p>
          </RouterLink>
        </li>
      </ul>
      <div v-else class="empty">加载中或暂无数据</div>
    </HomePanel>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import HomePanel from "@/view/home/component/home-panel.vue";
import LycMore from "@/component/libiray/lyc-more.vue";
import { findHot } from "@/api/home";

const recommendList = ref([]);
const loadRecommend = async () => {
  const data = await findHot();
  recommendList.value = Array.isArray(data?.result) ? data.result : [];
};

// 组件挂载时拉取数据
onMounted(loadRecommend);
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;

  li {
    width: 306px;
    height: 406px;
    .hoverShadow();

    img {
      width: 306px;
      height: 306px;
    }

    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }

    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
