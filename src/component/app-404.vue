<template>
  <section class="nf404" role="main" aria-labelledby="nf404-title">
    <!-- 背景渐变 -->
    <div class="nf404__bg" aria-hidden="true"></div>

    <!-- 主卡片 -->
    <div class="nf404__card">
      <!-- 插画（纯 SVG，轻量+可主题色） -->
      <div class="nf404__art" aria-hidden="true">
        <svg viewBox="0 0 600 300" class="nf404__svg">
          <!-- 天空光晕 -->
          <defs>
            <radialGradient id="gSun" cx="50%" cy="35%" r="60%">
              <stop
                offset="0%"
                stop-color="var(--nf-accent-200)"
                stop-opacity="0.9"
              />
              <stop
                offset="100%"
                stop-color="var(--nf-accent-100)"
                stop-opacity="0"
              />
            </radialGradient>
            <linearGradient id="gHill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--nf-green-300)" />
              <stop offset="100%" stop-color="var(--nf-green-400)" />
            </linearGradient>
            <linearGradient id="gLeaf" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="var(--nf-green-500)" />
              <stop offset="100%" stop-color="var(--nf-green-600)" />
            </linearGradient>
          </defs>

          <!-- 太阳光晕 -->
          <circle cx="420" cy="70" r="120" fill="url(#gSun)" />

          <!-- 云朵 -->
          <g class="cloud cloud--1">
            <ellipse
              cx="110"
              cy="70"
              rx="40"
              ry="20"
              fill="white"
              opacity="0.9"
            />
            <ellipse
              cx="140"
              cy="70"
              rx="30"
              ry="16"
              fill="white"
              opacity="0.9"
            />
            <ellipse
              cx="125"
              cy="58"
              rx="26"
              ry="14"
              fill="white"
              opacity="0.95"
            />
          </g>
          <g class="cloud cloud--2">
            <ellipse
              cx="470"
              cy="50"
              rx="38"
              ry="18"
              fill="white"
              opacity="0.9"
            />
            <ellipse
              cx="500"
              cy="50"
              rx="28"
              ry="14"
              fill="white"
              opacity="0.9"
            />
            <ellipse
              cx="485"
              cy="40"
              rx="22"
              ry="12"
              fill="white"
              opacity="0.95"
            />
          </g>

          <!-- 群山/草坡 -->
          <path
            d="M0,200 C100,160 140,150 210,180 C290,215 350,180 420,190 C510,205 560,190 600,200 L600,300 L0,300 Z"
            fill="url(#gHill)"
          />
          <path
            d="M0,210 C120,190 200,210 300,225 C420,245 520,220 600,230 L600,300 L0,300 Z"
            fill="var(--nf-green-350)"
          />

          <!-- 树叶（轻微摆动动画） -->
          <g class="leaf" transform="translate(90,205) rotate(-12)">
            <path
              d="M0,0 C22,-8 40,8 28,26 C16,45 -10,40 -12,20 C-14,6 -4,2 0,0 Z"
              fill="url(#gLeaf)"
            />
            <path
              d="M-2,2 L20,16"
              stroke="white"
              stroke-opacity="0.6"
              stroke-width="1.5"
            />
          </g>
          <g class="leaf" transform="translate(520,215) rotate(8)">
            <path
              d="M0,0 C22,-8 40,8 28,26 C16,45 -10,40 -12,20 C-14,6 -4,2 0,0 Z"
              fill="url(#gLeaf)"
            />
            <path
              d="M-2,2 L20,16"
              stroke="white"
              stroke-opacity="0.6"
              stroke-width="1.5"
            />
          </g>

          <!-- 小鸟（轻微上下浮动） -->
          <g class="bird" transform="translate(360,95)">
            <path
              d="M0,0 q10,-6 20,0 q-10,6 -20,0Z"
              fill="var(--nf-accent-300)"
            />
          </g>
          <g class="bird" transform="translate(330,115) scale(0.8)">
            <path
              d="M0,0 q10,-6 20,0 q-10,6 -20,0Z"
              fill="var(--nf-accent-300)"
            />
          </g>
        </svg>

        <!-- 巨型“404”字样（带轻微浮动） -->
        <div class="nf404__code" aria-hidden="true">404</div>
      </div>

      <!-- 文案 -->
      <h1 id="nf404-title" class="nf404__title">糟糕，页面飞走啦</h1>
      <p class="nf404__desc">
        我们没能找到你要的页面。别担心，你可以搜索想要的商品，或者先回首页逛逛。
      </p>

      <!-- 搜索框（可选） -->
      <form class="nf404__search" @submit.prevent="handleSearch">
        <input
          v-if="showSearch"
          v-model="keyword"
          :placeholder="searchPlaceholder"
          class="nf404__input"
          type="search"
          name="q"
          aria-label="站内搜索"
        />
        <button
          v-if="showSearch"
          type="submit"
          class="nf404__btn nf404__btn--primary"
        >
          搜索
        </button>
      </form>

      <!-- 快捷入口 -->
      <div class="nf404__actions" role="navigation" aria-label="快捷入口">
        <a :href="homeHref" class="nf404__btn nf404__btn--ghost">返回首页</a>
        <a v-if="hotHref" :href="hotHref" class="nf404__btn nf404__btn--ghost"
          >逛逛热门</a
        >
        <a
          v-if="supportHref"
          :href="supportHref"
          class="nf404__btn nf404__btn--outline"
          >联系客服</a
        >
      </div>

      <!-- 热门关键词（示例，可自定义） -->
      <ul
        v-if="suggestions && suggestions.length"
        class="nf404__tags"
        aria-label="猜你在找"
      >
        <li v-for="(s, i) in suggestions" :key="i">
          <a :href="buildSearchLink(s)">{{ s }}</a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: "Fresh404",
  props: {
    homeHref: { type: String, default: "/" },
    hotHref: { type: String, default: "" },
    supportHref: { type: String, default: "" },
    searchAction: { type: String, default: "/search" }, // 你们的搜索结果页路径
    searchParam: { type: String, default: "q" }, // 搜索参数名
    searchPlaceholder: { type: String, default: "搜一搜你想要的好物" },
    suggestions: {
      type: Array,
      default: () => ["耳机", "咖啡", "书桌", "旅行箱"],
    },
    showSearch: { type: Boolean, default: true },
  },
  data() {
    return { keyword: "" };
  },
  methods: {
    handleSearch() {
      const q = (this.keyword || "").trim();
      const url = this.buildSearchLink(q || "");
      // 若你们使用前端路由，可改成 this.$router.push(...)
      if (url) window.location.href = url;
    },
    buildSearchLink(q) {
      if (!this.searchAction) return "";
      const usp = new URLSearchParams();
      if (q) usp.set(this.searchParam, q);
      return `${this.searchAction}${q ? `?${usp.toString()}` : ""}`;
    },
  },
};
</script>

<style scoped>
/* ========= 基础主题变量 ========= */
:root,
:host {
  --nf-bg-start: #f3f8ff;
  --nf-bg-end: #f7fff6;
  --nf-card: #ffffff;
  --nf-text-900: #0f172a;
  --nf-text-600: #475569;
  --nf-border: #e6eef7;

  --nf-accent-100: #bfe5ff;
  --nf-accent-200: #dff3ff;
  --nf-accent-300: #6ab9ff;

  --nf-green-300: #b9e6c9;
  --nf-green-350: #a8dfbe;
  --nf-green-400: #7fd6a3;
  --nf-green-500: #5dc488;
  --nf-green-600: #3cb470;

  --nf-shadow: 0 10px 30px rgba(16, 24, 40, 0.08);
  --nf-radius-lg: 20px;
  --nf-radius-sm: 12px;
  --nf-blur: 16px;
}

/* ========= 版式 ========= */
.nf404 {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
  color: var(--nf-text-900);
  overflow: hidden;
  background: linear-gradient(160deg, var(--nf-bg-start), var(--nf-bg-end));
}

.nf404__bg::before,
.nf404__bg::after {
  content: "";
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(
      60% 40% at 20% 10%,
      rgba(122, 214, 163, 0.2),
      transparent 60%
    ),
    radial-gradient(
      50% 35% at 80% 20%,
      rgba(106, 185, 255, 0.18),
      transparent 60%
    ),
    radial-gradient(
      35% 25% at 60% 75%,
      rgba(95, 211, 155, 0.18),
      transparent 60%
    );
  filter: blur(var(--nf-blur));
  z-index: 0;
}

/* 卡片 */
.nf404__card {
  z-index: 1;
  max-width: 940px;
  width: 100%;
  background: color-mix(in oklab, var(--nf-card) 88%, white);
  border: 1px solid var(--nf-border);
  border-radius: var(--nf-radius-lg);
  box-shadow: var(--nf-shadow);
  padding: 28px 22px 30px;
}

@media (min-width: 720px) {
  .nf404__card {
    padding: 40px 44px 46px;
  }
}

/* 插画区域 */
.nf404__art {
  position: relative;
  margin: 6px auto 12px;
  max-width: 760px;
}

.nf404__svg {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 8px 16px rgba(16, 24, 40, 0.05));
  animation: floatUp 10s ease-in-out infinite;
}

.nf404__code {
  position: absolute;
  inset: auto 0 -8px 0;
  margin: auto;
  text-align: center;
  font-weight: 800;
  letter-spacing: 2px;
  font-size: clamp(60px, 12vw, 120px);
  color: color-mix(in oklab, var(--nf-text-900) 16%, white);
  opacity: 0.12;
  animation: gentle 6s ease-in-out infinite;
}

/* 文案 */
.nf404__title {
  text-align: center;
  font-size: clamp(20px, 3vw, 30px);
  line-height: 1.25;
  margin: 6px 0 8px;
}

.nf404__desc {
  text-align: center;
  color: var(--nf-text-600);
  font-size: 14.5px;
  line-height: 1.75;
  margin: 0 auto 18px;
  max-width: 720px;
}

/* 搜索与按钮 */
.nf404__search {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin: 12px auto 6px;
  flex-wrap: wrap;
}

.nf404__input {
  width: min(520px, 88vw);
  padding: 12px 14px;
  border-radius: 999px;
  border: 1px solid var(--nf-border);
  outline: none;
  background: #fff;
  font-size: 14.5px;
  box-shadow: 0 2px 8px rgba(16, 24, 40, 0.04) inset;
}

.nf404__input:focus {
  border-color: color-mix(in oklab, var(--nf-green-500), #89c6ff 45%);
  box-shadow: 0 0 0 4px rgba(95, 211, 155, 0.15);
}

.nf404__actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 12px auto 4px;
}

.nf404__btn {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  border: 1px solid transparent;
  transition:
    transform 0.12s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
  cursor: pointer;
  min-width: 108px;
}

.nf404__btn--primary {
  background: linear-gradient(180deg, var(--nf-green-500), var(--nf-green-600));
  color: #fff;
  box-shadow: 0 6px 16px rgba(60, 180, 112, 0.28);
}
.nf404__btn--primary:hover {
  transform: translateY(-1px);
}

.nf404__btn--outline {
  background: #fff;
  color: var(--nf-text-900);
  border-color: var(--nf-border);
}
.nf404__btn--ghost {
  background: #fff;
  color: var(--nf-text-900);
  border-color: transparent;
  box-shadow: 0 1px 4px rgba(16, 24, 40, 0.06);
}
.nf404__btn--ghost:hover,
.nf404__btn--outline:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 24, 40, 0.08);
}

/* 关键词标签 */
.nf404__tags {
  margin: 14px auto 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  list-style: none;
}
.nf404__tags a {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--nf-border);
  background: #fff;
  text-decoration: none;
  color: var(--nf-text-600);
  font-size: 13px;
}
.nf404__tags a:hover {
  border-color: color-mix(in oklab, var(--nf-green-500), #89c6ff 45%);
}

/* 动效 */
@keyframes floatUp {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
@keyframes gentle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
.cloud {
  animation: cloudMove 22s linear infinite;
}
.cloud--2 {
  animation-duration: 30s;
  opacity: 0.9;
}
@keyframes cloudMove {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(12px);
  }
  100% {
    transform: translateX(0);
  }
}
.leaf {
  animation: leafSway 4.6s ease-in-out infinite;
  transform-origin: 20px 16px;
}
@keyframes leafSway {
  0%,
  100% {
    transform: translate(var(--tx, 0), var(--ty, 0)) rotate(var(--rot, 0deg));
  }
  50% {
    transform: translate(1px, -1px) rotate(2deg);
  }
}
.bird {
  animation: birdFloat 3.8s ease-in-out infinite;
}
@keyframes birdFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

/* 暗色模式优化（可选） */
@media (prefers-color-scheme: dark) {
  :root,
  :host {
    --nf-bg-start: #0e1a25;
    --nf-bg-end: #0f1f1a;
    --nf-card: #0f172a;
    --nf-text-900: #e6eef7;
    --nf-text-600: #9fb0c6;
    --nf-border: #1f2b3a;
    --nf-accent-100: #214a66;
    --nf-accent-200: #1a415c;
    --nf-accent-300: #6ab9ff;
    --nf-green-300: #2a5b46;
    --nf-green-350: #265642;
    --nf-green-400: #1e4b38;
    --nf-green-500: #26a269;
    --nf-green-600: #1d8a59;
    --nf-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  }
  .nf404__input {
    background: #0c1423;
    color: var(--nf-text-900);
  }
  .nf404__btn--ghost,
  .nf404__btn--outline {
    background: #0c1423;
    color: var(--nf-text-900);
  }
  .nf404__card {
    background: color-mix(in oklab, var(--nf-card) 92%, #0b1220);
  }
}
</style>
