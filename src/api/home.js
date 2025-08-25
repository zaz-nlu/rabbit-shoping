// 提供首页相关API函数
import request from "@/utils/request";

// limit是获取品牌个数
export const findBrand = (limit = 6) => {
  return request("/home/brand", "get", { limit });
};
