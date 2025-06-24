import type { NotificationItem } from "@/store/updateNotification";

// 通知数据源
export const notificationsList: NotificationItem[] = [
  {
    id: "update-2025-06-20",
    type: "update",
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
