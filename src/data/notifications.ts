import type { NotificationItem } from "@/store/updateNotification";

// 通知数据源
export const notificationsList: NotificationItem[] = [
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
