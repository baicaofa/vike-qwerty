import Page from "./+Page.tsx";

export default {
  Page, // 指定页面组件
  // 添加客户端水合配置
  hydrationCanBeAborted: true,
  clientRouting: true,
};
