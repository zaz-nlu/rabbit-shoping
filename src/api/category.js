// 定义分类相关的API接口
import request from "@/utils/request";

// 获取所有分类
export const findAllCategory = () => {
  return request("/home/category/head", "get");
};

// 获取顶级类目信息，children属性就是各个子分类
export const findTopCategory = (id) => {
  return request("/category", "get", { id });
};

// 货期二级类目的筛选条件数据
export const findSubCategoryFilter = (id) => {
  return request("/category/sub/filter", "get", { id });
};

// 获取二级分类下面的商品
export const findSubCategoryGoods = (params) => {
  return request("/category/goods/temporary", "post", params);
};
