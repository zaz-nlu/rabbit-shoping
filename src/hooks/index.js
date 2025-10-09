// 提供一些复用逻辑的函数
import { useIntersectionObserver } from "@vueuse/core";
import { ref, onUnmounted } from "vue";
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
// countdown是倒计时秒数
import { useIntervalFn } from "@vueuse/core";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
export const usePayTime = () => {
  const router = useRouter();
  const time = ref(0);
  const timeText = ref("");
  const { pause, resume } = useIntervalFn(
    () => {
      time.value--;
      timeText.value = dayjs.unix(time.value).format("mm分ss秒");
      console.log("time.value", time.value);
      if (time.value <= 0) {
        pause();
        message.error("支付超时，请重新下单");
        router.replace("/member/checkout"); // 2) 修正路径
      }
    },
    1000,
    { immediate: false }
  );

  onUnmounted(() => {
    pause();
  });

  // 开始倒计时
  const start = (countdown) => {
    time.value = countdown;
    resume();
  };

  return {
    timeText,
    start,
  };
};
