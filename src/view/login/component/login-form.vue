<template>
  <div class="account-box">
    <!-- 顶部登录方式切换
         语义：isMsgLogin = true 表示“短信登录”，false 表示“账号登录”
         点击切换只改变 isMsgLogin，不直接提交表单 -->
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>

    <!-- Vee-Validate 的 Form：
         1) 用 :validation-schema 绑定“动态校验规则”（随登录方式切换）
         2) v-slot 暴露 errors，便于在模板里展示错误文案
         3) autocomplete="off" 配合“陷阱字段”减少浏览器自动填充干扰 -->
    <Form
      ref="loginForm"
      class="form"
      :validation-schema="schema"
      v-slot="{ errors }"
      autocomplete="off"
    >
      <!-- ================= 防浏览器自动填充陷阱字段 =================
           原理：多数浏览器会优先把已保存的用户名/密码填到第一个可见/不可见的 text + password 组合。
           我们放两个隐藏字段抢占 autofill，真实字段设置 autocomplete="off" 并在挂载后清空。 -->
      <input
        type="text"
        autocomplete="username"
        tabindex="-1"
        aria-hidden="true"
        style="
          position: absolute;
          left: -9999px;
          top: -9999px;
          height: 0;
          width: 0;
          opacity: 0;
        "
      />
      <input
        type="password"
        autocomplete="new-password"
        tabindex="-1"
        aria-hidden="true"
        style="
          position: absolute;
          left: -9999px;
          top: -9999px;
          height: 0;
          width: 0;
          opacity: 0;
        "
      />

      <!-- 用 key 强制重建字段，防止切换登录方式时 Field 状态互相污染
           语义对齐：isMsgLogin=true 重建为 sms-login，false 重建为 pwd-login -->
      <div :key="isMsgLogin ? 'sms-login' : 'pwd-login'">
        <!-- ========== 短信登录（isMsgLogin = true） ========== -->
        <template v-if="isMsgLogin">
          <!-- 手机号 -->
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <!-- Field 必须有 name；v-model 双向绑定到 form.mobile -->
              <Field
                v-model="form.mobile"
                :class="{ error: errors.mobile }"
                name="mobile"
                type="text"
                placeholder="请输入手机号"
                autocomplete="off"
                inputmode="numeric"
              />
            </div>
            <div class="error" v-if="errors.mobile">
              <i class="iconfont icon-warning" />{{ errors.mobile }}
            </div>
          </div>

          <!-- 验证码 + 发送按钮（带倒计时） -->
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-code"></i>
              <!-- 注：type 设为 password 可隐藏输入；排查问题时可临时改为 text 观察输入值 -->
              <Field
                v-model="form.code"
                :class="{ error: errors.code }"
                name="code"
                type="password"
                placeholder="请输入验证码"
                autocomplete="off"
                inputmode="numeric"
                maxlength="6"
              />
              <!-- 发送验证码按钮：time=0 可点击，否则显示剩余秒数 -->
              <span @click="sendCode" class="code">
                {{ time === 0 ? "发送验证码" : `${time}秒后重发` }}
              </span>
            </div>
            <div class="error" v-if="errors.code">
              <i class="iconfont icon-warning" />{{ errors.code }}
            </div>
          </div>
        </template>

        <!-- ========== 账号密码登录（isMsgLogin = false） ========== -->
        <template v-else>
          <!-- 用户名 -->
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <Field
                v-model="form.account"
                :class="{ error: errors.account }"
                name="account"
                type="text"
                placeholder="请输入用户名"
                autocomplete="off"
              />
            </div>
            <div class="error" v-if="errors.account">
              <i class="iconfont icon-warning" />{{ errors.account }}
            </div>
          </div>

          <!-- 密码 -->
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-lock"></i>
              <Field
                v-model="form.password"
                :class="{ error: errors.password }"
                name="password"
                type="password"
                placeholder="请输入密码"
                autocomplete="new-password"
              />
            </div>
            <div class="error" v-if="errors.password">
              <i class="iconfont icon-warning" />{{ errors.password }}
            </div>
          </div>
        </template>
      </div>

      <!-- 协议勾选：用 Field 的 scoped slot 同步第三方复选组件的值 -->
      <div class="form-item">
        <div class="agree">
          <Field
            name="isAgree"
            :initial-value="true"
            v-slot="{ value, handleChange }"
          >
            <lycCheckbox
              :model-value="value"
              @update:modelValue="handleChange"
            />
          </Field>
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree">
          <i class="iconfont icon-warning" />{{ errors.isAgree }}
        </div>
      </div>

      <!-- 登录按钮：统一触发 login()，内部根据 isMsgLogin 分支调用接口 -->
      <div class="Login-btn">
        <n-button
          class="Login-btn1"
          tertiary
          round
          type="success"
          @click="login()"
        >
          登录
        </n-button>
      </div>
    </Form>

    <!-- 其他第三方登录/链接占位 -->
    <div class="action">
      <a
        href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
      >
        <img
          src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
          alt="QQ登录"
        />
      </a>

      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 本组件关键点总览：
 * 1) isMsgLogin：true=短信登录；false=账号登录。模板和 login() 分支务必一致。
 * 2) Vee-Validate：根据 isMsgLogin 动态切换 schema，避免隐藏字段误校验。
 * 3) 发送验证码：getMobileCode(mobileString) —— 只传字符串，不要传对象。
 * 4) 倒计时：useInterval + time 状态，time>0 时按钮禁用/显示剩余秒数。
 * 5) 浏览器自动填充：隐藏“陷阱字段”+ onMounted 二次清空账号/密码。
 */

import lycCheckbox from "@/component/libiray/lyc-checkbox.vue";
import { reactive, ref, watch, onMounted, computed } from "vue";
import { Form, Field } from "vee-validate";
import { MySchema } from "@/utils/vee-validate-schema.js";
import { accountLogin, mobileLogin, getMobileCode } from "@/api/user.js";
import { useUserStore } from "@/stores/modules/user.js";
import { useMessage } from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import { useIntervalFn } from "@vueuse/core";
import { useCartStore } from "@/stores/modules/cart.js";

// 登录方式：true=短信登录，false=账号登录
const isMsgLogin = ref(false);

// Vee-Validate 的 Form 实例引用
const loginForm = ref(null);

// 路由 & 状态
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const message = useMessage();

// 表单数据：字段名要与后端保持一致
const form = reactive({
  account: "",
  password: "",
  mobile: "",
  code: "",
  isAgree: true,
});

// ========== 动态校验规则 ==========
// 只校验当前展示的字段，避免隐藏字段报错
const smsSchema = {
  mobile: MySchema.mobile,
  code: MySchema.code,
  isAgree: MySchema.isAgree,
};
const pwdSchema = {
  account: MySchema.account,
  password: MySchema.password,
  isAgree: MySchema.isAgree,
};
const schema = computed(() => (isMsgLogin.value ? smsSchema : pwdSchema));

// 切换登录方式时清空表单 + 重置校验状态
watch(isMsgLogin, () => {
  form.account = "";
  form.password = "";
  form.mobile = "";
  form.code = "";
  form.isAgree = true;
  // resetForm：清除上一次模式下的校验结果、触发状态等
  loginForm.value?.resetForm();
});

// ========== 登录提交逻辑 ==========
const cartStore = useCartStore();
const login = async () => {
  // 1) 统一先做表单校验（基于当前模式的 schema）
  const ok = await loginForm.value?.validate();
  if (!ok) return;

  try {
    let res = null;
    if (isMsgLogin.value) {
      // 短信登录：mobile + code（注意去空格；密码不建议 trim）
      const mobile = form.mobile.trim();
      const code = form.code.trim();
      if (!mobile) return message.error("请输入手机号");
      if (!code) return message.error("请输入验证码");
      res = await mobileLogin({ mobile, code });
    } else {
      // 账号密码登录
      const account = form.account.trim();
      const password = form.password; // 密码保留原样
      if (!account) return message.error("请输入用户名");
      if (!password) return message.error("请输入密码");
      res = await accountLogin({ account, password });
    }

    // 2) 成功：写入 Pinia 并跳转
    const {
      id,
      account: acc,
      avatar,
      mobile,
      nickname,
      token,
    } = res.result || {};
    userStore.setUserInfo({
      id,
      account: acc,
      avatar,
      mobile,
      nickname,
      token,
    });

    // 合并购物车
    try {
      await cartStore.mergeCart();
      message.success("购物车合并成功");
    } catch (e) {
      message.warning("合并购物车失败，请稍后重试");
    }
    const redirect = route.query.redirectUrl || "/";
    router.push(redirect);
    message.success("登录成功");
  } catch (err) {
    // 业务/网络错误的统一兜底提示
    const serverMsg =
      err?.response?.data?.message || err?.response?.data?.msg || err?.message;
    message.error(serverMsg || "登录失败");
  }
};

// ========== 倒计时逻辑 ==========
// time>0 表示冷却中；useInterval 每秒减 1，减到 0 自动停止
const time = ref(0);
const { pause: stop, resume: start } = useIntervalFn(
  () => {
    time.value--;
    if (time.value <= 0) stop();
  },
  1000,
  false
);
onMounted(() => {
  // 组件挂载时确保计时器已停止
  stop();
});

// 发送验证码（仅短信登录下可见）：
// 1) 冷却中直接返回；2) 先本地校验手机号；3) getMobileCode 只传字符串；
// 4) 成功后设置 60 秒倒计时；5) 错误时展示后端文案
const sendCode = async () => {
  if (time.value > 0) return; // 冷却中禁止重复点击

  const mobile = form.mobile.trim();
  const valid = MySchema.mobile(mobile);
  if (valid !== true) {
    loginForm.value?.setFieldError("mobile", valid);
    return message.error(valid);
  }

  try {
    const res = await getMobileCode(mobile); // ✅ 传字符串，最终为 ?mobile=xxx
    const tip = res.message || res.msg || "验证码已发送";
    message.success(tip);
    time.value = 60;
    start();
  } catch (err) {
    const serverMsg =
      err?.response?.data?.message || err?.response?.data?.msg || err?.message;
    message.error(serverMsg || "发送验证码失败，请稍后重试");
  }
};

// ========== 处理浏览器自动填充账号/密码 ==========
// 现象：进入登录页时，浏览器可能自动回填 account/password。
// 处理：挂载后多次“安全清空”（仅对账号/密码；不影响短信字段），避免误清用户真实输入。
onMounted(() => {
  form.account = "";
  form.password = "";
  setTimeout(() => {
    form.account = "";
    form.password = "";
  }, 0);
  setTimeout(() => {
    if (form.account === "root" || form.password.length > 0) {
      form.account = "";
      form.password = "";
    }
  }, 400);
});

//  初始化QQ登录按钮
// 但是改成连接形式了所以不需要了

// onMounted(() => {
//   if (window.QC) {
//     window.QC.Login({
//       btnId: "qqLoginBtn", // 👈 跟你写的 span 的 id 对应
//     });
//   }
// });
</script>

<style scoped lang="less">
/* 账户容器：整体布局与切换按钮样式 */
.account-box .toggle {
  padding: 15px 40px;
  text-align: right;
}
.account-box .toggle a {
  color: var(--xtxColor);
}
.account-box .toggle a i {
  font-size: 14px;
}

/* 表单布局 */
.form {
  padding: 0 40px;
}
.form-item {
  margin-bottom: 28px;
}

/* 输入框容器与图标 */
.form-item .input {
  position: relative;
  height: 36px;
}
.form-item .input > i {
  width: 34px;
  height: 34px;
  background: #cfcddc;
  color: #fff;
  position: absolute;
  left: 1px;
  top: 1px;
  text-align: center;
  line-height: 34px;
  font-size: 18px;
}

/* 输入框基础样式与状态 */
.form-item .input input {
  padding-left: 44px;
  border: 1px solid #cfcddc;
  height: 36px;
  line-height: 36px;
  width: 100%;
}
.form-item .input input.error {
  border-color: var(--priceColor);
}
.form-item .input input:active,
.form-item .input input:focus {
  border-color: var(--xtxColor);
}

/* 发送验证码按钮样式 */
.form-item .input .code {
  position: absolute;
  right: 1px;
  top: 1px;
  text-align: center;
  line-height: 34px;
  font-size: 14px;
  background: #f5f5f5;
  color: #666;
  width: 110px;
  height: 34px;
  cursor: pointer;
}

/* 协议链接 */
.agree a {
  color: #069;
}

/* 登录按钮容器与按钮样式 */
.Login-btn {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}
.Login-btn1 {
  width: 50%;
  height: 40px;
  font-size: 16px;
  background: var(--xtxColor);
  border: none;
  cursor: pointer;
}

/* 其他链接区块 */
.action {
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.action .url a {
  color: #999;
  margin-left: 10px;
}

/* 错误文案颜色 */
.error {
  color: red;
}
</style>
