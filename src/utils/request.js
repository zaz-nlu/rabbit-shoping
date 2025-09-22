// 引入 axios，用于发起 HTTP 请求
import axios from "axios";
// 引入 Pinia 的用户仓库，用来获取和设置用户信息（主要是 token）
import { useUserStore } from "@/stores/modules/user.js";
// 引入路由，用于处理 401 时跳转登录
import router from "@/router";

// 设置接口请求前缀（不同环境下通常会配置不同前缀）
export const baseURL = "/api";

// 1. 创建 axios 实例
const instance = axios.create({
  baseURL, // 请求前缀
  timeout: 10000, // 请求超时时间，10s；建议比默认的稍长一些
});

/**
 * 2. 请求拦截器
 * - 每次请求前执行
 * - 功能：自动携带 token
 */
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore?.profile?.token; // 从 Pinia 中取出 token
    if (token) {
      // 如果存在 token，就在请求头里加上 Authorization
      // 标准写法：Authorization: Bearer xxx
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err) // 请求前的错误，直接抛出
);

/**
 * 统一“业务成功”判断函数
 * - 不同后端团队对 code 约定可能不同，这里统一兼容几种情况
 * - 常见：1 / 200 表示成功
 */
const isBizSuccess = (code) =>
  code === 1 || code === "1" || code === 200 || code === "200";

/**
 * 3. 响应拦截器
 * - 每次响应后执行
 * - 功能：剥离外层 data、统一业务码判断、处理 401
 */
instance.interceptors.response.use(
  (resp) => {
    // 有些接口 axios 包了一层 resp.data，所以这里兜底取 resp
    const data = resp.data ?? resp;
    const code = data?.code;

    // 如果后端返回了 code 字段，就用它来判断业务成功与否
    if (code !== undefined) {
      if (isBizSuccess(code)) return data; // 成功：直接返回 data
      // 业务失败：reject，交给调用方自己处理（比如弹 toast）
      return Promise.reject(data);
    }
    // 没有 code 字段（比如调用第三方接口），直接返回原数据
    return data;
  },
  (error) => {
    // 特殊处理：如果返回 401，表示未登录或登录过期
    if (error?.response?.status === 401) {
      const userStore = useUserStore();
      // 清空本地用户信息（Pinia store）
      userStore.setUserInfo?.({}) || userStore.setUser?.({});
      // 记录当前路由地址，登录后可以跳回去
      const fullPath = router.currentRoute.value.fullPath;
      router.push("/login?redirectUrl=" + encodeURIComponent(fullPath));
    }
    // 其它错误交给调用方处理
    return Promise.reject(error);
  }
);

/**
 * 4. 统一请求方法
 * - 封装 get/post/put/delete 等调用
 * - 根据方法类型自动区分 params / data
 *   - get 用 params（查询参数）
 *   - post/put/delete 用 data（请求体）
 */
const request = (url, method, submitData) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === "get" ? "params" : "data"]: submitData,
  });
};

export default request;
