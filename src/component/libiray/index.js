// 扩展vue原有的功能，全局组件，自定义指令，挂载原型方法，但是要注意vue3没有原型过滤器，因为过滤器本质就是函数，
// vue2插件写法要素
// 1. 必须有一个暴露的对象，有install方法，默认传入了Vue构造函数，vue基础之上的扩展
// 2. 在install方法中，完成对Vue的扩展，比如注册全局组件，指令等
// 3. 插件可以通过Vue.use()来安装
// vue3插件写法要素
// 导出一个对象，有install函数，默认传入了app应用实例，在app基础上扩展
export default {
  install(app) {
    app.component("LycSkeleton", () =>
      import("@/component/libiray/lyc-skeleton.vue")
    );
    app.component("LycCarousel", () =>
      import("@/component/libiray/lyc-carousel.vue")
    );
  },
};
