<template>
  <div class="container">
    <!-- 用户信息展示 -->
    <div class="user-info">
      <img :src="avatar" alt="avatar" />
      <p>
        Hi，{{ nickname }} 欢迎来到小兔鲜，完成绑定后即可用 QQ 账号一键登录哦～
      </p>
    </div>

    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="left"
      require-mark-placement="right-hanging"
      size="large"
    >
      <!-- 手机号 -->
      <n-form-item label="手机号" path="mobile">
        <n-input
          v-model:value="form.mobile"
          placeholder="请输入绑定的手机号"
          clearable
          maxlength="11"
          :input-props="{ inputmode: 'numeric' }"
          :allow-input="onlyNumber"
        >
          <template #prefix>
            <i class="iconfont icon-phone" />
          </template>
        </n-input>
      </n-form-item>

      <!-- 验证码 + 发送 -->
      <n-form-item label="验证码" path="code">
        <div class="code-row">
          <n-input
            v-model:value="form.code"
            placeholder="请输入短信验证码"
            clearable
            maxlength="6"
            :input-props="{ inputmode: 'numeric' }"
            :allow-input="onlyNumber"
          >
            <template #prefix>
              <i class="iconfont icon-code" />
            </template>
          </n-input>

          <n-button
            class="send-btn"
            :disabled="sending || time > 0 || !canSend"
            @click="sendCode"
          >
            {{ time === 0 ? "获取验证码" : `${time}s 后重发` }}
          </n-button>
        </div>
      </n-form-item>

      <!-- 绑定按钮 -->
      <n-form-item>
        <n-button
          type="primary"
          block
          round
          :loading="submitting"
          @click="onSubmit"
          style="width: 200px; margin: 0 auto"
        >
          立即绑定
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useMessage } from "naive-ui";
import { userQQBindLogin } from "@/api/user";
import { useUserStore } from "@/stores/modules/user";
import { useCartStore } from "@/stores/modules/cart";
import { useRouter } from "vue-router";

// 补充计时 hook（与 login-form 中保持一致命名）
import { useIntervalFn } from "@vueuse/core";
// 导入发送短信验证码 API
import { userQQBind } from "@/api/user";

const sending = ref(false);
const canSend = ref(true);

// 准备下信息，unionId，头像，昵称
const props = defineProps({
  unionId: {
    type: String,
    required: true,
    default: "",
  },
});

const message = useMessage();

const formRef = ref(null);
const form = ref({
  mobile: "",
  code: "",
});

/** Naive UI 校验规则 */
const rules = {
  mobile: [
    { required: true, message: "请输入手机号", trigger: ["blur", "input"] },
    {
      validator: (_r, v) => /^1\d{10}$/.test(v),
      message: "手机号格式不正确",
      trigger: ["blur", "input"],
    },
  ],
  code: [
    { required: true, message: "请输入验证码", trigger: ["blur", "input"] },
    {
      validator: (_r, v) => /^\d{4,6}$/.test(v),
      message: "验证码格式不正确",
      trigger: ["blur", "input"],
    },
  ],
};

// 1.从props获取unionId

// 2.完成表单验证
const validateForm = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return false;

  // 这里可以做其他的校验，比如检查手机号是否已注册
  return true;

  // 这里可以做其他的校验，比如检查手机号是否已注册
  return true;
};

// 3.发送请求（校验，定义api，调用，完成倒计时
// 4.提交绑定（定义api，调用，成功，失败）

/** 仅允许数字输入 */
const onlyNumber = (val) => !val || /^\d+$/.test(val);

/** 发送验证码（带倒计时） */

/** 提交绑定 */
const submitting = ref(false);
// 立即绑定
const userStore = useUserStore();
const router = useRouter();
const cartStore = useCartStore();
const onSubmit = async () => {
  if (submitting.value) return;

  // 1. 校验表单
  const valid = await validateForm();
  if (!valid) return;

  // 2. 调用 API
  try {
    submitting.value = true;
    const res = await userQQBindLogin({
      unionId: props.unionId,
      ...form.value,
    });
    const {
      id,
      account: acc,
      avatar,
      mobile,
      nickname,
      token,
    } = res.result || {}; //将后端的值给这些字段
    // 3. 成功后将表单的信息给存储到 pinia
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
    } catch (e) {
      message.warning("合并购物车失败，请稍后重试");
    }
    // 跳转至之前想去的页面
    router.replace(userStore.redirectUrl);
    message.success("登录成功");
  } catch (err) {
    message.error(err?.response?.data?.message || "绑定失败");
  } finally {
    submitting.value = false;
  }
};

// 调用QQ得api进行登陆检查，并且从API获取数据，头像，昵称这些
const avatar = ref("");
const nickname = ref("");
if (window.QC && window.QC.Login && window.QC.Login.check()) {
  window.QC.api("get_user_info", {})
    .success(function (res) {
      console.log("获取用户信息成功:", res);
      avatar.value = res.data.figureurl_qq_2 || res.data.figureurl_qq_1;
      nickname.value = res.data.nickname || "QQ用户";
    })
    .error(function (err) {
      console.log(err);
    });
}

// ========== 倒计时逻辑 ==========
// time>0 表示冷却中；useInterval 每秒减 1，减到 0 自动停止
const time = ref(0);

// useIntervalFn 实际返回的是 { pause, resume, isActive }，这里用别名与现有语义保持：start -> resume, stop -> pause
const { pause: stop, resume: start } = useIntervalFn(
  () => {
    time.value--;
    if (time.value <= 0) stop();
  },
  1000,
  false
);
// start（):作用是开始/恢复定时器。调用后，每隔 1000ms 就会执行一次回调函数（也就是 time.value-- 的逻辑）。
// stop（):作用是暂停定时器。调用后，定时器将停止，直到下次调用 start（)。
onMounted(() => {
  // 组件挂载时确保计时器已停止
  stop();
});

// 发送验证码（仅短信登录下可见）：
// 1) 冷却中直接返回；2) 先本地校验手机号；3) getMobileCode 只传字符串；
// 4) 成功后设置 60 秒倒计时；5) 错误时展示后端文案
const sendCode = async () => {
  if (time.value > 0) return; // 冷却中禁止重复点击

  const mobile = form.value.mobile.trim();
  // 简单手机号格式校验（大陆 11 位，以 1 开头）
  if (!/^1\d{10}$/.test(mobile)) {
    return message.error("请输入正确的手机号");
  }

  try {
    sending.value = true;
    const res = await userQQBind(mobile); // ✅ 传字符串，最终为 ?mobile=xxx
    const tip = res.message || res.msg || "验证码已发送";
    message.success(tip);
    time.value = 60;
    // 开始倒计时，每次减少一秒
    start();
  } catch (err) {
    const serverMsg =
      err?.response?.data?.message || err?.response?.data?.msg || err?.message;
    message.error(serverMsg || "发送验证码失败，请稍后重试");
  } finally {
    sending.value = false;
  }
};
</script>

<style scoped lang="less">
.container {
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
  gap: 14px;
}
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;

  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }

  p {
    padding-left: 10px;
  }
}
img {
  width: 80px;
}
.code-row {
  display: flex;
  gap: 12px;
  width: 100%;
}
.code-row .send-btn {
  white-space: nowrap;
}
.iconfont {
  font-size: 16px;
  color: #999;
}
</style>
