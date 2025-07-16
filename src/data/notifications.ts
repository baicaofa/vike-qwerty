import type { NotificationItem } from "@/store/updateNotification";

// 通知数据源
export const notificationsList: NotificationItem[] = [
  {
    id: "update-2025-07-07",
    type: "feature",
    date: "2025年7月7日",
    title: "增加复习功能",
    tag: "新功能",
    desc: "基于科学的间隔重复算法，根据每日联系规划每日复习计划。支持进度追踪、准确率统计。配备清晰的数据面板，帮助您持续有效地巩固单词记忆。",
    images: [
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/07/1-1.jpg",
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/07/2.png",
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/07/3.png",
    ],
    priority: "high",
  },
  {
    id: "update-2025-07-02",
    type: "feature",
    date: "2025年7月2日",
    title: "默写增加显示功能",
    tag: "新功能",
    desc: "默写完单词，可以完整展示单词的释义、例句一两秒的时间。提供一个控制按钮是否开启",
    images: ["https://www.keybr.com.cn/keybr/wp-content/uploads/2025/07/0.jpg"],
    priority: "high",
  },
  {
    id: "update-2025-06-30",
    type: "update",
    date: "2025年6月30日",
    title: "词典增加词性、例句、英文释义",
    tag: "产品更新",
    desc: "词典增加词性、例句，方便用户学习单词；目前已经更新的词典：6级，4级，专升本，雅思wang C3",
    images: [
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/07/QQ20250716-151246.png",
    ],
    priority: "high",
  },
  {
    id: "update-2025-06-20",
    type: "feature",
    date: "2025年6月20日",
    title: "增加反馈功能",
    tag: "新功能",
    desc: "增加问题反馈按钮，使用过程中有反馈问题可以及时反馈，BUG,建议,功能需求等",
    images: [
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/06/QQ20250620-174823.jpg",
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/06/QQ20250620-174723.png",
    ],
    priority: "high",
  },
  {
    id: "update-2025-05-12",
    type: "update",
    date: "2025年5月12日",
    title: "调整导航栏工具中心",
    tag: "页面UI调整",
    desc: "将功能性设置调整到底部，留出头部导航栏位置放置主要功能",
    images: [
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/06/QQ20250606-223159.jpg",
    ],
    priority: "high",
  },
  {
    id: "update-2025-05-2",
    type: "update",
    date: "2025年5月2日",
    title: "新增自定义上传文章功能",
    tag: "新功能",
    desc: "自定义文章功能允许您使用自己的文本内容进行打字练习，让您可以练习工作中常用的专业术语、学习材料或任何您感兴趣的文本内容。所有数据保存在您的浏览器中，支持最多3000字符的文本内容",
    images: [
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/06/QQ20250606-223405.jpg",
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/06/QQ20250606-223512-scaled.jpg",
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/06/QQ20250606-223626.jpg",
    ],
    priority: "high",
  },
  {
    id: "update-2025-04-15",
    type: "update",
    date: "2025年4月15日",
    title: "新增熟词标记功能",
    tag: "新功能",
    desc: "现在可以标记熟词，联系过程中可以跳过熟词，提高学习效率。",
    images: [
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/06/QQ20250605-154621.jpg",
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/06/QQ20250605-155001.jpg",
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/06/QQ20250605-155027.png",
    ],
    priority: "high",
  },
  {
    id: "update-2025-03-25",
    type: "update",
    date: "2025年3月25日",
    title: "增加登录系统",
    tag: "新功能",
    desc: "增加登录系统，支持跨设备保存练习数据",
    images: [
      "https://www.keybr.com.cn/keybr/wp-content/uploads/2025/06/QQ20250605-164929.png",
    ],
    priority: "medium",
  },
];

// 获取通知的工具函数
export const getNotificationsByType = (type: NotificationItem["type"]) => {
  return notificationsList.filter((notification) => notification.type === type);
};

// 获取高优先级通知
export const getHighPriorityNotifications = () => {
  return notificationsList.filter(
    (notification) => notification.priority === "high"
  );
};

// 获取最新的N条通知
export const getLatestNotifications = (count = 5) => {
  return [...notificationsList]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};

// 根据ID获取通知
export const getNotificationById = (id: string) => {
  return notificationsList.find((notification) => notification.id === id);
};
