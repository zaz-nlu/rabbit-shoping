import { userAccountCheck } from "@/api/user";

// 提供校验规则
export const MySchema = {
  // 账号：必填，3-10 位字母或数字
  account(value) {
    if (value == null || value === "") return "请输入用户名";
    if (!/^[a-zA-Z0-9]{3,10}$/.test(value))
      return "用户名需为 3-10 位字母或数字";
    return true;
  },

  // 账号：异步校验，3-10 位字母或数字 + 唯一性
  async accountApi(value) {
    if (!value) return "请输入用户名";
    if (!/^[a-zA-Z0-9]{3,10}$/.test(value)) {
      return "用户名需为 3-10 位字母或数字";
    }

    try {
      const res = await userAccountCheck(value);
      const ok = res?.code === "1" || res?.code === 1 || res?.code === 200;
      if (!ok) return res?.msg || res?.message || "服务器异常，请稍后重试";

      // 关键：后端约定 valid=false 表示“可用”
      if (res?.result?.valid === false) return true;
      return "用户名已存在";
    } catch {
      return "网络异常，请稍后重试";
    }
  },
  // 密码：必填，6-18 位
  password(value) {
    if (value == null || value === "") return "请输入密码";
    if (String(value).length < 6) return "密码至少 6 位";
    if (String(value).length > 18) return "密码最多 18 位";
    return true;
  },

  rePassword(value, { form }) {
    if (!value) return "请再次输入密码";
    if (!/^\S{6,24}$/.test(String(value))) return "密码需为 6-18 位";
    if (value !== form.password) return "两次输入密码不一致";
    return true;
  },

  // 手机号：必填，国内 11 位（1 开头，第二位 3-9）
  mobile(value) {
    if (value == null || value === "") return "请输入手机号";
    if (!/^1[3-9]\d{9}$/.test(String(value))) return "请输入有效的手机号";
    return true;
  },

  // 验证码：必填，6 位数字
  code(value) {
    if (value == null || value === "") return "请输入验证码";
    if (!/^\d{6}$/.test(String(value))) return "验证码需为 6 位数字";
    return true;
  },

  // 同意条款：必须勾选
  isAgree(value) {
    if (value !== true) return "请先同意隐私条款和服务条款";
    return true;
  },
};
