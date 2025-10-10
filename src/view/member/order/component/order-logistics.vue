<template>
  <NModal v-model:show="visibleDialog" :mask-closable="false">
    <NCard
      title="物流信息"
      :bordered="false"
      style="width: 600px"
      :segmented="{
        content: true,
      }"
    >
      <!-- 右上角关闭按钮 -->
      <template #header-extra>
        <NButton text @click="visibleDialog = false"> ✕ </NButton>
      </template>
      <!-- 物流商品信息 -->
      <div class="order-logistics-goods" v-if="logistics">
        <a class="image" href="javascript:;">
          <img :src="logistics.picture" alt="" />
          <p>{{ logistics.count }}件商品</p>
        </a>
      </div>

      <!-- 物流公司信息 -->
      <div class="info" v-if="logistics && logistics.company">
        <p><span>配送企业：</span>{{ logistics.company.name }}</p>
        <p><span>快递单号：</span>{{ logistics.company.number }}</p>
        <p><span>联系电话：</span>{{ logistics.company.tel }}</p>
      </div>

      <!-- 物流轨迹列表 -->
      <div class="order-logistics-list" v-if="logistics">
        <div class="item" v-for="(item, i) in logistics.list" :key="item.id">
          <div class="line" :class="{ active: i === 0 }"></div>
          <div class="logistics">
            <p>{{ item.text }}</p>
            <p>{{ item.time }}</p>
          </div>
        </div>
      </div>
    </NCard>
  </NModal>
</template>

<script setup>
import { ref } from "vue";
import { NModal, NCard, NButton } from "naive-ui";
import { queryLogisticsAPI } from "@/api/pay";

// 控制对话框显示
const visibleDialog = ref(false);

// 物流信息数据
const logistics = ref(null);

const currOrder = ref(null);
// 打开对话框（供父组件调用）
const open = async (orderId) => {
  // 调用接口获取物流信息
  const res = await queryLogisticsAPI(orderId);
  logistics.value = res.result;
  currOrder.value = orderId;
  visibleDialog.value = true;
};

// 暴露方法给父组件
defineExpose({
  open,
});
</script>

<style scoped lang="less">
.order-logistics-goods {
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 20px;

  .image {
    display: block;
    text-align: center;

    img {
      width: 92px;
      height: 92px;
    }

    p {
      margin-top: 10px;
      color: #999;
    }
  }
}

.info {
  padding: 20px 0;
  border-bottom: 1px solid #f5f5f5;

  p {
    line-height: 30px;

    span {
      color: #999;
      width: 90px;
      display: inline-block;
    }
  }
}

.order-logistics-list {
  padding-top: 20px;

  .item {
    display: flex;
    position: relative;

    .line {
      width: 27px;
      border-left: 2px solid #f5f5f5;
      position: relative;

      &::before {
        content: "";
        position: absolute;
        left: -4px;
        top: 0;
        width: 6px;
        height: 6px;
        border: 2px solid #f5f5f5;
        background: #fff;
        border-radius: 50%;
      }

      &.active {
        border-color: #099268;

        &::before {
          border-color: #099268;
          background: #099268;
        }
      }
    }

    .logistics {
      flex: 1;
      padding-bottom: 20px;

      p {
        &:first-child {
          color: #666;
          margin-bottom: 5px;
        }

        &:last-child {
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
