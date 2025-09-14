// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath, URL } from "node:url";

/**
 * 使用说明：
 * 1) hosts 里添加：127.0.0.1  www.corho.com  并刷新 DNS
 * 2) 访问地址固定用：http://www.corho.com:8080/
 * 3) 如果用“开发代理”解决 CORS，请把 axios 的 baseURL 改成 '/api'
 *    （或保留原始域名，不走代理——二选一）
 */
export default defineConfig({
  plugins: [vue()],

  // 路径别名：@ -> /src
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  // 全局注入 less 混入/变量（按你项目已有路径）
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(
          __dirname,
          "src/assets/style/mixins.less"
        )}";`,
      },
    },
  },

  // 开发服务器
  server: {
    host: "0.0.0.0", // 允许用域名/IP 访问
    port: 8080, // 必须与 QQ redirect_uri 的端口一致
    allowedHosts: ["www.corho.com"], // 允许 www.corho.com 访问（否则会 locked request）

    /**
     * 【可选：开发代理，解决 CORS】
     * 若开启此代理，请把 request.js 的 baseURL 改成 '/api'
     * 例如：export const baseURL = '/api'
     */
    proxy: {
      "/api": {
        target: "http://pcapi-xiaotuxian-front-devtest.itheima.net",
        changeOrigin: true,
        // 把以 /api 开头的请求转发到目标，并去掉 /api 前缀
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },

  /**
   * 【可选：把 QQ SDK 视为外部全局（仅当你真的写了 `import qc from "qc"` 才需要）】
   * 你已经在 index.html 通过 <script src="http://connect.qq.com/qc_jssdk.js"> 引入，
   * 平时直接用 window.QC 即可，不必 import。
   */
  build: {
    rollupOptions: {
      external: ["qc"], // 忽略打包 qc 模块
      output: {
        globals: {
          qc: "QC", // 运行时从全局 QC 取
        },
      },
    },
  },
});
