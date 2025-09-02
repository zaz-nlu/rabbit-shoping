<template>
  <!-- overlay（可选） -->
  <div
    v-if="overlay"
    class="spinner-overlay"
    :style="{ backgroundColor: overlayBg }"
  >
    <div class="spinner-wrap">
      <svg
        class="spinner"
        :width="sizePx"
        :height="sizePx"
        viewBox="0 0 50 50"
        role="status"
        aria-live="polite"
        :aria-label="ariaLabel"
        :style="{
          '--spinner-color': color,
          '--spinner-thickness': thickness + 'px',
          '--spinner-speed': speed + 's',
        }"
      >
        <!-- 背景轨道（淡色，可选） -->
        <circle
          class="track"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="rgba(0,0,0,.08)"
          :stroke-width="thickness"
        />
        <!-- 运动的进度条（GitHub风格：不闭合的圆弧 + 旋转） -->
        <circle
          class="arc"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          :stroke-width="thickness"
          stroke-linecap="round"
        />
      </svg>
      <div v-if="text" class="spinner-text">{{ text }}</div>
    </div>
  </div>

  <!-- 非 overlay 模式 -->
  <div v-else class="spinner-inline" :style="{ gap: text ? '10px' : 0 }">
    <svg
      class="spinner"
      :width="sizePx"
      :height="sizePx"
      viewBox="0 0 50 50"
      role="status"
      aria-live="polite"
      :aria-label="ariaLabel"
      :style="{
        '--spinner-color': color,
        '--spinner-thickness': thickness + 'px',
        '--spinner-speed': speed + 's',
      }"
    >
      <circle
        class="track"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="rgba(0,0,0,.08)"
        :stroke-width="thickness"
      />
      <circle
        class="arc"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        :stroke-width="thickness"
        stroke-linecap="round"
      />
    </svg>
    <div v-if="text" class="spinner-text">{{ text }}</div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: { type: [Number, String], default: 32 }, // px
  color: { type: String, default: "#42b983" }, // 主题色
  thickness: { type: Number, default: 3 }, // 线宽(px)
  speed: { type: Number, default: 0.8 }, // 一圈秒数
  text: { type: String, default: "" }, // 旁边/下面文案
  overlay: { type: Boolean, default: false }, // 是否遮罩
  overlayBg: { type: String, default: "rgba(255,255,255,.7)" }, // 遮罩背景
  ariaLabel: { type: String, default: "加载中" },
});
const sizePx = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size
);
</script>

<style scoped>
.spinner-inline {
  display: inline-flex;
  align-items: center;
}

.spinner-overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 2000;
}
.spinner-wrap {
  text-align: center;
}

.spinner-text {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

/* GitHub/Primer 风格圆环：用 stroke-dasharray 做不完整圆弧 + 旋转 */
.spinner .arc {
  stroke: var(--spinner-color, #42b983);
  stroke-dasharray: 90 150; /* 可见段/空白段长度（与半径配合） */
  transform-origin: 50% 50%;
  animation: spinner-rotate var(--spinner-speed, 0.8s) linear infinite,
    spinner-dash 1.4s ease-in-out infinite;
}

/* 旋转动画（整环旋转） */
@keyframes spinner-rotate {
  100% {
    transform: rotate(360deg);
  }
}

/* dash 动画（弧长在增减，产生“跑动感”） */
@keyframes spinner-dash {
  0% {
    stroke-dasharray: 1 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90 150;
    stroke-dashoffset: -40;
  }
  100% {
    stroke-dasharray: 90 150;
    stroke-dashoffset: -120;
  }
}

/* 轨道颜色（淡） */
.track {
  opacity: 0.9;
}

/* 允许自定义线宽（也能直接从属性传） */
.spinner .arc,
.spinner .track {
  stroke-width: var(--spinner-thickness, 3px);
}
</style>
