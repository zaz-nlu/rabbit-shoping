// 提供校验规则
export const MySchema = {
  // 账号：必填，3-10 位字母或数字
  account(value) {
    if (value == null || value === "") return "请输入用户名";
    if (!/^[a-zA-Z0-9]{3,10}$/.test(value))
      return "用户名需为 3-10 位字母或数字";
    return true;
  },

  // 密码：必填，6-18 位
  password(value) {
    if (value == null || value === "") return "请输入密码";
    if (String(value).length < 6) return "密码至少 6 位";
    if (String(value).length > 18) return "密码最多 18 位";
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
