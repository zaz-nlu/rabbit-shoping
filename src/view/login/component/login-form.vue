<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin = true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>

    <Form
      ref="loginForm"
      class="form"
      :validation-schema="schema"
      v-slot="{ errors }"
      autocomplete="off"
    >
      <!-- 用 key 强制切换时重建字段，防止状态交叉污染 -->
      <div :key="isMsgLogin ? 'pwd-login' : 'sms-login'">
        <template v-if="isMsgLogin">
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <!-- 补 name -->
              <Field
                :class="{ error: errors.account }"
                v-model="form.account"
                name="account"
                type="text"
                placeholder="请输入用户名"
              />
            </div>
            <div class="error" v-if="errors.account">
              <i class="iconfont icon-warning" />{{ errors.account }}
            </div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-lock"></i>
              <!-- 补 name -->
              <Field
                :class="{ error: errors.password }"
                v-model="form.password"
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />{{ errors.password }}
          </div>
        </template>

        <template v-else>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <!-- 补 name -->
              <Field
                v-model="form.mobile"
                :class="{ error: errors.mobile }"
                name="mobile"
                type="text"
                placeholder="请输入手机号"
              />
            </div>
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />{{ errors.mobile }}
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-code"></i>
              <!-- 补 name；你原来是 password，我保持不改语义，仅加 name -->
              <Field
                :class="{ error: errors.code }"
                v-model="form.code"
                name="code"
                type="password"
                placeholder="请输入验证码"
              />
              <span class="code">发送验证码</span>
            </div>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />{{ errors.code }}
          </div>
        </template>
      </div>

      <div class="form-item">
        <div class="agree">
          <Field name="isAgree" v-slot="{ value, handleChange }">
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

    <div class="action">
      <img
        src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
        alt=""
      />
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import lycCheckbox from "@/component/libiray/lyc-checkbox.vue";
import { watch } from "vue";
import { reactive, ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { MySchema } from "@/utils/vee-validate-schema.js";
const isMsgLogin = ref(false);
const loginForm = ref(null);
// 表单数据
const form = reactive({
  account: "",
  password: "",
  mobile: "",
  code: "",
  isAgree: false,
});

// 校验基本步骤 vee-validate
// 1. 导入 Form, Field, ErrorMessage 组件，将from和input进行替换，且需要给每个Field补name属性
// 2. Field需要进行数据绑定，且字段要和后端保持一致
// 3.编写Field 的 name属性指定的校验规则
const schema = {
  account: MySchema.account,
  password: MySchema.password,
  mobile: MySchema.mobile,
  code: MySchema.code,
  isAgree: MySchema.isAgree,
};

// 监听isMsgLogin变化，切换时清空表单
watch(isMsgLogin, () => {
  form.account = "";
  form.password = "";
  form.mobile = "";
  form.code = "";
  form.isAgree = false;
  // 如果是没有销毁FIELD组件，之前的校验结果是不会消耗
  // Form组件提供一个resetForm函数清楚校验结果
  loginForm.value.resetForm();
});
</script>

<style scoped lang="less">
/* 账户容器 */
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

.form {
  padding: 0 40px;
}

.form-item {
  margin-bottom: 28px;
}

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

.form-item .input .code {
  position: absolute;
  right: 1px;
  top: 1px;
  text-align: center;
  line-height: 34px;
  font-size: 14px;
  background: #f5f5f5;
  color: #666;
  width: 90px;
  height: 34px;
  cursor: pointer;
}

.agree a {
  color: #069;
}

.btn {
  display: block;
  width: 100%;
  height: 40px;
  color: #fff;
  text-align: center;
  line-height: 40px;
  background: var(--xtxColor);
}

.btn:disabled {
  background: #cfcddc;
}

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
.error {
  color: red;
}
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
</style>
