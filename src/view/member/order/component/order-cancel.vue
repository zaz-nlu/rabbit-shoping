<template>
  <NModal v-model:show="visibleDialog" :mask-closable="false">
    <NCard
      title="取消订单"
      :bordered="false"
      style="width: 500px"
      :segmented="{
        content: true,
        footer: 'soft',
      }"
    >
      <!-- 组件内容 -->
      <div class="cancel-info">
        <p>取消订单后，本单享有的优惠可能会一并取消，是否继续？</p>
        <p class="tip">请选择取消订单的原因（必选）：</p>
        <div class="btn">
          <a
            v-for="item in cancelOrderReason"
            :key="item"
            href="javascript:;"
            :class="{ active: curText === item }"
            @click="curText = item"
          >
            {{ item }}
          </a>
        </div>
      </div>

      <!-- 按钮操作 -->
      <template #footer>
        <NSpace justify="end">
          <NButton @click="visibleDialog = false" style="margin-right: 20px">
            取消
          </NButton>
          <NButton type="primary" @click="submit"> 确认 </NButton>
        </NSpace>
      </template>
    </NCard>
  </NModal>
</template>

<script setup>
import { ref } from "vue";
import { NButton, NCard, NModal, NSpace, useMessage } from "naive-ui";
import { cancelOrderReason } from "@/api/constants";
import { cancelOrderAPI } from "@/api/pay";

const emit = defineEmits(["cancel-success"]);

// 消息提示
const message = useMessage();

// 控制对话框显示
const visibleDialog = ref(false);

// 当前选中的取消原因
const curText = ref("");
const currOrderId = ref("");

// 打开对话框（供父组件调用）
const open = (id) => {
  currOrderId.value = id;
  visibleDialog.value = true;
  curText.value = ""; // 重置选择
};

// 提交取消订单
const submit = async () => {
  if (!curText.value) {
    message.warning("请选择取消原因");
    return;
  }

  try {
    await cancelOrderAPI({
      orderId: currOrderId.value,
      cancelReason: curText.value,
    });
    message.success("取消订单成功");
    visibleDialog.value = false;
    // 通知父组件刷新订单列表
    emit("cancel-success");
  } catch (error) {
    message.error(error.message || "取消订单失败");
  }
};

// 暴露方法给父组件，这样父组件只要给子组件写一个ref引用就可以使用子组件中的方法
defineExpose({
  open,
});
</script>

<style scoped lang="less">
@lycColor: #099268;
.cancel-info {
  p {
    line-height: 1.5;
    margin-bottom: 10px;
  }

  .tip {
    color: #999;
    font-size: 14px;
    margin-top: 15px;
  }

  .btn {
    margin-top: 15px;

    a {
      display: inline-block;
      padding: 8px 16px;
      margin: 0 10px 10px 0;
      border: 1px solid #e4e4e4;
      border-radius: 4px;
      color: #666;
      text-decoration: none;
      transition: all 0.3s;

      &:hover {
        border-color: @lycColor;
        color: @lycColor;
      }

      &.active {
        border-color: @lycColor;
        background-color: @lycColor;
        color: #fff;
      }
    }
  }
}
</style>
