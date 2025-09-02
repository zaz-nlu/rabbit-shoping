<template>
  <LycBread>
    <LycBreadItem to="/">首页</LycBreadItem>
    <LycBreadItem v-if="category.top" :to="`/category/${category.top.id}`">
      <Transition name="fade" mode="out-in" appear="true">
        <span :key="category.top.id">{{ category.top.name }}</span>
      </Transition>
    </LycBreadItem>

    <LycBreadItem v-if="category.sub" :to="`/category/${category.sub.id}`">
      <Transition name="fade" mode="out-in" appear="true">
        <span :key="category.sub.id"> {{ category.sub.name }}</span>
      </Transition>
    </LycBreadItem>
  </LycBread>
</template>

<script setup>
import LycBread from "@/component/libiray/lyc-bread.vue";
import LycBreadItem from "@/component/libiray/lyc-bread-item.vue";
import { useCategoryStore } from "@/stores/modules/category";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();
const store = useCategoryStore();
const category = computed(() => {
  const cate = {};
  store.list.forEach((top) => {
    if (top.children) {
      const sub = top.children.find((sub) => sub.id === route.params.id);
      console.log("sub =>", top, sub);
      if (sub) {
        cate.top = { id: top.id, name: top.name };
        cate.sub = { id: sub.id, name: sub.name };
      }
    }
  });
  return cate;
});
</script>

<style scoped lang="less">
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
