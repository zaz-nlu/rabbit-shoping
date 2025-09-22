<template>
  <LoginHeader>联合登陆</LoginHeader>
  <section class="container" v-if="isBind">
    <div class="unbind">
      <lyc-spining></lyc-spining>
    </div>
  </section>
  <div v-else class="callback-center">
    <n-card class="callback-card">
      <n-tabs trigger="hover" type="line" animated>
        <n-tab-pane name="bind" tab="已有账号，请绑定手机">
          <keep-alive>
            <callbackBind :unionId="unionId" />
          </keep-alive>
        </n-tab-pane>
        <n-tab-pane name="register" tab="没有账号，请注册并完善自己的资料">
          <keep-alive>
            <callbackPatch :unionId="unionId" />
          </keep-alive>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
  <LoginFooter />
</template>

<script setup>
import LoginHeader from "./component/login-header.vue";
import LoginFooter from "./component/login-footer.vue";
import callbackBind from "./component/callback-bind.vue";
import callbackPatch from "./component/callback-patch.vue";
import lycSpining from "@/component/libiray/lyc-spining.vue";
import { useUserStore } from "@/stores/modules/user";
import { useCartStore } from "@/stores/modules/cart";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { userQQLogin } from "@/api/user";
import router from "@/router";
import { useMessage } from "naive-ui";

//首先默认认为已经注册并且已经绑定
// 通过QQ的API openId就是后台需要的unionId然后去进行灯笼裤
//如果成功，登陆成功
//如果失败，则要进行绑定
const isBind = ref(true);
const userStore = useUserStore();
const cartStore = useCartStore();
const message = useMessage();
const route = useRoute();
const unionId = ref(""); //第三方唯一标识
// 确保QQ已经登录
if (window.QC && window.QC.Login.check()) {
  // openID 是第三方唯一标识
  window.QC.Login.getMe(async (openId, accessToken) => {
    try {
      // 请求小兔鲜后台，做 QQ 登录
      // 这个unionId绑定时候要用，我们先给他赋值
      unionId.value = openId;
      const res = await userQQLogin(openId);

      console.log("登录成功:", res);
      const {
        id,
        account: acc,
        avatar,
        mobile,
        nickname,
        token,
      } = res.result || {};
      userStore.setUserInfo({
        id,
        account: acc,
        avatar,
        mobile,
        nickname,
        token,
      });
      // 合并购物车
      try {
        await cartStore.mergeCart();
        message.success("购物车合并成功");
      } catch (e) {
        message.warning("合并购物车失败，请稍后重试");
      }
      const redirect = route.query.redirectUrl || "/";
      router.push(redirect);
      message.success("登录成功");
    } catch (err) {
      isBind.value = false;
      message.error("登录失败，请绑定或注册账号");
      console.error("QQ 登录失败:", err);
    }
  });
}
</script>

<style scoped lang="less">
/* 整体绝对居中 */
.callback-center {
  min-height: 500px;
  display: flex;
  justify-content: center; /* 水平居中 */
  margin: 50px;
  background: #f5f6f8;
}

/* 卡片更宽更高，避免内容拥挤；同时兼容小屏 */
.callback-card {
  width: 900px; /* ← 加宽 */
  max-width: 96vw;
  min-height: 420px; /* ← 增高一些更稳妥 */
  box-sizing: border-box;
  padding: 8px 16px;
}
/* ---- Naive UI Tabs 的定制（用 :deep 覆盖内部类名） ---- */

/* Tabs 整体居中 + 增加标签之间的间距 */
:deep(.n-tabs-nav) {
  width: max-content;
  margin: 0 auto; /* ← 整体居中 */
}

/* 标签之间留白，但别再居中它（保持默认 flex-start） */
:deep(.n-tabs-nav-scroll-content) {
  gap: 28px; /* ← 只设置间距，不要 justify-content */
}

/* 提升点击面积、避免“字挤” */
:deep(.n-tabs-tab) {
  padding: 10px 18px;
  font-size: 16px;
  line-height: 1.4;
  white-space: nowrap; /* 文案不换行；想换行就删掉这句 */
}

/* 选中态更明显（可选） */
:deep(.n-tabs-tab--active) {
  font-weight: 600;
}

/* 底部横线微调（可选） */
:deep(.n-tabs-rail) {
  margin-top: 4px;
}
.callbackBind {
}
</style>
