<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{ label }}</div>
    <div class="numbox">
      <a href="javascript:" @click="changeNum(-1)">-</a>
      <input type="text" readonly :value="modelValue" />
      <a href="javascript:" @click="changeNum(1)">+</a>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  min: {
    type: Number,
    default: 1,
  },
  max: {
    type: Number,
    default: 10,
  },
  label: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["update:modelValue"]);

const changeNum = (step) => {
  let newVal = Number(props.modelValue) + step;
  if (newVal < props.min || newVal > props.max) return; // 不允许小于 1
  emit("update:modelValue", newVal);
};
</script>

<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
}

.label {
  width: 60px;
  color: #333;
  padding-left: 10px;
}

.numbox {
  width: 120px;
  height: 30px;
  border: 1px solid #e4e4e4;
  display: flex;
  margin-left: 10px;
}

.numbox > a {
  width: 29px;
  line-height: 28px;
  text-align: center;
  background: #f8f8f8;
  font-size: 16px;
  color: #666;
}

.numbox > input {
  width: 50px;

  flex: 1;
  text-align: center;
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
}
</style>
