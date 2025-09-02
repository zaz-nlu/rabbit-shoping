<template>
  <div class="sub-sort">
    <div class="sort">
      <a
        :class="{ active: sortParams.sortField === null }"
        @click="changeSort(null)"
        href="javascript:;"
      >
        默认排序
      </a>

      <a
        :class="{ active: sortParams.sortField === 'publishTime' }"
        @click="changeSort('publishTime')"
        href="javascript:;"
      >
        最新商品
      </a>

      <a
        :class="{ active: sortParams.sortField === 'orderNum' }"
        @click="changeSort('orderNum')"
        href="javascript:;"
      >
        最高人气
      </a>

      <a
        :class="{ active: sortParams.sortField === 'evaluateNum' }"
        @click="changeSort('evaluateNum')"
        href="javascript:;"
      >
        评论最多
      </a>

      <!-- 价格排序：根据状态切换 is-asc / is-desc -->
      <a
        href="javascript:;"
        @click="changeSort('price')"
        class="price"
        :class="{
          'is-asc':
            sortParams.sortField === 'price' && sortParams.sortMethod === 'asc',
          'is-desc':
            sortParams.sortField === 'price' &&
            sortParams.sortMethod === 'desc',
        }"
      >
        价格排序
        <i class="arrow up"></i>
        <i class="arrow down" @click.stop="changeSort('desc')"></i>
      </a>
    </div>
    <div class="check">
      <lycCheckbox @change="changeCheck" v-model="sortParams.inventory"
        >仅显示有货商品</lycCheckbox
      >
      <lycCheckbox @change="changeCheck" v-model="sortParams.onlyDiscount"
        >仅显示特惠商品</lycCheckbox
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import lycCheckbox from "@/component/libiray/lyc-checkbox.vue";
import { reactive } from "vue";
// 1.看后端接口文件 明确我们需要哪些交换数据字段
const sortParams = reactive({
  inventory: false,
  onlyDiscount: false,
  sortField: null,
  sortMethod: null,
});
const emit = defineEmits(["sort-change"]);
// 将数据给模板使用
// 1.先让默认排序高亮，利用active
// 2，写点击按钮的函数，然后触发事件
const changeSort = (key) => {
  // 如果你点击了价格排序，首先要判断当前的排序方式，现在传入的是price
  // 所以我们分成两种情况，一种是普通的几个排序，一种是带箭头的价格排序
  if (key === "price") {
    // 先把传入的key参数给定义好的Params对象
    sortParams.sortField = key;
    // 如果你还没有选价格排序
    if (sortParams.sortMethod === null) {
      // 默认是asc
      sortParams.sortMethod = "asc";
    } else {
      // 切换方向，首次默认为 asc
      sortParams.sortMethod = sortParams.sortMethod === "asc" ? "desc" : "asc";
    }
  } else {
    // 赋予参数
    // 如果你点的和当前的一样，就不做任何操作
    if (sortParams.sortField === key) {
      return;
    }
    sortParams.sortField = key;
    // 重置选中的排序方法
    sortParams.sortMethod = null;
  }
  //触发sort-change事件
  emit("sort-change", { ...sortParams });
};

const changeCheck = () => {
  emit("sort-change", { ...sortParams });
};
</script>

<style lang="less" scoped>
/* 容器：白底卡片 + 内边距 + 轻边框 */
.sub-sort {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

/* 左侧：排序项 */
.sort {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* 通用按钮样式（默认为灰色描边按钮） */
.sort a {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 14px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
  line-height: 1;
  background: #fff;
  transition: all 0.2s ease;
  text-decoration: none;
  cursor: pointer;
}

/* 悬停态：电商常见的主色描边 + 字色 */
.sort a:hover {
  border-color: var(--xtxColor, #27ba9b);
  color: var(--xtxColor, #27ba9b);
  background: rgba(39, 186, 155, 0.06);
}

/* 选中态（当前排序） */
.sort a.active {
  background: var(--xtxColor, #27ba9b);
  border-color: var(--xtxColor, #27ba9b);
  color: #fff;
}

/* 价格排序需要给右侧箭头留空间 */
.sort a.price {
  padding-right: 34px; /* 为上下箭头留位 */
}

/* 箭头基样式（CSS 三角形） */
.sort a.price .arrow {
  position: absolute;
  right: 10px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  pointer-events: none;
  opacity: 0.9;
}

/* 上箭头（默认灰） */
.sort a.price .arrow.up {
  top: 7px;
  border-bottom: 6px solid #c8c8c8;
}

/* 下箭头（默认灰） */
.sort a.price .arrow.down {
  top: 17px;
  border-top: 6px solid #c8c8c8;
}

/* 升序激活：上箭头高亮 */
.sort a.price.is-asc .arrow.up {
  border-bottom-color: var(--xtxColor, #27ba9b);
}

/* 降序激活：下箭头高亮 */
.sort a.price.is-desc .arrow.down {
  border-top-color: var(--xtxColor, #27ba9b);
}

/* 键盘可达性 */
.sort a:focus-visible {
  outline: 2px solid rgba(39, 186, 155, 0.3);
  outline-offset: 2px;
}

/* 右侧：筛选复选框区域 */
.check {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* 复选框文案更接近正文色 */
.check .xtx-checkbox {
  color: #333;
  margin-left: 0; /* 去掉旧的左外边距 */
}

/* 两个复选框之间的间距 */
.check .xtx-checkbox + .xtx-checkbox {
  margin-left: 10px;
}

/* 小屏下堆叠显示，更贴合电商移动端 */
@media (max-width: 768px) {
  .sub-sort {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .sort {
    gap: 8px;
  }
}
</style>
