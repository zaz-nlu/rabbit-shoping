// 提供首页相关API函数
import request from "@/utils/request";

// limit是获取品牌个数，利用这个获取品牌的图片
export const findBrand = (limit = 6) => {
  return request("/home/brand", "get", { limit });
};

export const findBanner = () => {
  return request("/home/banner", "get");
};
