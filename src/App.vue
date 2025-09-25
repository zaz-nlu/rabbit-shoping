<template>
  <n-message-provider>
    <n-dialog-provider>
      <n-modal-provider>
        <router-view />
      </n-modal-provider>
    </n-dialog-provider>
  </n-message-provider>
</template>

<script setup></script>

<style scoped lang="less">
.container {
  .hoverShadow();
}
</style>
