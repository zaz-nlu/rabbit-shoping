// 封装购物车相关的API函数
import request from "@/utils/request";

export const findGood = (skuId) => {
  return request(`/goods/stock/${skuId}`, "get");
};

//获取商品对应的sku
export const getGoodsSku = (skuId) => {
  return request(`/goods/sku/${skuId}`, "get");
};

// 合并购物车
// cartList是一个对象类型数组里面包含了skuid，count,selected
export const mergeCartAPI = (cartList) => {
  return request("/member/cart/merge", "post", cartList);
};

// 获取当前登录用户服务器端购物车列表（若需要合并后再拉取）
// 兼容后端可能返回数组或包了一层 { result: [] } / { list: [] } 的情况，解析放在调用处做
export const getCartListAPI = () => {
  return request("/member/cart", "get");
};

//获取购物车列表
export const findCart = () => {
  return request("/member/cart", "get");
};

// 加入购物车
export const insertCartAPI = ({ skuId, count }) => {
  return request("/member/cart", "post", { skuId, count });
};

// 删除购物车商品
export const deleteCartAPI = (ids) => {
  return request("/member/cart", "delete", { ids });
};

// 修改购物车商品
export const updateCartAPI = ({ skuId, selected, count }) => {
  return request(`/member/cart/${skuId}`, "put", { selected, count });
};

// 全选反选
export const checkAllCartAPI = ({ selected, ids }) => {
  return request("/member/cart/selected", "put", { selected, ids });
};
