<template>
  <footer class="login-footer" role="contentinfo">
    <div class="container">
      <p class="links" role="navigation" aria-label="页脚导航">
        <a href="#">关于我们</a>
        <a href="#">帮助中心</a>
        <a href="#">售后服务</a>
        <a href="#">配送与验收</a>
        <a href="#">商务合作</a>
        <a href="#">搜索推荐</a>
        <a href="#">友情链接</a>
      </p>
      <p class="copy">CopyRight &copy; LYC货郎</p>
    </div>
  </footer>
</template>

<script setup></script>

<style lang="less" scoped>
.login-footer {
  background: #fff;
  border-top: 1px solid #eee;
  padding: 20px 24px;
  text-align: center;

  .container {
    display: flex;
    flex-direction: column; // 垂直布局
    align-items: center;
    gap: 12px;
  }

  /* 链接横向平铺 */
  .links {
    display: flex;
    flex-wrap: wrap; // 小屏可换行
    justify-content: center;
    gap: 14px; // 链接间距
    margin: 0;
    color: #666;
    line-height: 1.6;

    a {
      display: inline-block;
      font-size: 14px;
      color: #666;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #333;
      }

      &:active {
        color: #000;
      }
    }
  }

  /* 版权信息第二行 */
  .copy {
    margin: 0;
    font-size: 13px;
    color: #999;
    line-height: 1.4;
    white-space: nowrap;
  }
}

/* 小屏优化：链接自动换行居中 */
@media (max-width: 520px) {
  .login-footer {
    padding: 16px;

    .links {
      gap: 10px;
    }
  }
}
</style>
