<template>
  <div class="member-order">
    <n-card title="我的订单" :bordered="false">
      <!-- Tabs 仅做筛选：没有面板内容 -->
      <n-tabs
        v-model:value="active"
        type="line"
        @update:value="handleTabChange"
        animated
      >
        <n-tab-pane name="all" tab="全部订单" />
        <n-tab-pane name="unpaid" tab="待付款" />
        <n-tab-pane name="unshipped" tab="待发货" />
        <n-tab-pane name="unreceived" tab="待收货" />
        <n-tab-pane name="uncommented" tab="待评价" />
        <n-tab-pane name="completed" tab="已完成" />
        <n-tab-pane name="cancelled" tab="已取消" />
      </n-tabs>
      <lycSpining :loading="loading" text="订单数据加载中..." v-if="loading" />
      <!-- 只有一个列表，根据 active 自动取不同数据 -->
      <div class="order-list">
        <!-- 订单列表 order-item -->
        <orderItem
          @cancelOrder="cancelOrder"
          @deleteOrder="deleteOrder1"
          @confirmOrder="confirmOrder"
          @on-view-logistics="viewLogistics"
          v-for="item in orderList"
          :key="item.id"
          :order="item"
        />
        <!-- 底部分页 -->
        <div class="list-footer">
          <n-pagination
            :page="reqParams.page"
            :page-size="reqParams.pageSize"
            :item-count="total"
            :page-sizes="[5, 10, 15, 20]"
            show-size-picker
            show-quick-jumper
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
          />
        </div>
      </div>
    </n-card>
    <!-- 取消原因组件 -->
    <orderCancel ref="orderCancelRef" @cancel-success="getOrderList" />
    <!-- 物流信息组件 -->
    <orderLogistics ref="orderLogisticsRef" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { NCard, NTabs, NTabPane, useMessage, useDialog } from "naive-ui";
import orderItem from "./component/order-item.vue";
import { findOrderList } from "@/api/pay";
import { reactive } from "vue";
import lycSpining from "@/component/libiray/lyc-spining.vue";
import orderCancel from "./component/order-cancel.vue";
import orderLogistics from "./component/order-logistics.vue";
import { deleteOrderAPI } from "@/api/pay";
import { confirmOrderAPI } from "@/api/pay";

const active = ref("all"); // 当前筛选：all/unpaid/unshipped/...
const loading = ref(false);
// 在顶部调用 naive-ui 的 hooks
const message = useMessage();
const dialog = useDialog();

// 获取数据
const total = ref(0);
const reqParams = reactive({
  page: 1,
  pageSize: 5,
  orderState: 0, // 0-全部 1-待付款 2-待发货 3-待收货 4-待评价 5-已完成 6-已取消
});
const orderList = ref([]);

const getOrderList = async () => {
  loading.value = true;
  console.log("📤 发送请求参数:", reqParams);
  const res = await findOrderList(reqParams);
  console.log("📥 接口返回:", res);
  console.log("📊 总条数:", res.result.counts); // 用 counts
  console.log("📦 当前页数据:", res.result.items);

  orderList.value = res.result.items;
  total.value = res.result.counts; // 用 counts
  loading.value = false;
  console.log("✅ total 赋值后:", total.value);
};

// 分页器事件
const handlePageChange = (newPage) => {
  console.log("🔄 切换到第", newPage, "页");
  reqParams.page = newPage;
  getOrderList();
};

const handlePageSizeChange = (newSize) => {
  console.log("🔄 每页条数改为", newSize);
  reqParams.pageSize = newSize;
  reqParams.page = 1;
  getOrderList();
};

getOrderList();

const tabToStateMap = {
  all: 0,
  unpaid: 1,
  unshipped: 2,
  uncommented: 4,
  completed: 5,
  cancelled: 6,
};

// Tab 切换事件
const handleTabChange = (tabName) => {
  console.log("🔄 切换到tab:", tabName);
  // 更新订单状态
  reqParams.orderState = tabToStateMap[tabName];
  // 重置到第一页
  reqParams.page = 1;
  // 重新获取数据
  getOrderList();
};

// 组件实例，代替了order-cancel组件，可以使用order-cancel的全部功能
// 我们在子组件使用defineExpose暴露方法，在父组件使用ref引用组件实例
// 这样我们在父组件也可以使用子组件中的方法
const orderCancelRef = ref(null);
const cancelOrder = (order) => {
  console.log("🔄 取消订单:", order);
  orderCancelRef.value.open(order.id);
};

//删除操作
const deleteOrder1 = (order) => {
  // 调用 naive-ui 对话框确认删除
  dialog.warning({
    title: "删除确认",
    content: "确定要删除这个订单吗？此操作不可恢复！",
    positiveText: "确定删除",
    negativeText: "取消",
    onPositiveClick: async () => {
      // 调用删除接口
      await deleteOrderAPI(order.id);
      // 删除成功后刷新列表
      getOrderList();
      message.success("删除成功");
    },
  });
};

//确认收货
const confirmOrder = (order) => {
  dialog.warning({
    title: "确认收货",
    content: "确定要确认收货吗？",
    positiveText: "确定收货",
    negativeText: "取消",
    onPositiveClick: async () => {
      await confirmOrderAPI(order.id);
      // 确认收货后刷新列表
      getOrderList();
      message.success("确认收货成功");
    },
  });
};

// 查看物流
const orderLogisticsRef = ref(null);
const viewLogistics = (order) => {
  orderLogisticsRef.value.open(order.id);
};
</script>

<style scoped>
.member-order {
  min-height: 500px;
}
</style>
