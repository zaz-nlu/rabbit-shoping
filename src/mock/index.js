import Mock from "mockjs";

//基本配置
Mock.setup({
  timeout: 1000, //设置延迟时间
});

Mock.mock(/\/my\/test/, "get", () => {
  // 随机数据
  const arr = [];
  for (let i = 0; i < 5; i++) {
    arr.push(
      Mock.mock({
        id: Mock.mock("@id"),
        name: Mock.mock("@cname"),
        picture: Mock.mock("@image"),
        price: Mock.mock("@integer(1, 1000)"),
        desc: Mock.mock("@sentence(10, 20)"),
      })
    );
  }
  return {
    code: 200,
    message: "成功",
    result: arr,
  };
});

// 模拟我的收藏数据
Mock.mock(/\/member\/collect/, "get", () => {
  const counts = 35;
  const items = [];

  // 生成10条收藏商品数据
  for (let i = 0; i < 10; i++) {
    items.push(
      Mock.mock({
        id: "@id",
        name: "@ctitle(5, 15)",
        picture: "@image('200x200', '#50B347', '#FFF', 'Mock')",
        price: "@integer(100, 9999)",
        desc: "@csentence(10, 30)",
      })
    );
  }

  return {
    code: 200,
    message: "成功",
    result: {
      counts: counts,
      pageSize: 10,
      page: 1,
      items: items,
    },
  };
});

// 模拟我的足迹数据
Mock.mock(/\/member\/footprint/, "get", () => {
  const counts = 50;
  const items = [];

  // 生成10条足迹商品数据
  for (let i = 0; i < 10; i++) {
    items.push(
      Mock.mock({
        id: "@id",
        name: "@ctitle(5, 15)",
        picture: "@image('200x200', '#4A90E2', '#FFF', 'Footprint')",
        price: "@integer(100, 9999)",
        desc: "@csentence(10, 30)",
      })
    );
  }

  return {
    code: 200,
    message: "成功",
    result: {
      counts: counts,
      pageSize: 10,
      page: 1,
      items: items,
    },
  };
});
