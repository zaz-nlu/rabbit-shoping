<template>
  <div class="goods-comment">
    <!-- 顶部：数据 + 标签 -->
    <div class="head">
      <div class="data">
        <p>
          <span>{{ buyCount }}</span
          >人购买
        </p>
        <p>
          <span>{{ goodRate }}</span
          >好评率
        </p>
      </div>

      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            v-for="t in tags"
            :key="t.key"
            href="javascript:;"
            :class="{ active: activeTag === t.key }"
            @click="activeTag = t.key"
          >
            {{ t.label }} （{{ t.count }}）
          </a>
        </div>
      </div>
    </div>

    <!-- 排序 -->
    <div class="sort">
      <span>排序：</span>
      <a
        href="javascript:;"
        :class="{ active: sortKey === 'default' }"
        @click="sortKey = 'default'"
        >默认</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortKey === 'latest' }"
        @click="sortKey = 'latest'"
        >最新</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortKey === 'hot' }"
        @click="sortKey = 'hot'"
        >最热</a
      >
    </div>

    <!-- 列表 -->
    <div class="list">
      <div v-for="c in shownComments" :key="c.id" class="comment-item">
        <div class="row">
          <b>{{ c.user }}</b>
          <span class="star">⭐ {{ c.star }}</span>
          <span class="time">{{ c.time }}</span>
        </div>
        <div class="content">{{ c.content }}</div>
        <div class="tags" v-if="c.tags?.length">
          <span class="chip" v-for="t in c.tags" :key="t">{{ t }}</span>
        </div>
      </div>
      <div v-if="shownComments.length === 0" class="empty">暂无相关评价</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject, computed } from "vue";
import { findGoodsComment } from "@/api/product";

/** 基础数据（购买人数/好评率可从接口来，这里先给默认值） */
const buyCount = ref(100);
const goodRate = ref("99.99%");

/** 评论原始数据：先给假数据，接口成功后会覆盖 */
const comments = ref([
  {
    id: 1,
    user: "小明",
    content: "质量不错，物流很快！",
    star: 5,
    time: "2025-05-01",
    likes: 12,
    tags: ["好吃"],
  },
  {
    id: 2,
    user: "小红",
    content: "包装一般，但性价比高。",
    star: 4,
    time: "2025-05-03",
    likes: 5,
    tags: ["便宜"],
  },
  {
    id: 3,
    user: "阿强",
    content: "回购第二次了。",
    star: 5,
    time: "2025-05-06",
    likes: 22,
    tags: ["很好", "再来一次"],
  },
  {
    id: 4,
    user: "Lynn",
    content: "快递员服务不错。",
    star: 4,
    time: "2025-05-10",
    likes: 3,
    tags: ["快递棒"],
  },
]);

/** 标签与排序状态 */
const activeTag = ref("all"); // all | 好吃 | 便宜 | 很好 | 再来一次 | 快递棒
const sortKey = ref("default"); // default | latest | hot

/** 按你项目的依赖：拿到商品 id 调接口 */
const goods = inject("goods"); // 父组件 provide 的商品对象

onMounted(async () => {
  try {
    const res = await findGoodsComment(goods.value.id);
    // 期望后端结构：{ result: { list: [], buyCount: 0, goodRate: '99%' } }
    if (res?.result?.list?.length) comments.value = res.result.list;
    if (res?.result?.buyCount) buyCount.value = res.result.buyCount;
    if (res?.result?.goodRate) goodRate.value = res.result.goodRate;
  } catch (e) {
    // 失败就使用上面的本地假数据
    console.log("获取商品评价失败，已使用本地假数据");
  }
});

/** 计算标签数据（右边“大家都在说”部分） */
const tags = computed(() => {
  // 用 Map 统计每个标签出现的次数
  const map = new Map();
  comments.value.forEach((c) =>
    (c.tags || []).forEach(
      (t) => map.set(t, (map.get(t) || 0) + 1) // 如果已有 +1，没有则初始化为 1
    )
  );

  // 全部评论的数量
  const allCount = comments.value.length;

  // 返回一个数组，包含“全部评价”和每个标签的统计
  return [
    { key: "all", label: "全部评价", count: allCount },
    // 将map变成一个真正的数组
    ...Array.from(map.entries()).map(([k, v]) => ({
      key: k, // 标签的 key，比如 "好吃"
      label: k, // 标签显示文字
      count: v, // 出现次数，比如 10
    })),
  ];
});

/** 过滤 + 排序后的最终评论列表（中间大列表显示的内容） */
const shownComments = computed(() => {
  // 先复制一份评论数组，避免直接修改原数组
  let list = comments.value.slice();

  // 1. 按标签过滤
  // 如果当前选择的不是“全部”，就筛选出含有该标签的评论
  if (activeTag.value !== "all") {
    list = list.filter((c) => c.tags?.includes(activeTag.value));
  }

  // 2. 按排序方式排序
  if (sortKey.value === "latest") {
    // 最新：按时间倒序排列
    list.sort((a, b) => new Date(b.time) - new Date(a.time));
  } else if (sortKey.value === "hot") {
    // 最热：按点赞/热度（likes 字段）从高到低
    list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  }

  // 3. 返回最终结果
  return list;
});
</script>
<style scoped lang="less">
@priceColor: #e4393c;
@txtColor: #63e6be;
.goods-comment .head {
  display: flex;
  padding: 30px 0;
}

.goods-comment .head .data {
  width: 400px;
  display: flex;
  padding: 20px;
}

.goods-comment .head .data p {
  flex: 1;
  text-align: center;
}

.goods-comment .head .data p span {
  display: block;
}

.goods-comment .head .data p span:first-child {
  font-size: 32px;
  color: @priceColor;
}

.goods-comment .head .data p span:last-child {
  color: #999;
}

.goods-comment .tags {
  display: flex;
  border-left: 1px solid #f5f5f5;
}

.goods-comment .tags .dt {
  font-weight: bold;
  width: 100px;
  text-align: right;
  line-height: 42px;
}

.goods-comment .tags .dd {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}

.goods-comment .tags .dd a {
  width: 132px;
  height: 42px;
  margin-left: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  border: 1px solid #e4e4e4;
  background: #f5f5f5;
  color: #999;
  text-align: center;
  line-height: 40px;
}

.goods-comment .tags .dd a:hover {
  border-color: @txtColor;
  background: lighten(@txtColor, 50%);
  color: @txtColor;
}

.goods-comment .tags .dd a.active {
  border-color: @txtColor;
  background: @txtColor;
  color: #fff;
}

.goods-comment .sort {
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #f5f5f5;
  border-bottom: 1px solid #f5f5f5;
  margin: 0 20px;
  color: #666;
}

.goods-comment .sort > span {
  margin-left: 20px;
}

.goods-comment .sort > a {
  margin-left: 30px;
}

.goods-comment .sort > a.active,
.goods-comment .sort > a:hover {
  color: @txtColor;
}

.list {
  padding: 12px 0 20px;
}
.comment-item {
  padding: 12px 0;
  border-bottom: 1px solid #f2f2f2;
}
.comment-item .row {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #666;
}
.comment-item .row b {
  color: #333;
}
.comment-item .star {
  font-size: 12px;
}
.comment-item .time {
  margin-left: auto;
  font-size: 12px;
  color: #999;
}
.comment-item .content {
  margin-top: 6px;
  color: #333;
}
.comment-item .chip {
  display: inline-block;
  padding: 2px 8px;
  margin-top: 6px;
  margin-right: 6px;
  font-size: 12px;
  color: #666;
  background: #f6f6f6;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
}
</style>
