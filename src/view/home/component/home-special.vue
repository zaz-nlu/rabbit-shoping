<template>
  <HomePanel title="最新专题">
    <template v-slot:right><lycMore /></template>
    <div class="special-list" ref="target">
      <div class="special-item" v-for="item in specialList" :key="item.id">
        <RouterLink to="/">
          <img v-lazy="item.cover" alt="专题图片" />
          <div class="meta">
            <p class="title">
              <span class="top ellipsis">{{ item.title }}</span>
              <span class="sub ellipsis">{{ item.summary }}</span>
            </p>
            <span class="price">¥{{ item.lowestPrice }}</span>
          </div>
        </RouterLink>
        <div class="foot">
          <span class="like"
            ><i class="iconfont icon-hart1"></i>{{ item.collectNum }}</span
          >
          <span class="view"
            ><i class="iconfont icon-see"></i>{{ item.viewNum }}</span
          >
          <span class="reply"
            ><i class="iconfont icon-message"></i>{{ item.replyNum }}</span
          >
        </div>
      </div>
    </div>
  </HomePanel>
</template>

<script setup>
import { ref } from "vue";
import lycMore from "@/component/libiray/lyc-more.vue";
import HomePanel from "./home-panel.vue";
import { findSpecial } from "@/api/home.js";
import { useLazyData } from "@/hooks";

const target = ref(null);
// 修复：useLazyData 的函数签名是 (target, apiFn)
// 之前误写为 (apiFn, target)，导致 IntersectionObserver.observe 收到的不是 Element
// 正确顺序：第一个参数传 DOM 引用（或 Ref<HTMLElement|null>），第二个传请求函数
const specialList = useLazyData(target, findSpecial);
</script>

<style scoped lang="less">
@priceColor: #e93b3d;
.home-panel {
  background: #f5f5f5;
}

.special-list {
  height: 380px;
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.special-item {
  width: 400px;
  background: #fff;
  /* 原本 .boxShadow() 混入，这里可以替换成常规阴影 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.special-item a {
  display: block;
  width: 100%;
  height: 288px;
  position: relative;
}

.special-item a img {
  width: 100%;
  height: 100%;
}

.special-item a .meta {
  background-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8),
    transparent 50%
  );
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 288px;
}

.special-item .title {
  position: absolute;
  bottom: 0px;
  left: 0;
  padding-left: 16px;
  width: 70%;
  height: 70px;
}

.special-item .title .top {
  color: #fff;
  font-size: 22px;
  display: block;
}

.special-item .title .sub {
  display: block;
  font-size: 19px;
  color: #999;
}

.special-item .price {
  position: absolute;
  bottom: 25px;
  right: 16px;
  line-height: 1;
  padding: 4px 8px 4px 7px;
  color: @priceColor; /* 这里依旧保留变量，你可以替换成具体颜色 */
  font-size: 17px;
  background-color: #fff;
  border-radius: 2px;
}

.foot {
  height: 72px;
  line-height: 72px;
  padding: 0 20px;
  font-size: 16px;
}

.foot i {
  display: inline-block;
  width: 15px;
  height: 14px;
  margin-right: 5px;
  color: #999;
}

.foot .like,
.foot .view {
  float: left;
  margin-right: 25px;
  vertical-align: middle;
}

.foot .reply {
  float: right;
  vertical-align: middle;
}
</style>
