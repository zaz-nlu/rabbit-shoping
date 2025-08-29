// 提供一些复用逻辑的函数
import { useIntersectionObserver } from "@vueuse/core";
import { ref } from "vue";
// target是要被监控的DOM元素，API函数是对DOM进行懒加载的请求
export const useLazyData = (target, apiFn) => {
  const result = ref([]);
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop();
        apiFn().then((response) => {
          result.value = response.result;
        });
      }
    },
    // threshold用语控制相交多少才触发
    {
      threshold: 0,
    }
  );
  return result;
};
// target是要被监控的DOM元素，API函数是对DOM进行懒加载的请求
