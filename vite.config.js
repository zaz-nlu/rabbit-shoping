// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)), // 👈 路径别名
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 允许 Less 里用 JS 表达式
        additionalData: `@import "${path.resolve(
          __dirname,
          "src/assets/style/mixins.less"
        )}";`,
      },
    },
  },
});
