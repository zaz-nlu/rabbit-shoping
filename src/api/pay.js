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

// 获取订单详情
export const getOrderDetailAPI = (id) => {
  return request(`/member/order/${id}`, "get");
};

/**
 * 获取订单列表
 * @param {object} params - 参考接口文档
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {number} params.orderState - 订单状态：0-全部 1-待付款 2-待发货 3-待收货 4-待评价 5-已完成 6-已取消
 * @returns
 */
export const findOrderList = ({ page = 1, pageSize = 10, orderState = 0 }) => {
  return request("/member/order", "get", { page, pageSize, orderState });
};

// 取消订单API函数
export const cancelOrderAPI = ({ orderId, cancelReason }) => {
  return request(`/member/order/${orderId}/cancel`, "put", { cancelReason });
};

/* 删除订单API函数 */
export const deleteOrderAPI = (orderId) => {
  return request(`/member/order`, "delete", { ids: [orderId] });
};

// 确认收货API函数
export const confirmOrderAPI = (orderId) => {
  return request(`/member/order/${orderId}/receipt`, "put");
};

// 查询物流API
export const queryLogisticsAPI = (orderId) => {
  return request(`/member/order/${orderId}/logistics`, "get");
};
