// 扩展vue原有的功能，全局组件，自定义指令，挂载原型方法，但是要注意vue3没有原型过滤器，因为过滤器本质就是函数，
// vue2插件写法要素
// 1. 必须有一个暴露的对象，有install方法，默认传入了Vue构造函数，vue基础之上的扩展
// 2. 在install方法中，完成对Vue的扩展，比如注册全局组件，指令等
// 3. 插件可以通过Vue.use()来安装
// vue3插件写法要素

import errorImg from "../../assets/images/errorImg.png";
import { defineAsyncComponent } from "vue";

// 把lyc-开头的组件名转换为PascalCase
const toPascalCase = (s) =>
  s.replace(/(^\w|-\w)/g, (m) => m.replace("-", "").toUpperCase());

// 组件模块vite集体导入的方法
const modules = import.meta.glob("./*.vue");
// 导出一个对象，有install函数，默认传入了app应用实例，在app基础上扩展
export default {
  install(app) {
    // 1) 批量注册全局组件（当前目录下 .vue）
    for (const path in modules) {
      // 可选：跳过某些文件，比如示例/模板
      // if (/example|template/i.test(path)) continue

      const loader = modules[path]; // () => import('./xxx.vue')
      // 优先使用 SFC 的 name；没有就用文件名转 PascalCase
      const fileName = path.replace(/^\.\/(.*)\.vue$/, "$1"); // ./lyc-bread.vue -> lyc-bread

      app.component(
        // 注册名：SFC.name（若异步组件拿不到 name，可用文件名方案）
        toPascalCase(fileName),
        defineAsyncComponent(loader)
      );
    }

    // 3) 定义全局指令
    defineDirective(app);
  },
};

// 定义指令
const defineDirective = (app) => {
  // 1. 图片懒加载指令
  app.directive("lazy", {
    mounted(el, binding) {
      // 创建 IntersectionObserver
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              observer.unobserve(el); // 只触发一次
              // onerror是加载失败，load是成功
              el.onerror = () => {
                el.src = errorImg;
              };
              el.src = binding.value;
            }
          });
        },
        {
          threshold: 0.1, // 👈 在这里加
          rootMargin: "0px 0px 200px 0px",
        }
      );

      // 开始观察
      observer.observe(el);
    },
  });
};
