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
