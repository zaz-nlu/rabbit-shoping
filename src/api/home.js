// 提供首页相关API函数
import request from "@/utils/request";

// limit是获取品牌个数，利用这个获取品牌的图片
export const findBrand = (limit = 6) => {
  return request("/home/brand", "get", { limit });
};

// 获取广告曲轮播图
export const findBanner = () => {
  return request("/home/banner", "get");
};

// 新产品
export const findNew = () => {
  return request("/home/new", "get");
};

// 人气推荐
export const findHot = () => {
  return request("/home/hot", "get");
};

// 获取商品板块
export const findProduct = () => {
  return request("/home/goods", "get");
};

// 获取专题板块图片
export const findSpecial = () => {
  return request("/home/special", "get");
};
