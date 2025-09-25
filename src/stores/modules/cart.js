import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useUserStore } from "./user";
import {
  findGood,
  findCart,
  mergeCartAPI,
  insertCartAPI,
  deleteCartAPI,
  updateCartAPI,
  checkAllCartAPI,
} from "@/api/cart"; // 统一导入购物车相关接口
import { set } from "@vueuse/core";

export const useCartStore = defineStore(
  "cart",
  () => {
    const cart = ref({
      // list 设计成“纯数组”保存购物车条目；不要在外层再嵌套多余结构，便于持久化与重置
      list: [],
    });

    /**
     * ensureCartShape
     * 作用：任何时候保证 cart.value 存在且 cart.value.list 为数组，防止：
     *   1) 持久化还原被用户手工改坏
     *   2) 某些逻辑错误把 cart.value 或 cart.value.list 赋成 null / 对象 / 其它类型
     * 这样所有读取 list 的地方可以在调用前先执行，避免出现 list.filter is not a function
     */
    const ensureCartShape = () => {
      if (!cart.value || typeof cart.value !== "object") {
        cart.value = { list: [] }; // 若整体被覆盖为非对象，直接重置为初始结构
        return;
      }
      if (!Array.isArray(cart.value.list)) {
        cart.value.list = []; // 若 list 被破坏为非数组，重置为空数组
      }
    };

    /**
     * getSafeList
     * 统一入口获取“安全的 list 数组”。所有计算属性 / 逻辑都通过它拿数据
     * 好处：只要在这里做一次结构修复，下游逻辑就不必每次再写防御
     */
    const getSafeList = () => {
      ensureCartShape();
      return cart.value.list;
    };

    // 加入购物车
    // 约定加入购物车字段必须和后端保持一致
    // 它们是：id skuId name attrsText picture price nowPrice selected stock count isEffective
    // 插入数据的逻辑
    // 1.先找下是否有相同的商品
    // 2.如果有相同的商品，查询他的数量，在累加到payload上面
    // 3.如果没有相同的商品，直接push

    // 因为 findIndex 找不到符合条件的项时会返回 -1，所以 > -1 就是找到了
    const insertCart = async (payload) => {
      const userStore = useUserStore();
      return new Promise(async (resolve, reject) => {
        try {
          // 统一本地逻辑（未来已登录可替换为接口同步）
          // 判断用户是否已登录（根据 userStore 中是否存在 token 来判断）
          if (userStore.profile.token) {
            // 如果已登录，则需要把购物车操作同步到后端

            // 1. 调用后端接口，将商品添加到购物车（传递商品 skuId 和数量 count）
            await insertCartAPI({
              skuId: payload.skuId, // 当前要添加的商品 SKU 编号
              count: payload.count, // 当前要添加的商品数量
            });

            // 2. 添加完成后，再调用查询购物车接口
            //    作用：保证前端购物车数据与后端保持同步
            const data = await findCart();

            // 3. 将查询到的最新购物车数据保存到本地状态（例如 Vuex 或 Pinia 中）
            //    注意：有的后端返回格式可能是 { result: [...] }，所以做个兼容处理
            setCart(data.result || data);

            // 4. 调用 resolve() 表示当前异步操作完成
            //    如果外层使用了 new Promise 包裹这个逻辑，resolve() 会通知调用方
            resolve();
            return; // 已登录逻辑走完，直接返回
          }

          const list = cart.value.list;
          const sameIndex = list.findIndex(
            (item) => item.skuId === payload.skuId
          );
          const addCount = Number(payload.count || 1);
          if (sameIndex > -1) {
            const old = list[sameIndex];
            old.count = (Number(old.count) || 0) + addCount;
            const [moved] = list.splice(sameIndex, 1);
            list.unshift(moved);
            console.log(
              "[insertCart] merged existing sku",
              payload.skuId,
              "=> count",
              old.count
            );
          } else {
            // 补齐必要字段，避免被过滤掉
            const toInsert = {
              ...payload,
              count: addCount,
              stock: payload.stock === undefined ? 9999 : payload.stock, // 默认给个大库存
              isEffective:
                payload.isEffective === undefined ? true : payload.isEffective,
              selected:
                payload.selected === undefined ? true : payload.selected,
              nowPrice: payload.nowPrice || payload.price || 0,
            };
            list.unshift(toInsert);
            console.log("[insertCart] push new sku", toInsert.skuId, toInsert);
          }
          console.log(
            "[insertCart] current raw list length =",
            list.length,
            list
          );
          // 如果 userStore.profile.token 存在，可以在此调用后端同步逻辑
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    };

    // 更新购物车（单条或批量）
    // payload 就是商品信息，包含 nowPrice、stock、isEffective 等字段
    // payload 商品对线的字段不固定，有哪些字段就改哪些字段，字段值合理才改
    // 商品必须要有 skuId
    const updateCart = async (payload) => {
      const userStore = useUserStore();
      ensureCartShape();

      if (userStore.profile.token) {
        // ✅ 已登录：同步后端
        // 这里可以直接调接口：await updateCartAPI(payload)
        // 更新成功后，再拉一次购物车，保证和后端同步
        await updateCartAPI(payload);
        const data = await findCart();
        // 兼容接口可能返回 { result: [...] } 或直接 [...]
        setCart(data.result || data);
        return; // 已登录逻辑走完，直接返回
      } else {
        // ❌ 未登录：本地逻辑

        // —— 新增防御：只有传了 payload 且有 skuId 才做“单条局部更新”，否则只做刷新 —— //
        if (payload && payload.skuId) {
          // 从 pinia 购物车里面找到目标商品（根据 skuId 匹配）
          const updateGoods = cart.value.list.find(
            (item) => item && item.skuId === payload.skuId
          );
          if (updateGoods) {
            // 遍历 payload(goods) 里的所有字段，比如 nowPrice、stock、count 等。
            // 只更新有效值（避免 null、undefined 或空字符串覆盖掉已有值）。
            for (const key in payload) {
              if (
                payload[key] !== undefined &&
                payload[key] !== null &&
                payload[key] !== ""
              ) {
                // 赋值
                updateGoods[key] = payload[key];
              }
            }
          }
        }

        // —— 如果有批量请求的情况（promiseArr） —— //
        // promise.all(promiseArr) 是同时发送所有更新请求，所有请求成功后再刷新购物车
        if (promiseArr.length > 0) {
          const dataList = await Promise.all(promiseArr);
          dataList.forEach((data, i) => {
            const item = cart.value.list[idxArr[i]];
            if (item && data) {
              // 兼容接口可能返回 { result: {...} } 或直接 {...}
              const latest = data.result || data;
              for (const key in latest) {
                if (
                  latest[key] !== undefined &&
                  latest[key] !== null &&
                  latest[key] !== ""
                ) {
                  item[key] = latest[key];
                }
              }
            }
          });
        }
      }

      // async 函数天然返回 Promise，相当于 resolve()
      return;
    };

    //删除购物车商品
    // 1.如果已登录，调用接口删除
    // 2.如果未登录，走本地逻辑
    const removeCart = async (skuId) => {
      const userStore = useUserStore();
      ensureCartShape();
      if (userStore.profile.token) {
        // 已登录，调接口删除
        await deleteCartAPI([skuId]); // 注意：接口要求传数组
        // 删除完成后，再调用查询购物车接口
        // 作用：保证前端购物车数据与后端保持同步
        const data = await findCart();

        // 3. 将查询到的最新购物车数据保存到本地状态（例如 Vuex 或 Pinia 中）
        //    注意：有的后端返回格式可能是 { result: [...] }，所以做个兼容处理
        setCart(data.result || data);

        // 4. 调用 resolve() 表示当前异步操作完成
        //    如果外层使用了 new Promise 包裹这个逻辑，resolve() 会通知调用方

        return; // 已登录逻辑走完，直接返回
      } else {
        // 未登录，走本地逻辑
        const index = cart.value.list.findIndex((item) => item.skuId === skuId);

        if (index > -1) {
          const goods = cart.value.list[index];
          if (goods.count > 1) {
            goods.count -= 1;
          } else {
            cart.value.list.splice(index, 1);
          }
        }
      }

      // async 函数本身会返回 Promise，这里 return 就相当于 resolve()
      return;
    };

    // 计算属性：我们要拿到有效商品列表，总件数以及总金额
    // 有效商品列表: stock>0 且 isEffective 未显式为 false
    /**
     * validList
     * 含义：当前“有效”的商品列表
     * 规则：库存未指定或库存 > 0，并且 isEffective 不为 false
     * 说明：用 getSafeList() 确保 list 一定是数组，过滤逻辑不会抛错
     */
    const validList = computed(() => {
      const list = getSafeList();
      const filtered = list.filter(
        (goods) =>
          (goods.stock === undefined || goods.stock > 0) &&
          goods.isEffective !== false
      );
      if (list.length && !filtered.length) {
        console.warn("[validList] all items filtered out. raw list =", list);
      }
      return filtered;
    });
    // 总件数
    const validTotal = computed(() =>
      validList.value.reduce((p, c) => p + (Number(c.count) || 0), 0)
    );
    // 总金额（返回数字，单位：元）
    const validAmount = computed(
      () =>
        validList.value.reduce((p, c) => {
          const price = Math.round(Number(c.nowPrice) * 100); // 转为分
          const count = Number(c.count) || 0;
          return p + price * count;
        }, 0) / 100 // 再转回元
    );

    // 下面是针对哪个购物车页面的数据列表
    // 无效商品列表
    /**
     * invalidList
     * 含义：无效（失效 / 库存不足）商品列表
     * 规则：库存存在且 <=0，或 isEffective === false
     */
    const invalidList = computed(() => {
      const list = getSafeList();
      return list.filter(
        (goods) =>
          (goods.stock !== undefined && goods.stock <= 0) ||
          goods.isEffective === false
      );
    });
    // 已选商品列表
    const selectedProductList = computed(() =>
      validList.value.filter((item) => item.selected)
    );
    // 已选商品总件数
    const selectedProductTotal = computed(() =>
      selectedProductList.value.reduce((p, c) => p + (Number(c.count) || 0), 0)
    );

    // 已选商品总金额
    const selectedAmount = computed(
      () =>
        selectedProductList.value.reduce(
          (acc, cur) =>
            acc +
            Math.round(Number(cur.nowPrice || 0) * 100) *
              (Number(cur.count) || 0),
          0
        ) / 100
    );

    // 判断购物车是否“全选”的辅助函数
    // 逻辑：
    // 1. selectedProductList.value 是当前被选中的有效商品列表（只有 selected=true 的有效商品）
    // 2. validList.value 是当前所有有效商品列表（过滤掉无库存或不可用的）
    // 3. 当且仅当：已选数量 > 0 且 已选数量 === 有效商品总数 时，视为“全选”
    // 说明：如果没有任何有效商品（validList 为空），此函数返回 false（不会视为全选）
    const isCheckAll = computed({
      get() {
        return (
          selectedProductList.value.length > 0 &&
          selectedProductList.value.length === validList.value.length
        );
      },
      set(val) {
        // 直接设置所有有效商品的选中状态
        validList.value.forEach((item) => {
          item.selected = !!val;
        });
      },
    });

    const checkAllCart = async (selected) => {
      const userStore = useUserStore();
      try {
        if (userStore.profile.token) {
          // 已登录：调接口，告诉后端全选/全不选
          // await checkAllAPI({ selected })
          // 接口成功后可选择：
          // 1) 重新拉一次购物车列表  getCartListAPI()
          // 2) 或者本地同步
          const ids = validList.value.map((item) => item.skuId);
          await checkAllCartAPI({ selected, ids });
          const data = await findCart();

          // 3. 将查询到的最新购物车数据保存到本地状态（例如 Vuex 或 Pinia 中）
          //    注意：有的后端返回格式可能是 { result: [...] }，所以做个兼容处理
          setCart(data.result || data);

          // 4. 调用 resolve() 表示当前异步操作完成
          //    如果外层使用了 new Promise 包裹这个逻辑，resolve() 会通知调用方
          resolve();
          return; // 已登录逻辑走完，直接返回
        } else {
          // 未登录：本地直接改
          validList.value.forEach((item) => {
            item.selected = selected;
          });
        }
      } catch (e) {
        // 这里可做错误提示
        console.error(e);
        throw e;
      }
    };

    // 批量删除购物车
    // isClearing: true 表示清空失效商品；false 表示删除已选中商品
    const batchDeleteCart = async (isClearing) => {
      const userStore = useUserStore();
      ensureCartShape();

      if (userStore.profile.token) {
        // ✅ 已登录：调接口删除
        const ids = (isClearing ? invalidList : selectedProductList).value.map(
          (item) => item.skuId
        );

        // 接口要求数组
        await deleteCartAPI(ids);

        // 删除完成后 → 再拉一次购物车，保证同步
        const data = await findCart();
        setCart(data.result || data);
      } else {
        // ❌ 未登录：本地删除
        cart.value.list = cart.value.list.filter((item) => !item.selected);
      }

      // async 函数天然返回 Promise，等价于 resolve()
      return;
    };

    // 修改购物车SKU组件
    const updateCartSku = async (oldSkuId, newSku) => {
      const userStore = useUserStore();
      ensureCartShape();

      if (userStore.profile.token) {
        // ✅ 已登录：调接口改
        //1.找出旧的商品
        //2.调用删除接口，删除旧商品
        //3.调用加入接口，添加原先的商品数量再加上新skuId
        const oldGoods = cart.value.list.find(
          (item) => item.skuId === oldSkuId
        );
        await deleteCartAPI([oldSkuId]);
        await insertCartAPI({
          skuId: newSku.skuId,
          count: oldGoods.count,
        });
        //4.调用查询接口，刷新本地购物车
        const data = await findCart();
        setCart(data.result || data);
        return; // 已登录逻辑走完，直接返回
      }

      // ❌ 未登录：本地改
      // 1. 找到旧商品
      const oldIndex = cart.value.list.findIndex(
        (item) => item.skuId === oldSkuId
      );
      if (oldIndex === -1) return; // 没找到直接结束

      // 2. 删除旧商品
      const oldGoods = cart.value.list[oldIndex];
      cart.value.list.splice(oldIndex, 1);

      // 3. 用新 sku 信息合并生成新商品
      const {
        skuId: newSkuId,
        price, // 原价
        specsText: attrsText, // 规格文案
        inventoryLevel: stock, // 库存
      } = newSku || {};

      const newGoods = {
        ...oldGoods,
        skuId: newSkuId,
        price: Number(price) || 0,
        nowPrice: Number(price) || 0, // 如果有 newSku.nowPrice，可以换成它
        attrsText,
        stock,
      };

      // 4. 调用已有的 insertCart 方法，插入新商品
      await insertCart(newGoods);

      return; // async 函数会自动返回 Promise.resolve()
    };

    // 设置购物车
    /**
     * setCart
     * 统一的赋值入口；支持三种传参：
     *  1) 直接传数组 —— 视为新的购物车条目数组
     *  2) 传入对象且对象.list 是数组 —— 取其 list
     *  3) 其它情况 —— 忽略（不主动清空，避免误删数据），仅在结构损坏时恢复为空数组
     * 设计原因：避免后端接口若返回 { list: [] } / [] / {} / null 时造成结构被破坏或数据被意外清空
     */
    const setCart = (payload) => {
      ensureCartShape();
      if (Array.isArray(payload)) {
        cart.value.list = payload;
        return;
      }
      if (payload && Array.isArray(payload.list)) {
        cart.value.list = payload.list;
        return;
      }
      // 既不是数组也不是 {list:[]} 时：不强制覆写，以免误删；只修复形状
      if (!Array.isArray(cart.value.list)) {
        cart.value.list = [];
      }
    };

    /**
     * mergeCart
     * 场景：用户“登录后”调用。把“未登录期间”本地临时存放的购物车数据上传给服务端。
     * 步骤：
     *  1) 校验已登录（有 token）
     *  2) 若本地 list 为空则直接返回（无事可做）
     *  3) 映射为后端需要的最小字段：skuId / count / selected
     *  4) 调用合并接口
     *  5) 成功后清空本地 list（后续如果需要展示远端购物车，应再调用 getServerCart 刷新）
     * 注意：此处不再使用 setCart({ list: [] })，直接赋空数组，避免被 setCart 的逻辑再加工
     */
    const mergeCart = async () => {
      console.log("[mergeCart] ENTER");
      ensureCartShape();
      const userStore = useUserStore();
      console.log("[mergeCart] userStore.profile =", userStore.profile);

      if (!userStore.profile?.token) {
        console.warn("[mergeCart] STOP: no token");
        return;
      }

      const list = getSafeList();
      console.log("[mergeCart] local list length =", list.length, list);

      if (!list.length) {
        console.warn("[mergeCart] STOP: empty list, nothing to merge");
        return;
      }

      try {
        const cartList = list.map((it) => ({
          skuId: it.skuId,
          count: Number(it.count) || 1,
          selected: it.selected !== false,
        }));
        console.log("[mergeCart] send payload =", cartList);
        await mergeCartAPI(cartList);
        console.log("[mergeCart] SUCCESS");
        cart.value.list = [];
        return true;
      } catch (e) {
        console.error("[mergeCart] ERROR =", e?.response?.data || e);
        throw e;
      }
    };

    return {
      cart,
      insertCart,
      validList,
      validTotal,
      validAmount,
      updateCart,
      removeCart,
      invalidList,
      selectedProductList,
      selectedProductTotal,
      selectedAmount,
      isCheckAll,
      checkAllCart,
      batchDeleteCart,
      updateCartSku,
      mergeCart,
    };
  },
  // 👇 第三个参数里开启持久化
  {
    persist: {
      key: "rabbit-cart", // 可自定义存储 key
      storage: localStorage, // 默认就是 localStorage，可以不写
    },
  }
);
