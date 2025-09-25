<template>
  <!-- 弹窗 -->
  <NModal v-model:show="show" :mask-closable="false">
    <NCard
      style="max-width: 720px; width: 92vw"
      :title="mode === 'edit' ? '修改收货地址' : title || '添加收货地址'"
      :bordered="false"
    >
      <NForm
        ref="formRef"
        :model="form"
        :rules="rules"
        label-placement="left"
        :label-width="80"
        require-mark-placement="right-hanging"
        size="large"
      >
        <NFormItem label="收货人" path="receiver">
          <NInput v-model:value="form.receiver" placeholder="请输入收货人" />
        </NFormItem>

        <NFormItem label="手机号" path="contact">
          <NInput
            v-model:value="form.contact"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </NFormItem>

        <NFormItem label="地区" path="fullLocation">
          <lyc-city
            :full-location="form.fullLocation"
            @change="onCityChange"
            placeholderText="请选择省市区"
          />
        </NFormItem>

        <NFormItem label="地址" path="address">
          <NInput
            v-model:value="form.address"
            placeholder="请输入详细地址"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
          />
        </NFormItem>

        <NFormItem label="邮政" path="postalCode">
          <NInput
            v-model:value="form.postalCode"
            placeholder="请输入邮政编码"
            maxlength="6"
          />
        </NFormItem>

        <NFormItem label="标签" path="addressTags">
          <NInput
            v-model:value="form.addressTags"
            placeholder="请输入地址标签，如：家/公司"
          />
        </NFormItem>
      </NForm>

      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 12px">
          <NButton @click="onReset">重置</NButton>
          <NButton tertiary @click="onCancel">取消</NButton>
          <NButton type="primary" @click="onSubmit">{{
            mode === "edit" ? "保存修改" : "确认"
          }}</NButton>
        </div>
      </template>
    </NCard>
  </NModal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useMessage } from "naive-ui";
import { NModal, NCard, NForm, NFormItem, NInput, NButton } from "naive-ui";
import lycCity from "@/component/libiray/lyc-city.vue";

// ========== props 定义 ==========
// 父组件会用 v-model:show 控制弹窗是否显示
// 所以子组件这里接收一个 props: show
const props = defineProps({
  show: Boolean,
  title: String,
  mode: { type: String, default: "create" }, // 'create' | 'edit'
  initial: { type: Object, default: null }, // 编辑时的初始数据（含 id 等）
});

// ========== emits 定义 ==========
// 子组件需要向父组件发事件：
// 1. "update:show" —— 用来配合 v-model:show，控制弹窗开关
//    比如 emit("update:show", false) 就等于告诉父组件把 showModal 设为 false
// 2. "submit" —— 当表单提交成功时，把表单数据传给父组件
//    比如 emit("submit", { name: "张三", mobile: "138..." })
const emit = defineEmits(["update:show", "submit"]);

// ========== show 计算属性 ==========
// 通过 computed 做一个中间层，方便直接操作 props.show
// - get：读取 props.show
// - set：修改时触发 emit("update:show", v)，通知父组件修改 show 的值
// 这样就省得我们每次修改都要发出请求了
const show = computed({
  get: () => props.show,
  set: (v) => emit("update:show", v),
});

const onCityChange = (payload) => {
  form.value.fullLocation = payload.fullLocation;
  // 如果你想要用代码，下面这几行按需保留
  form.value.provinceCode = payload.provinceCode;
  form.value.cityCode = payload.cityCode;
  form.value.countyCode = payload.countyCode;
};

// ========== 表单相关 ==========
// 表单实例，用于调用校验方法
const formRef = ref(null);

// 全局提示（naive-ui 的 useMessage）
const message = useMessage();

// 表单数据（双向绑定到 NForm / NInput 等）
const form = ref({
  receiver: "", // 收货人
  contact: "", // 联系方式
  provinceCode: null, // 省份编码
  cityCode: null, // 城市编码
  countyCode: null, // 区县编码
  address: "", // 详细地址
  postalCode: "", // 邮政编码（注意名字是 postalCode）
  addressTags: "", // 地址标签（注意复数）
  isDefault: 1, // 0=默认，1=否
  fullLocation: "", // 这是你自己前端展示用的（不是后端要求）
});

watch(
  () => props.show,
  (visible) => {
    if (visible && props.mode === "edit" && props.initial) {
      // 做一次浅拷贝，避免直接改 props
      const init = { ...props.initial };
      // 防御：有的后端是 0/1、有的是 true/false
      if (init.isDefault === true) init.isDefault = 0;
      if (init.isDefault === false) init.isDefault = 1;

      // 统一把数组标签转成可编辑的字符串（逗号分隔）
      if (Array.isArray(init.addressTags)) {
        init.addressTags = init.addressTags.join("，");
      }

      Object.assign(form.value, {
        receiver: init.receiver ?? "",
        contact: init.contact ?? "",
        provinceCode: init.provinceCode ?? null,
        cityCode: init.cityCode ?? null,
        countyCode: init.countyCode ?? null,
        address: init.address ?? "",
        postalCode: init.postalCode ?? "",
        addressTags: init.addressTags ?? "",
        isDefault: init.isDefault ?? 1,
        fullLocation: init.fullLocation ?? "",
        // 可选：保留 id 在内部，提交时一并回传
        id: init.id,
      });
      // 清掉校验状态
      console.log("表单数据", form.value);
      formRef.value?.restoreValidation();
    }
    if (!visible && props.mode === "create") {
      // 关闭时如果是新增模式，顺便重置
      onReset();
    }
  },
  { immediate: true }
);

// 表单验证规则
const rules = {
  // 收货人
  receiver: {
    required: true,
    message: "请输入收货人",
    trigger: ["input", "blur"],
  },

  // 手机号
  contact: {
    required: true,
    trigger: ["input", "blur"],
    validator(_, value) {
      return /^1[3-9]\d{9}$/.test(value) || new Error("请输入有效手机号");
    },
  },

  // 地区
  fullLocation: {
    required: true,
    message: "请选择所在地区",
    trigger: "change",
  },

  // 详细地址
  address: {
    required: true,
    message: "请输入详细地址",
    trigger: ["input", "blur"],
  },

  // 邮政编码（可选，填了就必须合法）
  postalCode: {
    trigger: ["input", "blur"],
    validator(_, value) {
      if (!value) return true; // 允许为空
      return /^\d{6}$/.test(value) || new Error("邮政编码必须为6位数字");
    },
  },

  // 地址标签（可选，比如：家、公司）
  addressTags: {
    trigger: ["input", "blur"],
    validator(_, value) {
      if (!value) return true; // 可不填
      return value.length <= 10 || new Error("标签不能超过10个字");
    },
  },
};

// ========== 提交方法 ==========
// 点击确认按钮时触发
function onSubmit() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      // 表单验证通过
      // 1. 通过 emit("submit", 表单数据) 把数据传给父组件
      emit("submit", { ...form.value });
      // 2. 关闭弹窗（通过 v-model 触发父组件更新）
      show.value = false;
      // 3. 给出提示
      message.success("地址已保存");
    } else {
      // 表单没填好
      message.error("请完善表单");
    }
  });
}
// 点击取消按钮时触发
function onCancel() {
  show.value = false;
}

// 点击重置按钮时触发
function onReset() {
  Object.assign(form.value, {
    receiver: "", // 收货人
    contact: "", // 联系方式
    provinceCode: null, // 省份编码
    cityCode: null, // 城市编码
    countyCode: null, // 区县编码
    address: "", // 详细地址
    postalCode: "", // 邮政编码（注意名字是 postalCode）
    addressTags: "", // 地址标签（注意复数）
    isDefault: 1, // 0=默认，1=否
    fullLocation: "", // 这是你自己前端展示用的（不是后端要求）
  });
  // 清除校验状态
  formRef.value?.restoreValidation();
}
</script>

<style scoped>
.action {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.btn {
  /* 可按需自定义 */
}
</style>
