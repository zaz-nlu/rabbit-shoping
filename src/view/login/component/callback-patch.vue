<template>
  <Form
    :validation-schema="schema"
    ref="loginForm"
    v-slot="{ errors }"
    class="xtx-form"
    autocomplete="off"
  >
    <!-- 用户名 -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          v-model="form.account"
          class="input"
          name="account"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div v-if="errors.account" class="error">{{ errors.account }}</div>
    </div>

    <!-- 手机号 -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          v-model="form.mobile"
          class="input"
          name="mobile"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
    </div>

    <!-- 验证码 -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          v-model="form.code"
          class="input"
          name="code"
          type="text"
          placeholder="请输入验证码"
        />
        <span @click="sendCode" class="code">
          {{ time === 0 ? "获取验证码" : `${time}s 后重发` }}</span
        >
      </div>
      <div v-if="errors.code" class="error">{{ errors.code }}</div>
    </div>

    <!-- 密码 -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          v-model="form.password"
          class="input"
          name="password"
          type="password"
          placeholder="请输入密码"
        />
      </div>
      <div v-if="errors.password" class="error">{{ errors.password }}</div>
    </div>

    <!-- 确认密码 -->
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          v-model="form.rePassword"
          class="input"
          name="rePassword"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div v-if="errors.rePassword" class="error">
        {{ errors.rePassword }}
      </div>
    </div>

    <!-- 提交按钮 -->
    <a @click="onSubmit" href="javascript:;" class="submit">立即提交</a>
  </Form>
</template>

<script setup>
import { reactive, ref, watch, onMounted, computed } from "vue";
import { Form, Field } from "vee-validate";
import { MySchema } from "@/utils/vee-validate-schema.js";
import { userQQPatchCode, userQQPatchLogin } from "@/api/user.js";
import { message } from "ant-design-vue";
import { useIntervalFn } from "@vueuse/core";
import { useUserStore } from "@/stores/modules/user";
import { useRouter } from "vue-router";

// 1.表单校验
// 2.发送验证码
// 3.提交表单
const props = defineProps({
  unionId: {
    type: String,
    required: true,
    default: "",
  },
});
const form = reactive({
  account: "",
  mobile: "",
  code: "",
  password: "",
  rePassword: "",
});

// 校验规则
const schema = {
  account: MySchema.accountApi, // 注意：这里使用了 accountApi 规则
  mobile: MySchema.mobile,
  code: MySchema.code,
  password: MySchema.password,
  rePassword: MySchema.rePassword, // 需要自定义规则
};
const loginForm = ref(null);
const userStore = useUserStore();
const router = useRouter();
const sending = ref(false);

// 验证码
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
  const valid = schema.mobile(mobile);
  if (valid !== true) {
    loginForm.value?.setFieldError("mobile", valid);
    return message.error(valid);
  }

  try {
    const res = await userQQPatchCode(mobile); // ✅ 传字符串，最终为 ?mobile=xxx
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

const submitting = ref(false);
// 校验表单，返回布尔值
// 立即提交的逻辑
const onSubmit = async () => {
  if (submitting.value) return;
  const { valid } = await loginForm.value.validate();
  if (!valid) return;
  try {
    submitting.value = true;
    const res = await userQQPatchLogin({
      unionId: props.unionId,
      ...form,
    });
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
    router.replace(userStore.redirectUrl);
    message.success("QQ信息注册成功");
  } catch (err) {
    message.error(err?.response?.data?.message || "注册失败");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped lang="less">
.xtx-form {
  width: 350px;
  margin: 0 auto;
}

.xtx-form-item {
  margin-bottom: 20px;
  position: relative;
}

.field {
  position: relative;
  display: flex;
  align-items: center;
}

.field i {
  position: absolute;
  left: 10px;
  font-size: 18px;
  color: #999;
}

.input {
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 36px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  outline: none;
}

.input:focus {
  border-color: #42b983; /* 小兔鲜主题绿色 */
}

.code {
  position: absolute;
  right: 10px;
  top: 0;
  height: 40px;
  line-height: 40px;
  color: #42b983;
  font-size: 14px;
}

.code:hover {
  cursor: pointer;
  text-decoration: underline;
}

.error {
  margin-top: 5px;
  font-size: 12px;
  color: red;
  min-height: 14px; /* 预留空间防止跳动 */
}

.submit {
  display: block;
  width: 100%;
  height: 42px;
  line-height: 42px;
  background: #42b983;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  font-size: 16px;
  transition: all 0.3s;
}

.submit:hover {
  background: #36a673;
}
</style>
