<template>
  <div class="xtx-city" ref="target" :class="{ open: visible }">
    <div class="select" @click="toggle">
      <span v-if="!fullLocation" class="placeholder">请选择配送地址</span>
      <span v-else class="value">{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>

    <div class="option" v-if="visible">
      <lyc-spining v-if="loading" />
      <template v-else>
        <span
          v-for="city in currList"
          @click="changeItem(city)"
          :key="city.code"
        >
          {{ city.name }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { onClickOutside } from "@vueuse/core";
import lycSpining from "./lyc-spining.vue";
import axios from "axios";

const props = defineProps({
  // fullLocation 用于接收父组件传递的完整地址对象
  fullLocation: {
    type: String,
    default: "",
  },
});
const visible = ref(false);
const loading = ref(false);
const cityList = ref([]);
const emit = defineEmits(["change"]);
const open = async () => {
  visible.value = true;
  loading.value = true;
  //   如果不打开选择城市，完全没必要调用数据，所以在open里调用getCityData
  const data = await getCityData();
  cityList.value = data;
  loading.value = false;
  // 重置选择结果
  changeResult.provinceCode = "";
  changeResult.provinceName = "";
  changeResult.cityCode = "";
  changeResult.cityName = "";
  changeResult.countyCode = "";
  changeResult.countyName = "";
  changeResult.fullLocation = "";
};
const close = () => {
  visible.value = false;
};
const toggle = () => {
  visible.value ? close() : open();
};

// 点击外部区域时关闭下拉框
const target = ref(null);
onClickOutside(target, close);

// 从json获取省区市数据
// 思路
// 数据存在https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json 里面
// 本地没缓存，发请求获取数据
// 本地缓存，取出本地数据，注意缓存都存在window上的cityData字段
const getCityData = async () => {
  // 1. 判断本地是否已有缓存数据（window.cityData），这块是后端定义的
  if (window.cityData) {
    // 如果有缓存，直接返回缓存数据，不再发请求
    return window.cityData;
  }

  try {
    // 2. 如果没有缓存，就发起网络请求获取数据
    const res = await axios.get(
      "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json"
    );

    // 3. 请求成功后，把数据存到 window.cityData 作为本地缓存
    window.cityData = res.data;

    // 4. 返回获取到的数据
    return res.data;
  } catch (err) {
    // 5. 如果请求失败，抛出错误（交给调用者处理）
    throw err;
  }
};
// cityList存储省市区数据，数据格式是一个数组，数组里每一项是一个对象，对象里有code,name,level,areaList等字段
// 这个数据是一个树形结构，省下面有市，市下面有区
// 但cityData只显示了省，没显示市区这些，所以我们要用computed监听点了谁，点了后，在去渲染
// 定义选择的省市区数据，要对code仔细定义类似ID
const changeResult = reactive({
  provinceCode: "",
  provinceName: "",
  cityName: "",
  cityCode: "",
  countyCode: "",
  countyName: "",
  fullLocation: "",
});
const currList = computed(() => {
  // 默认：显示省份
  if (!changeResult.provinceCode) {
    return cityList.value;
  }

  //  如果已经选了某个省（provinceCode 有值），但还没选城市（cityCode 为空）：
  // 就先找到这个省份对象。
  // 然后返回它的 areaList（即该省下的所有城市）。
  if (changeResult.provinceCode && !changeResult.cityCode) {
    const province = cityList.value.find(
      (item) => item.code === changeResult.provinceCode
    );
    return province ? province.areaList : [];
  }

  // 如果已经选了城市（cityCode 有值），但还没选区县（countyCode 为空）：
  // 先找到所属的省份。再在省份的 areaList 里找到选中的城市对象。
  // 返回该城市的 areaList（即所有区县）。
  if (changeResult.cityCode && !changeResult.countyCode) {
    const province = cityList.value.find(
      (item) => item.code === changeResult.provinceCode
    );
    const city = province?.areaList.find(
      (item) => item.code === changeResult.cityCode
    );
    return city ? city.areaList : [];
  }

  return [];
});
// 监听changeResult，拼接完整地址
const changeItem = (city) => {
  if (city.level === 0) {
    //给省份赋予
    changeResult.provinceCode = city.code;
    changeResult.provinceName = city.name;
  } else if (city.level === 1) {
    //给城市
    changeResult.cityCode = city.code;
    changeResult.cityName = city.name;
  } else if (city.level === 2) {
    //给区县
    changeResult.countyCode = city.code;
    changeResult.countyName = city.name;
    // 这是最后一级，选完了，关闭对话框，把数据给父组件
    changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`;
    close();
    emit("change", changeResult);
  }
};
</script>

<style scoped lang="less">
/* 注意：这里改成 .xtx-city，和模板保持一致 */
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  min-width: 220px;

  .select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
    background: #fff;
    border: 1px solid #e4e4e4;
    cursor: pointer;
    min-width: 120px;

    .placeholder {
      color: #999;
    }
    .value {
      color: #333;
      font-size: 12px;
    }

    i {
      font-size: 12px;
      margin-left: 8px;
      transition: transform 0.2s;
    }
  }

  /* 箭头随打开状态旋转 */
  &.open .select i {
    transform: rotate(180deg);
  }

  /* 下拉面板：平铺式 Grid */
  .option {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    margin-top: 4px;
    background: #fff;
    border: 1px solid #e4e4e4;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
    width: 350px;

    /* ✅ 用 grid 固定 4 列 */
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px 6px;
    padding: 10px;
    max-height: 240px;
    overflow: auto;
    box-sizing: border-box;

    > span {
      height: 28px;
      line-height: 28px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 6px;

      /* 文字溢出省略号 */
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
