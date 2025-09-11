import request from "@/utils/request";

// 获取商品详情
export const findGoods = (id) => {
  return request("/goods", "get", { id });
};

// 获取相关推荐商品
// 传入相关推荐，不传猜你喜欢
// limit用来控制商品数量
export const findRelevantGoods = ({ id, limit = 16 }) => {
  return request("/goods/relevant", "get", { id, limit });
};
// 获取热销榜的商品
export const findHotsComment = ({ id, limit = 3, type = 1 }) => {
  return request("/goods/hot", "get", { id, limit, type });
};

// 请求商品评价
export const findGoodsComment = (id) => {
  // axios遇到http https开头，不会加上基准地址
  return request(`/goods/${id}/evaluate`, "get");
};
