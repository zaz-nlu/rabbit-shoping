<template>
  <div class="xtx-bread">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style lang="less">
.xtx-bread {
  display: flex;
  padding: 25px 10px;
}

.xtx-bread-item a {
  color: #666;
  transition: all 0.4s;
}

.xtx-bread-item a:hover {
  color: var(--xtxColor); /* 用 CSS 变量代替 less 变量 */
}

.xtx-bread i {
  font-size: 12px;
  margin-left: 5px;
  margin-right: 5px;
  line-height: 22px;
}

/* 隐藏最后一个面包屑项后的分隔箭头。
   结构为： [div.xtx-bread-item][i.iconfont] 重复若干次，
   最后一个 .xtx-bread-item 后也会渲染一个 i 箭头。
   这里用“最后一个 .xtx-bread-item 的紧邻兄弟 i” 来选择并隐藏它。*/
/* 结构调整后：箭头在 .xtx-bread-item 内，隐藏最后一个子项内部的箭头 */
.xtx-bread > .xtx-bread-item:last-of-type i.iconfont {
  display: none;
}
</style>
