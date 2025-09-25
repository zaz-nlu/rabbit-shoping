<template>
  <div class="address">
    <div class="text">
      <div v-if="!showAddress" class="none">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-else>
        <li><span>收货人：</span>{{ showAddress.receiver }}</li>
        <li><span>联系方式：</span>{{ showAddress.contact }}</li>
        <li>
          <span>收货地址：</span>
          {{ showAddress.fullLocation }} {{ showAddress.address }}
        </li>
      </ul>
      <NButton @click="openEditAddress">修改地址</NButton>
    </div>

    <div class="action">
      <NButton @click="changeAddress" class="btn">切换地址</NButton>
      <NButton @click="addAddress" class="btn">添加地址</NButton>
    </div>
  </div>
  <!-- 对话框 -->
  <!-- v-model:show是语法糖，等价于 :show 和 v-on:update:show -->
  <CheckoutModal
    title="添加收货地址"
    v-model:show="showModal"
    @submit="handleSubmit"
  />

  <!-- 编辑地址对话框 -->
  <CheckoutModal
    :key="visible + '-' + (editForm.id ?? 'new')"
    :title="'修改收货地址'"
    mode="edit"
    v-model:show="visible"
    :initial="editForm"
    @submit="onEditOk"
  />

  <!-- 切换地址对话框 -->
  <NModal v-model:show="showChange" :mask-closable="false">
    <NCard
      style="max-width: 480px; width: 92vw"
      title="切换收货地址"
      :bordered="false"
    >
      <n-radio-group v-model:value="selectedId">
        <div v-for="addr in addressList" :key="addr.id" class="addr-item">
          <n-radio :value="addr.id">
            <div class="addr-main">
              <div class="addr-line">
                <strong>{{ addr.receiver }}</strong
                >&nbsp;&nbsp;{{ addr.contact }}
              </div>
              <div class="addr-line">
                {{ addr.fullLocation }} {{ addr.address }}
              </div>
            </div>
          </n-radio>
        </div>
      </n-radio-group>
      <template #footer>
        <div style="text-align: right">
          <NButton tertiary @click="onCancel">取消</NButton>
          <NButton type="primary" @click="confirmAddress">确认</NButton>
        </div>
      </template>
    </NCard>
  </NModal>
</template>

<script setup>
import { NButton, NCard, NModal, NFormItem, NInput, NForm, c } from "naive-ui";
import { computed, ref, watch, reactive } from "vue";
import CheckoutModal from "./checkout-modal.vue"; //地址表单组件
import { addAddressAPI } from "@/api/pay";
import { editAddressAPI } from "@/api/pay";
import { useMessage } from "naive-ui";

//从父组件后端接来的列表
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
//逻辑
// 1.找到默认的收货地址
// 2.没有默认的收货地址，使用第一条收货地址
// 3.如果没有数据，则提示添加收货地址
console.log("props.list", props.list);
const message = useMessage();

const defaultAddress1 = {
  id: "default-1",
  receiver: "刘宇宸",
  contact: "16622983373",
  fullLocation: "天津市 河北区 建昌道",
  address: "兴盛园小区 七号楼一门401",
};

const currentId = ref(null);

// 3) 计算当前展示地址：优先用 currentId；否则按“默认/第一条”；再否则用占位
const showAddress = computed(() => {
  if (props.list.length > 0) {
    if (currentId.value) {
      return props.list.find((a) => a.id === currentId.value) || props.list[0];
    }
    return (
      props.list.find((a) => a.isDefault === 0 || a.isDefault === true) ||
      props.list[0]
    );
  }
  return defaultAddress1;
});

console.log("showAddress", showAddress.value);
const addressList = computed(() =>
  props.list.length > 0 ? props.list : [defaultAddress1]
);

// 4) 每当父组件把列表更新过来时，初始化 currentId（只在未选择时）
watch(
  () => props.list,
  (list) => {
    if (!currentId.value && list?.length) {
      const def =
        list.find((a) => a.isDefault === 0 || a.isDefault === true) || list[0];
      currentId.value = def.id;
      emit("change", def); // 通知父组件当前选中
    }
  },
  { immediate: true, deep: true }
);

//显示弹窗
const showModal = ref(false);
const addAddress = () => {
  showModal.value = true;
};

// 处理从子组件表单拿到的数据
const handleSubmit = async (data) => {
  console.log("从子组件拿到的数据", data);
  try {
    const payload = {
      receiver: data.receiver,
      contact: data.contact,
      provinceCode: data.provinceCode,
      cityCode: data.cityCode,
      countyCode: data.countyCode,
      address: data.address,
      postalCode: data.postalCode,
      addressTags: data.addressTags,
      fullLocation: data.fullLocation,
      isDefault: data.isDefault, // 看后端约定：0=默认/1=否 或 true/false
    };
    const res = await addAddressAPI(payload);
    console.log("addAddressAPI res", res);
    const newId = res.result.id;
    const newAddress = { id: newId, ...payload };
    console.log("newAddress", newAddress);
    message.success("添加地址成功");
    // 通知父组件添加了新地址
  } catch (error) {
    console.error("添加地址失败", error);
  }
};

// 切换地址
const showChange = ref(false);
const selectedId = ref(null);

const changeAddress = () => {
  showChange.value = true;
  // 当前地址 id 优先；没有就选第一条
  selectedId.value = showAddress.value?.id ?? addressList.value[0]?.id ?? null;
};

const onCancel = () => {
  showChange.value = false;
  console.log("[cancel] set showChange false ->", showChange.value);
};

// 将id提交给父组件
const emit = defineEmits(["change"]);

const confirmAddress = () => {
  console.log("[confirm] selectedId =", selectedId.value);
  const selected = addressList.value.find((a) => a.id === selectedId.value);
  console.log("[confirm] selected object =", selected);
  if (selected) {
    // 关键：只需要更新 currentId，computed(showAddress) 会自动重新取对应地址
    currentId.value = selected.id;
    emit("change", selected);
  }
  showChange.value = false;
  console.log("[confirm] set showChange false ->", showChange.value);
};

// 修改用户地址
const visible = ref(false);
const editForm = reactive({
  id: null,
  receiver: "",
  contact: "",
  fullLocation: "",
  provinceCode: null,
  cityCode: null,
  countyCode: null,
  address: "",
  postalCode: "",
  addressTags: [],
  isDefault: 0,
});
const openEditAddress = () => {
  if (!showAddress.value) return;
  editForm.id = showAddress.value.id ?? null;
  editForm.receiver = showAddress.value.receiver ?? "";
  editForm.contact = showAddress.value.contact ?? "";
  editForm.fullLocation = showAddress.value.fullLocation ?? "";
  editForm.provinceCode = showAddress.value.provinceCode ?? null;
  editForm.cityCode = showAddress.value.cityCode ?? null;
  editForm.countyCode = showAddress.value.countyCode ?? null;
  editForm.address = showAddress.value.address ?? "";
  editForm.postalCode = showAddress.value.postalCode ?? "";
  editForm.addressTags = showAddress.value.addressTags ?? [];
  editForm.isDefault = showAddress.value.isDefault ?? 0;
  visible.value = true;
};
const onEditOk = async (data) => {
  try {
    const payload = {
      id: editForm.id,
      receiver: data.receiver,
      contact: data.contact,
      provinceCode: data.provinceCode,
      cityCode: data.cityCode,
      countyCode: data.countyCode,
      address: data.address,
      postalCode: data.postalCode,
      addressTags: data.addressTags,
      fullLocation: data.fullLocation,
      isDefault: data.isDefault, // 看后端约定：0=默认/1=否 或 true/false
    };
    await editAddressAPI(payload);

    const editAddress = props.list.find((a) => a.id === editForm.id);
    currentId.value = payload.id; // 修改后选中当前编辑的地址
    if (editAddress) {
      Object.assign(editAddress, payload);
    }

    message.success("修改地址成功");
    visible.value = false;
  } catch (error) {
    message.error("修改地址失败，请稍后重试");
  }
};
</script>

<style scoped lang="less">
@xtxColor: #42b983; // 你想要的高亮颜色
@priceColor: #e93b3d; // 价格颜色
.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
        }
      }
    }
    a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
