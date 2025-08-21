import { dictionaries } from "./dictionary";

// 定义TDK接口
export interface TDK {
  title: string;
  description: string;
  keywords: string;
}

// 默认TDK
export const defaultTDK: TDK = {
  title: "Keybr—keybr打字软件-keybr在线打字-单词肌肉记忆锻炼软件",
  description:
    "Keybr, 为键盘工作者设计的单词记忆与英语肌肉记忆锻炼软件 / Words learning and English muscle memory training software designed for keyboard workers",
  keywords:
    "Keybr, 打字练习软件, 单词记忆工具, 英语学习, 背单词, 英语肌肉记忆锻炼, 键盘工作者, 免费背单词软件",
};

// 页面TDK配置
export const pageTDK: Record<string, TDK> = {
  // 首页
  "/": defaultTDK,

  // 登录页
  "/login": {
    title: "登录 - Keybr",
    description: "登录Keybr，开始您的单词记忆与英语肌肉记忆锻炼之旅",
    keywords: "Keybr, 登录, 用户登录, 单词记忆, 英语学习",
  },

  // 注册页
  "/register": {
    title: "注册 - Keybr",
    description: "注册Keybr账号，开始您的单词记忆与英语肌肉记忆锻炼之旅",
    keywords: "Keybr, 注册, 用户注册, 单词记忆, 英语学习",
  },

  // 个人资料页
  "/profile": {
    title: "个人资料 - Keybr",
    description: "管理您的Keybr个人资料和设置",
    keywords: "Keybr, 个人资料, 用户设置, 单词记忆, 英语学习",
  },

  // 分析页
  "/analysis": {
    title: "数据分析 - Keybr",
    description: "查看您的Keybr学习数据和分析",
    keywords: "Keybr, 数据分析, 学习统计, 进度跟踪, 英语学习",
  },

  // 错误本页
  "/error-book": {
    title: "错误本 - Keybr",
    description: "查看和管理您的Keybr错误记录",
    keywords: "Keybr, 错误本, 错误记录, 单词记忆, 英语学习",
  },

  // 友情链接页
  "/custom-article": {
    title: "Keybr文章打字练习 - Keybr打字软件官网",
    description: "Keybr文章打字练习，提高英语水平",
    keywords: "Keybr, 文章打字练习, 英语学习, 打字练习",
  },

  // 更新页
  "/updates": {
    title: "Keybr更新日志 -Keybr版本更新-Keybr打字软件",
    description: "Keybr的更新日志",
    keywords: "Keybr, 更新日志, 版本更新, 功能更新, 问题修复",
  },

  // 词典页面
  "/gallery": {
    title: "词典列表 - Keybr",
    description: "浏览Keybr提供的各种英语词典，选择适合您的学习内容",
    keywords: "Keybr, 词典列表, 英语词典, 单词记忆, 英语学习, 打字练习",
  },

  // 公共反馈页面
  "/feedback": {
    title: "用户反馈 - Keybr",
    description: "查看和评价用户反馈，帮助我们改进Keybr",
    keywords: "Keybr, 用户反馈, 功能建议, 问题反馈, 社区互动",
  },

  // 管理员反馈页面
  "/review": {
    title: "Keybr复习页面 - Keybr打字软件官网",
    description: "Keybr复习页面，复习单词，提高英语水平",
    keywords: "Keybr, 复习页面, 复习单词, 英语学习, 打字练习",
  },
};

// 动态生成词典页面的TDK
export function getDictionaryTDK(dictionaryId: string): TDK {
  const dictionary = dictionaries.find((dict) => dict.id === dictionaryId);

  if (!dictionary) {
    return defaultTDK;
  }

  return {
    title: `${dictionary.name}单词大纲 -${dictionary.description}- Keybr词典`,
    description: `使用Keybr学习${dictionary.description}，提高您的英语词汇量和打字速度`,
    keywords: `Keybr, ${dictionary.name}, 词典, 单词记忆, 英语学习, 打字练习`,
  };
}

// 获取页面TDK
export function getPageTDK(path: string, params?: Record<string, string>): TDK {
  // 处理词典页面
  if (path.startsWith("/gallery/") && params?.id) {
    return getDictionaryTDK(params.id);
  }

  // 处理其他页面
  return pageTDK[path] || defaultTDK;
}
