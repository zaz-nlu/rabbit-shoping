<template>
  <div class="goods-sku" v-if="goods && goods.skus">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            @click="changeSku(item, val)"
            :class="{ selected: val.selected, disabled: val.disabled }"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
            alt=""
          />
          <span
            :class="{ selected: val.selected, disabled: val.disabled }"
            v-else
            @click="changeSku(item, val)"
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { ref } from "vue";
import PowerSet from "@/vender/power-set";
const props = defineProps({
  goods: {
    type: Object,
    default: () => ({}),
  },
  skuId: {
    type: [String, Number],
    default: "",
  },
});

const emits = defineEmits(["update-sku-info"]);

const getSelectedValues = (specs) => {
  const arr = [];
  // specs 是所有规格组成的大数组，例如 [颜色规格, 产地规格, 尺码规格]
  // forEach 遍历每个规格组，item 就是其中一个规格，比如 "颜色" 或 "产地"
  // item.values 是这个规格组里的所有可选值，比如 ["黑色", "白色"] 或 ["日本", "中国"]

  specs.forEach((item) => {
    // 在当前规格的值里找有没有被选中的 (val.selected == true)
    const selected = item.values.find((val) => val.selected);

    // 如果有选中，就推入选中的名字 (selected.name)
    // 如果没有选中，就推入 undefined 占位
    arr.push(selected?.name || undefined);
  });

  // 返回收集到的数组，例如 ["黑色", undefined, "20cm"]
  return arr;
};

// 初始化默认选中
const initDefaultSelected = (goods, skuId) => {
  //1.找出SKU的信息
  // 2.遍历每个按钮，按钮的值如果和SKU记录的值相同，就选中
  const sku = goods.skus.find((sku) => sku.id === skuId);
  // 这段代码specs是总数组，item是每个规格，val是每个规格的值
  // specs: [颜色规格, 产地规格, 尺码规格]
  // 然后sku.specs[i].valueName是每个规格对应的值，比如"黑色"、"日本"、"20cm"
  // 在这个代码的用处是：遍历每个规格，找到与SKU对应的值并选中
  goods.specs.forEach((item, i) => {
    const val = item.values.find((val) => val.name === sku.specs[i].valueName);
    val.selected = true;
  });
};

if (props.skuId) {
  initDefaultSelected(props.goods, props.skuId);
}

const updateDisabled = (specs, pathMap) => {
  if (!specs || !pathMap) return;
  console.log("specs =>", specs);
  specs.forEach((item, i) => {
    // 1.约定每个按钮的状态由本身的disabled数据来控制
    const selectedValues = getSelectedValues(specs);

    item.values.forEach((val) => {
      //2.判断当前的值是否选中，是选中不用判断
      if (val.selected) {
        val.disabled = false;
        return;
      }
      // 3。若未选中，则把当前值放入已选数组，数组的内容可能是['黑色'，undefined,undefined]这种情况
      // 我们把值推入进去，然后去掉undefined，这样就形成了一个字典条目，然后拿着条目去字典里面找
      selectedValues[i] = val.name;
      const key = selectedValues
        .filter((v) => v)
        .sort()
        .join("★");
      val.disabled = !pathMap[key];
    });
  });
};

// 选择与取消的逻辑,约定在每一个按钮都拥有自己的选中状态数据，selected
// 但有个缺陷，现在是选择能选好几个所以继续优化
// 点击的是已选择，只需要取消当前的选中，若是未选中点击的，把同一个规格的按钮改成未选中，点击当前的为选中
const changeSku = (item, val) => {
  // 点击的是已选择，只需要取消当前的选中，
  if (val.disabled) return;
  // 若点击的师妹选择的
  if (val.selected) {
    val.selected = false;
  } else {
    // 若是未选中点击的，把同一个规格的按钮改成未选中，点击当前的为选中
    item.values.forEach((v) => {
      v.selected = false;
    });
    val.selected = true;
  }

  // 点击按钮后，更新禁用状态
  updateDisabled(props.goods?.specs, pathMap);
  // 将你选择的SKU信息通知给父组件，，信息包括{skuId，price，oldPrice，inventory，specsText}
  // 分为两种情况，一种是选中完整，一种是不完整
  const selectedValues = getSelectedValues(props.goods?.specs).filter((v) => v);
  // specs 是所有规格组成的大数组，例如 [颜色规格, 产地规格, 尺码规格]
  // selectedValues 是当前选中的值，例如 ["黑色", "日本", "20cm"]
  // 对比，如果长度一样，那么就说明三个都选了，不一样，那就有没选的
  if (selectedValues.length === props.goods?.specs.length) {
    //完整
    const skuIds = pathMap[selectedValues.sort().join("★")];
    const sku = props.goods.skus.find((sku) => sku.id === skuIds[0]);
    emits("update-sku-info", {
      skuId: sku.id,
      price: sku.price,
      oldPrice: sku.oldPrice,
      inventory: sku.inventory,
      // 这块我们想实现的是属性名：属性值 属性名2：属性值2 这种字符串
      specsText: sku.specs
        .reduce((acc, cur) => `${acc} ${cur.name}:${cur.valueName}`, "")
        .trim(),
    });
  } else {
    emits("update-sku-info", {});
  }
};

// 构建路径字典对象（返回一个对象）
const getPathMap = (skus) => {
  const map = {};
  skus.forEach((sku) => {
    if (sku.inventory > 0) {
      const valueArr = sku.specs.map((val) => val.valueName);
      const subsets = PowerSet(valueArr);
      subsets.forEach((set) => {
        const key = set.sort().join("★");
        if (!key) return; // 跳过空集合
        if (map[key]) {
          map[key].push(sku.id);
        } else {
          map[key] = [sku.id];
        }
      });
    }
  });
  return map;
};

// 先生成路径字典，再标记禁用状态
const pathMap = getPathMap(props.goods?.skus || []);
updateDisabled(props.goods?.specs, pathMap);
</script>

<style scoped lang="less">
@xtxColor: #27ba9b;
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}

.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 60px;
      color: #666;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
