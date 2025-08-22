// pinia 基本框架搭建
import { createPinia } from "pinia";

// 创建 pinia 实例
const pinia = createPinia("", () => {
  // 案例
  // state
  //   const count = ref(0)
  //   // getter
  //   const doubleCount = computed(() => count.value * 2)
  //   // action
  //   function increment() {
  //     count.value++
  //   }
  //   return { count, doubleCount, increment }
});

export default pinia;
// 之后在 main.js 中引入并使用
