import axios from "axios";
import { useUserStore } from "@/stores/modules/user.js";
import router from "@/router";

// 导出基准地址，原因:其他地方不是通过axios发请求的地方用上基准地址
export const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net/";
// 1.创建一个新的axios实例
const instance = axios.create({
  baseURL,
  timeout: 5000, // 设置请求超时时间
});

// 2.请求拦截器,如果有token就携带token
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    // 拦截业务逻辑
    // 请求配置的修改
    // 如果本地有token就在头部携带
    const profile = userStore.profile;
    // 用于判断是否有token
    if (profile.token) {
      config.headers.Authorization = `Bearer ${profile.token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 3.响应拦截器，剥离无效数据，处理token失效
instance.interceptors.response.use(
  (response) => {
    // 只返回data数据
    return response.data;
  },
  (error) => {
    // 处理token失效
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore();
      // 清除无效用户信息
      // 跳转到登录页吗
      // 跳转需要传参（即当前路由地址）给登录页吗
      //  想获得当前路由地址，在组件中可以通过this.$route获取
      // 在这里可以通过router.currentRoute获取
      userStore.setUser({});
      const fullPath = router.currentRoute.value.fullPath;
      router.push("/login?redirectUrl=" + encodeURIComponent(fullPath));
    }
    return Promise.reject(error);
  }
);

// 4.导出一个函数，调用当前的axios实例发请求，返回值promise对象
const request = (url, method, submitData) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === "get" ? "params" : "data"]: submitData,
  });
};

export default request;
