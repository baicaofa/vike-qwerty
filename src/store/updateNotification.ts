import { notificationsList } from "@/data/notifications";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// 通知类型定义
export type NotificationType =
  | "update"
  | "feature"
  | "maintenance"
  | "announcement";

// 通知项接口
export interface NotificationItem {
  id: string;
  type: NotificationType;
  date: string;
  title: string;
  tag?: string;
  desc: string;
  images?: string[];
  btn?: string;
  priority?: "low" | "medium" | "high";
}

// 通知配置
export interface NotificationConfig {
  lastViewedTime: string | null;
  dismissedNotifications: string[]; // 已忽略的通知ID
  preferences: {
    showUpdates: boolean;
    showFeatures: boolean;
    showMaintenance: boolean;
    showAnnouncements: boolean;
  };
}

// 默认配置
const defaultConfig: NotificationConfig = {
  lastViewedTime: null,
  dismissedNotifications: [],
  preferences: {
    showUpdates: true,
    showFeatures: true,
    showMaintenance: true,
    showAnnouncements: true,
  },
};

// 存储通知配置
export const notificationConfigAtom = atomWithStorage<NotificationConfig>(
  "notificationConfig",
  defaultConfig
);

// 控制通知弹窗的显示状态
export const isUpdateNotificationOpenAtom = atom(false);

// 获取最新更新时间的工具函数
export const getLatestUpdateTime = (
  notifications: NotificationItem[]
): string | null => {
  if (!notifications || notifications.length === 0) return null;

  // 按日期排序，获取最新的
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return sortedNotifications[0]?.date || null;
};

// 过滤有效通知的工具函数
export const getValidNotifications = (
  notifications: NotificationItem[],
  config: NotificationConfig
): NotificationItem[] => {
  return notifications.filter((notification) => {
    // 检查用户偏好设置
    const { preferences, dismissedNotifications } = config;

    // 检查是否被忽略
    if (dismissedNotifications.includes(notification.id)) {
      return false;
    }

    // 检查类型偏好
    switch (notification.type) {
      case "update":
        return preferences.showUpdates;
      case "feature":
        return preferences.showFeatures;
      case "maintenance":
        return preferences.showMaintenance;
      case "announcement":
        return preferences.showAnnouncements;
      default:
        return true;
    }
  });
};

// 获取通知数据的原子
export const notificationsDataAtom = atom<NotificationItem[]>(() => {
  // 直接使用导入的数据
  return notificationsList || [];
});

// 获取有效通知的原子
export const validNotificationsAtom = atom((get) => {
  const notifications = get(notificationsDataAtom);
  const config = get(notificationConfigAtom);
  return getValidNotifications(notifications, config);
});

// 判断是否有新的更新内容（优化版）
export const hasNewUpdatesAtom = atom((get) => {
  const config = get(notificationConfigAtom);
  const validNotifications = get(validNotificationsAtom);

  if (validNotifications.length === 0) {
    return false;
  }

  // 如果用户从未查看过，则显示小红点
  if (!config.lastViewedTime) {
    return true;
  }

  // 获取最新更新时间
  const latestUpdateTime = getLatestUpdateTime(validNotifications);
  if (!latestUpdateTime) {
    return false;
  }

  // 比较时间
  const lastViewed = new Date(config.lastViewedTime);
  const latestUpdate = new Date(latestUpdateTime);

  return latestUpdate > lastViewed;
});

// 标记用户已查看更新（优化版）
export const markUpdatesAsViewedAtom = atom(null, (get, set) => {
  const config = get(notificationConfigAtom);
  const now = new Date().toISOString();

  set(notificationConfigAtom, {
    ...config,
    lastViewedTime: now,
  });
});

// 忽略特定通知
export const dismissNotificationAtom = atom(
  null,
  (get, set, notificationId: string) => {
    const config = get(notificationConfigAtom);

    set(notificationConfigAtom, {
      ...config,
      dismissedNotifications: [
        ...config.dismissedNotifications,
        notificationId,
      ],
    });
  }
);

// 更新用户偏好设置
export const updateNotificationPreferencesAtom = atom(
  null,
  (get, set, preferences: Partial<NotificationConfig["preferences"]>) => {
    const config = get(notificationConfigAtom);

    set(notificationConfigAtom, {
      ...config,
      preferences: {
        ...config.preferences,
        ...preferences,
      },
    });
  }
);

// 重置通知配置
export const resetNotificationConfigAtom = atom(null, (_get, set) => {
  set(notificationConfigAtom, defaultConfig);
});

// 获取未读通知数量
export const unreadNotificationCountAtom = atom((get) => {
  // 这里可以根据实际需求计算未读数量
  // 暂时返回是否有新更新的布尔值转数字
  return get(hasNewUpdatesAtom) ? 1 : 0;
});
