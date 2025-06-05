# 更新通知系统

## 概述

这是一个完整的更新通知系统，支持多种通知类型、用户偏好设置和智能显示逻辑。

## 功能特性

### 🔔 核心功能

- **智能小红点**: 根据最新更新时间和用户查看状态自动显示/隐藏
- **弹窗展示**: 点击铃铛图标显示详细更新内容
- **自动标记**: 关闭弹窗时自动标记为已查看
- **数据持久化**: 使用 localStorage 保存用户状态

### 🎛️ 高级功能

- **通知类型**: 支持更新、新功能、维护、公告四种类型
- **用户偏好**: 可自定义显示哪些类型的通知
- **优先级**: 支持高、中、低三个优先级
- **忽略功能**: 可忽略特定通知（预留功能）

### ⚙️ 设置选项

- **显示偏好**: 控制各类型通知的显示
- **重置功能**: 一键重置所有设置
- **状态查看**: 显示最后查看时间和忽略数量

## 文件结构

```
src/components/UpdateNotification/
├── index.tsx                 # 主组件
├── NotificationSettings.tsx  # 设置组件
└── README.md                # 说明文档

src/store/
└── updateNotification.ts    # 状态管理

src/data/
└── notifications.ts         # 数据源
```

## 使用方法

### 1. 添加新通知

在 `src/data/notifications.ts` 中添加新的通知项：

```typescript
{
  id: "update-2025-01-20",
  type: "update",
  date: "2025年1月20日",
  title: "新功能标题",
  tag: "新功能",
  desc: "功能描述...",
  images: ["图片URL"],
  priority: "high"
}
```

### 2. 自定义弹窗大小

在 `src/components/UpdateNotification/index.tsx` 第 132 行修改 CSS 类：

```tsx
<div className="relative w-full max-w-2xl max-h-[80vh] ...">
```

- `max-w-2xl`: 控制宽度 (可改为 `max-w-xl`, `max-w-3xl` 等)
- `max-h-[80vh]`: 控制高度 (可改为 `max-h-[70vh]`, `max-h-[600px]` 等)

### 3. 修改显示位置

在 `src/components/UpdateNotification/index.tsx` 第 108 行修改位置：

```tsx
<div className="fixed bottom-6 right-6 z-[60]">
```

- `bottom-6 right-6`: 右下角
- `top-6 right-6`: 右上角
- `bottom-6 left-6`: 左下角

## 状态管理

### 主要原子 (Atoms)

- `notificationConfigAtom`: 通知配置（偏好、查看时间等）
- `hasNewUpdatesAtom`: 是否有新更新
- `validNotificationsAtom`: 过滤后的有效通知
- `isUpdateNotificationOpenAtom`: 弹窗显示状态

### 操作原子 (Actions)

- `markUpdatesAsViewedAtom`: 标记为已查看
- `updateNotificationPreferencesAtom`: 更新用户偏好
- `dismissNotificationAtom`: 忽略特定通知
- `resetNotificationConfigAtom`: 重置配置

## 扩展建议

### 1. API 集成

```typescript
// 从服务器获取通知数据
export const notificationsDataAtom = atom(async () => {
  const response = await fetch("/api/notifications");
  return response.json();
});
```

### 2. 实时更新

```typescript
// 使用WebSocket或轮询
useEffect(() => {
  const interval = setInterval(() => {
    // 检查新通知
  }, 30000);
  return () => clearInterval(interval);
}, []);
```

### 3. 通知分组

```typescript
// 按日期或类型分组显示
const groupedNotifications = useMemo(() => {
  return groupBy(notifications, "date");
}, [notifications]);
```

## 注意事项

1. **性能**: 通知数据使用计算原子，会自动缓存和更新
2. **存储**: 配置数据保存在 localStorage 中，清除浏览器数据会重置
3. **兼容性**: 使用现代浏览器 API，IE 不支持
4. **样式**: 使用 Tailwind CSS，确保样式正确加载

## 故障排除

### 小红点不显示

- 检查通知数据是否正确
- 确认用户偏好设置
- 查看浏览器控制台错误

### 弹窗不显示

- 检查 z-index 冲突
- 确认状态管理正常
- 查看组件是否正确挂载

### 数据不持久化

- 检查 localStorage 权限
- 确认 atomWithStorage 正常工作
- 查看浏览器存储设置
