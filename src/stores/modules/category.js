import { ref } from "vue";
import { defineStore } from "pinia";
import { topCategory } from "@/api/constants";
import { findAllCategory } from "@/api/category";

export const useCategoryStore = defineStore("category", () => {
  const list = ref(
    // 占位数据：默认收起，并补齐必需字段
    topCategory.map((item) => ({
      name: item,
      open: false,
    }))
  );
  const setList = (payload) => {
    list.value = payload; // ✅ 正确写法
  };

  const getList = async () => {
    const data = await findAllCategory();
    // 给每个分类加上控制二级分类显示隐藏的数据
    data.result.forEach((item) => {
      item.open = false; // 一级分类默认收起
    });
    setList(data.result);
  };

  const showMenu = (id) => {
    const cate = list.value.find((item) => item.id === id);
    if (cate) cate.open = true;
  };

  const hideMenu = (id) => {
    const cate = list.value.find((item) => item.id === id);
    if (cate) cate.open = false;
  };

  // 兼容旧方法名
  const show = showMenu;
  const hide = hideMenu;

  return { list, setList, getList, showMenu, hideMenu, show, hide };
});
