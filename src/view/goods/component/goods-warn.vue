<template>
  <div class="policy-card">
    <div class="policy-header">
      <h3>注意事项</h3>
      <span class="sub">Shipping & Returns / 常见问题</span>
    </div>

    <n-collapse
      :theme-overrides="collapseTheme"
      arrow-placement="right"
      accordion
    >
      <n-collapse-item name="ship-fee">
        <template #header>
          <b>购物运费如何收取？</b>
        </template>
        <div class="answer">
          单笔订单满 <strong>¥88</strong>（不含运费）免邮；未满收取
          <strong>¥10</strong> 运费。 <br />港澳台地区满
          <strong>¥500</strong> 免邮，未满按地区标准计费。
        </div>
      </n-collapse-item>

      <n-collapse-item name="carrier">
        <template #header>
          <b>使用什么快递发货？</b>
        </template>
        <div class="answer">
          默认
          <strong>顺丰</strong>，部分商品可能根据仓配策略切换其他合作承运商。
          配送范围覆盖中国大陆大部分地区（港澳台地区另行说明）。
        </div>
      </n-collapse-item>

      <n-collapse-item name="return">
        <template #header>
          <b>如何申请退换货？</b>
        </template>
        <ul class="list">
          <li>
            自签收之日起
            <strong>30 日</strong> 内支持无忧退货（不影响二次销售）。
          </li>
          <li>内衣/食品等特殊类目除质量问题外不支持退换。</li>
          <li>
            流程：<span class="muted"
              >确认收货 → 在线申请 → 审核通过 → 寄回 → 验货 → 退款</span
            >。
          </li>
          <li>因平台原因产生的退货邮费由平台承担；其他情形按政策执行。</li>
        </ul>
      </n-collapse-item>

      <n-collapse-item name="tips">
        <template #header>
          <b>温馨提示</b>
        </template>
        <div class="answer">
          请保留发票与完整包装以便售后；如需帮助，联系在线客服（9:00–21:00）。
        </div>
      </n-collapse-item>
    </n-collapse>
  </div>
</template>

<script setup>
const collapseTheme = {
  Collapse: {
    titleTextColor: "#222",
    itemTextColor: "#555",
    dividerColor: "#f0f0f0",
    arrowColor: "#999",
  },
};
</script>

<style scoped lang="less">
.policy-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 16px 18px;
}

.policy-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 8px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #222;
    margin: 0;
  }
  .sub {
    font-size: 12px;
    color: #999;
  }
}

/* 内容风格：电商常见的灰度、紧凑行距 */
.answer {
  color: #4b4b4b;
  line-height: 1.7;
  font-size: 14px;

  strong {
    color: #222;
  }
}

.list {
  margin: 0;
  padding-left: 16px;
  color: #4b4b4b;
  line-height: 1.7;
  font-size: 14px;

  li + li {
    margin-top: 6px;
  }
  .muted {
    color: #888;
  }
}

/* 细节：项之间更轻的分隔 */
:deep(.n-collapse-item) {
  border-bottom: 1px solid #f3f3f3;
}
:deep(.n-collapse-item:last-child) {
  border-bottom: none;
}

/* 响应式留白 */
@media (min-width: 768px) {
  .policy-card {
    padding: 20px 22px;
  }
}
</style>
