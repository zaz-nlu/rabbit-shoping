// 订单相关的API
import request from "@/utils/request";

// 结算页面获取订单信息
export const createOrderAPI = () => {
  return request("/member/order/pre", "get");
};

// 添加收货地址给后端
export const addAddressAPI = (form) => {
  return request("/member/address", "post", form);
};

// 修改收货地址
export const editAddressAPI = (form) => {
  return request(`/member/address/${form.id}`, "put", form);
};

// 提交订单
export const submitOrderAPI = (params) => {
  return request("/member/order", "post", params);
};
