import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCartStore = defineStore(
  "cart",
  () => {
    const cart = ref({
      list: [],
    });

    return { cart };
  },
  // 👇 第三个参数里开启持久化
  {
    persist: {
      key: "rabbit-cart", // 可自定义存储 key
      storage: localStorage, // 默认就是 localStorage，可以不写
    },
  }
);
