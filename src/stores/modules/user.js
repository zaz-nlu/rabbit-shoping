import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user",
  () => {
    const profile = ref({
      id: "",
      avatar: "",
      nickname: "",
      account: "",
      mobile: "",
      token: "",
    });
    const setUser = (payload) => {
      profile.value = payload;
    };

    return { profile, setUser };
  },
  // 👇 第三个参数里开启持久化
  {
    persist: {
      key: "rabbit-user", // 可自定义存储 key
      storage: localStorage, // 默认就是 localStorage，可以不写
    },
  }
);
