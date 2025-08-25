<template>
  <footer class="app-footer">
    <!-- 联系我们 -->
    <div class="contact">
      <div class="container">
        <dl>
          <dt>客服服务</dt>
          <dd><i class="iconfont icon-kefu"></i> 在线客服</dd>
          <dd><i class="iconfont icon-question"></i> 问题反馈</dd>
        </dl>
        <dl>
          <dt>关注我们</dt>
          <dd><i class="iconfont icon-weixin"></i> 公众号</dd>
          <dd><i class="iconfont icon-weibo"></i> 微博</dd>
        </dl>
        <dl>
          <dt>下载APP</dt>
          <dd class="qrcode">
            <img src="../assets/images/二维码.png" alt="下载二维码" />
          </dd>
          <dd class="download">
            <span>扫一扫二维码</span>
            <span>立马下载APP</span>
          </dd>
        </dl>
        <dl>
          <dt>服务热线</dt>
          <dd class="hotline">
            166-2298-3373
            <small>（9:00 - 18:00）</small>
          </dd>
        </dl>
      </div>
    </div>

    <!-- 其它 -->
    <div class="extra">
      <div class="container slogan">
        <a href="javascript:;">
          <i class="iconfont icon-footer01"></i>
          <span>价格亲民</span>
        </a>
        <a href="javascript:;">
          <i class="iconfont icon-footer02"></i>
          <span>物流快捷</span>
        </a>
        <a href="javascript:;">
          <i class="iconfont icon-footer03"></i>
          <span>品质新鲜</span>
        </a>
      </div>

      <!-- 版权信息 -->
      <div class="copyright">
        <div class="about">
          <p>
            <a href="javascript:;">关于我们</a>
            <a href="javascript:;">帮助中心</a>
            <a href="javascript:;">售后服务</a>
            <a href="javascript:;">配送与验收</a>
            <a href="javascript:;">商务合作</a>
            <a href="javascript:;">搜索推荐</a>
            <a href="javascript:;">友情链接</a>
          </p>
        </div>

        <p>CopyRight © LYC 电商</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="less">
/* ========== 基础 ========== */
.app-footer {
  background: #fff;
  color: #333;
  font-size: 14px;
  border-top: 1px solid #eee;
}

.app-footer .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ========== 上：联系与服务（四列） ========== */
.contact {
  background: #f7f8fa;
  border-bottom: 1px solid #eee;
}

.contact .container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding: 32px 16px;
}

.contact dl {
  margin: 0;
}

.contact dt {
  font-weight: 700;
  color: #222;
  margin-bottom: 12px;
}

.contact dd {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  margin: 10px 0;
  line-height: 1.6;
}

.contact dd i.iconfont {
  font-size: 18px;
  color: #42b983; /* 主题点缀色（与你的 Logo 绿呼应） */
}

/* 二维码与下载区 */
.contact .qrcode {
  margin-bottom: 10px;
}

.contact .qrcode img {
  display: block;
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fff;
}

.contact .download span {
  display: block;
  color: #666;
}

.contact .download a {
  display: inline-block;
  margin-top: 8px;
  padding: 6px 12px;
  font-size: 13px;
  color: #fff;
  background: #42b983;
  border-radius: 6px;
  transition: filter 0.2s ease;
}

.contact .download a:hover {
  filter: brightness(0.95);
}

/* 热线 */
.contact .hotline {
  font-size: 16px;
  font-weight: 700;
  color: #222;
}

.contact .hotline small {
  display: block;
  margin-top: 6px;
  font-weight: 400;
  font-size: 12px;
  color: #888;
}

/* ========== 中：卖点/标语条 ========== */
.extra {
  background: #fff;
}

.extra .container.slogan {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  align-items: center;
  padding: 20px 16px;
}

.extra .slogan a {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #333;
  padding: 8px 10px;
  border-radius: 8px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.extra .slogan a i.iconfont {
  font-size: 22px;
  color: #42b983;
}

.extra .slogan a span {
  font-size: 15px;
}

.extra .slogan a:hover {
  background: #f7f8fa;
  transform: translateY(-1px);
}

/* ========== 下：版权信息 ========== */
.about {
  display: flex;
  align-items: center;
  justify-content: center;
}
.copyright {
  border-top: 1px solid #eee;

  text-align: center;
  padding: 16px 0 24px;
  color: #666;
}

.copyright p {
  margin: 8px 0;
}

.copyright p:first-child a {
  color: #666;
  margin: 0 8px;
  font-size: 13px;
  transition: color 0.2s ease;
}

.copyright p:first-child a:hover {
  color: #111;
}

.copyright p:last-child {
  font-size: 13px;
  color: #888;
}

.slogan {
  display: flex;
  justify-content: center;
}

/* ========== iconfont 兜底（如你的 iconfont.css 已含可忽略） ========== */
.iconfont {
  display: inline-block;
  line-height: 1;
}

/* ========== 响应式 ========== */
@media (max-width: 1024px) {
  .contact .container {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  .extra .container.slogan {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

@media (max-width: 640px) {
  .contact .container {
    grid-template-columns: 1fr;
  }
  .contact .qrcode img {
    width: 100px;
    height: 100px;
  }
}
</style>
