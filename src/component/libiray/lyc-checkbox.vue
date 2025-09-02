<template>
  <div class="xtx-checkbox" @click="change()">
    <i class="iconfont icon-checked" v-if="checked"></i>
    <i class="iconfont icon-unchecked" v-else></i>
    <span v-if="$slots.default"><slot></slot></span>
  </div>
</template>
<script setup>
// import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true },
});

const emit = defineEmits(["update:modelValue"]);

// // 以 computed 代理 v-model，兼容性最好
// const checked = computed({
//   get: () => props.modelValue,
//   set: (value) => emit("update:modelValue", value),
// });

// const change = () => {
//   checked.value = !checked.value;
// };
import { ref } from "vue";
import { useVModel } from "@vueuse/core";

const checked = useVModel(props, "modelValue", emit);
const change = () => {
  checked.value = !checked.value;
};
</script>

<style scoped>
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
}

.xtx-checkbox .icon-checked {
  color: var(--xtxColor);
}

.xtx-checkbox .icon-checked ~ span {
  color: var(--xtxColor);
}

.xtx-checkbox i {
  position: relative;
  top: 1px;
}

.xtx-checkbox span {
  margin-left: 2px;
}
</style>
