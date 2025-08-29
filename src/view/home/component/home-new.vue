<template>
  <div ref="target" class="home-new">
    <HomePanel title="新鲜出炉,品质靠谱">
      <template #right>
        <LycMore path="/" />
      </template>
      <!-- 新鲜好物列表占位渲染 -->
      <ul class="goods-list" v-if="newList.length">
        <li v-for="item in newList" :key="item.id">
          <RouterLink to="/">
            <img v-lazy="item.picture" alt="" />
            <p class="name ellipsis-2">{{ item.name }}</p>
            <p class="price"><i>¥</i>{{ item.price }}</p>
          </RouterLink>
        </li>
      </ul>
      <div v-else class="empty">加载中或暂无数据</div>
    </HomePanel>
  </div>
</template>

<script setup>
import HomePanel from "@/view/home/component/home-panel.vue";
// 修正：实际路径为 libiray 而非 library
import LycMore from "@/component/libiray/lyc-more.vue";
import { findNew } from "@/api/home";
import { ref, onMounted } from "vue";
import { useLazyData } from "@/hooks";

// const loadNew = async () => {
//   const data = await findNew();
//   newList.value = Array.isArray(data?.result) ? data.result : [];
// };
const target = ref(null);
const newList = useLazyData(target, findNew);
</script>

<style scoped>
.goods-list {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  height: 406px;
}
.goods-list li {
  width: 306px;
  height: 330px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
}
.goods-list img {
  width: 306px;
  height: 406px;
}
.goods-list .name {
  padding: 8px 10px 0;
  color: #333;
}
.goods-list .price {
  padding: 4px 10px 10px;
  color: #42b983;
  font-weight: 600;
}
.empty {
  padding: 12px;
  color: #999;
}
</style>
