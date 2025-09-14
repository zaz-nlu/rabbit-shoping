// src/api/user.js
import request from "@/utils/request.js";

/** 账号密码登录  POST /login  body: { account, password } */
export const accountLogin = ({ account, password }) => {
  return request("/login", "post", { account, password });
};

/** 短信登录  POST /login/mobile  body: { mobile, code } */
export const mobileLogin = ({ mobile, code }) => {
  return request("/login/mobile", "post", { mobile, code });
};

/** 发送验证码  GET /login/code?mobile=xxx  注意：只传一个字符串 */
export const getMobileCode = (mobile) => {
  return request("/login/code", "get", { mobile });
};

// 获取QQ登录
export const userQQLogin = (unionId, source = 1) => {
  return request("/login/social", "post", { unionId, source });
};

// 绑定已有账号
export const userQQBind = (mobile) => {
  return request("/login/social/code", "get", { mobile });
};

// QQ绑定登录
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request("/login/social/bind", "post", { unionId, mobile, code });
};

// 校验用户名是否唯一
export const userAccountCheck = (account) => {
  return request("/register/check", "get", { account });
};

// 用户注册
export const userQQPatchCode = (mobile) => {
  return request("/register/code", "get", { mobile });
};

// 注册后提交
export const userQQPatchLogin = ({
  unionId,
  mobile,
  code,
  account,
  password,
}) => {
  return request(`/login/social/${unionId}/complement`, "post", {
    account,
    password,
    mobile,
    code,
    unionId,
  });
};
