import axios from "axios";
import { useUserStore } from "@/stores/modules/user.js";
import router from "@/router";

export const baseURL = "/api";

const instance = axios.create({
  baseURL,
  timeout: 10000, // 建议稍微长点
});

// 请求拦截：带 token
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore?.profile?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// 统一“业务成功”判断
const isBizSuccess = (code) =>
  code === 1 || code === "1" || code === 200 || code === "200";

// 响应拦截：统一剥壳 + 业务码判断 + 401 处理
instance.interceptors.response.use(
  (resp) => {
    const data = resp.data ?? resp;
    const code = data?.code;

    // 有 code 字段时，按业务码判断
    if (code !== undefined) {
      if (isBizSuccess(code)) return data;
      // 业务失败：直接 reject(data)，方便页面统一处理
      return Promise.reject(data);
    }
    // 没有 code 字段（比如第三方接口）则原样返回
    return data;
  },
  (error) => {
    if (error?.response?.status === 401) {
      const userStore = useUserStore();
      // 注意：这里的方法名要和你 Pinia 里一致（你页面里用的是 setUserInfo）
      userStore.setUserInfo?.({}) || userStore.setUser?.({});
      const fullPath = router.currentRoute.value.fullPath;
      router.push("/login?redirectUrl=" + encodeURIComponent(fullPath));
    }
    return Promise.reject(error);
  }
);

// 统一请求方法
const request = (url, method, submitData) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === "get" ? "params" : "data"]: submitData,
  });
};

export default request;
