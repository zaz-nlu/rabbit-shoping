// 1. 创建 axios 实例
// 2. 请求拦截器（请求之前的处理）
// 3. 响应拦截器（请求之后的处理）
// 4. 导出封装的请求方法
import axios from "axios";
import { useUserStore } from "@/stores/modules/user";
import router from "@/router";

// 导出基准地址
export const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net/";
const instance = axios.create({
  // axios的一些配置，baseURL timeout
  baseURL,
  timeout: 5000,
});

// 请求拦截器,如果有token，统一注入token
// 1. 获取用户信息（token）
// 2. 注入token
instance.interceptors.request.use(
  (config) => {
    // 拦截的业务逻辑
    // 如果本地有token，统一注入token
    const userStore = useUserStore();
    const profile = userStore.profile;
    if (profile.token) {
      // 设置token请求头
      config.headers.Authorization = `Bearer ${profile.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
// res=>res.data 去除data数据，将来调用接口的时候直接拿到的就是后台的数据
instance.interceptors.response.use(
  (res) => {
    // 响应成功的回调
    return res.data;
  },
  (error) => {
    // 响应失败的回调
    //401状态码，进入该函数
    if (error.response && error.response.status === 401) {
      //1. 清空无效用户信息
      //  跳转到登录页
      // 3. 跳转需要传参（当前路由地址）给登录页
      const userStore = useUserStore();
      userStore.setUser({});
      const fullPath = router.currentRoute.value.fullPath;
      router.push("/login?redirectUrl=" + encodeURIComponent(fullPath));
    }
    return Promise.reject(error);
  }
);

// 导出一个函数，调用当前的axios实例发请求吗，返回值promise对象
const request = (url, method, submitData) => {
  // 负责发请求
  return instance({
    url,
    method,
    [method.toLowerCase() === "get" ? "params" : "data"]: submitData,
  });
};

export default request;
