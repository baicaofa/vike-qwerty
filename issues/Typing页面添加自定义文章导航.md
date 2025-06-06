# Typing 页面添加自定义文章导航

## 需求背景

用户在 Typing 页面练习时，希望能够方便地导航到自定义文章功能，但顶部导航已经比较拥挤，不适合再添加新的导航项。

## 解决方案

在 Typing 页面左侧添加一个悬浮按钮，提供到自定义文章页面的快速导航。

## 实现细节

### 1. 位置设计

- **位置**：左侧悬浮，位于 WordList 按钮下方（top-[60%]）
- **样式**：与现有 WordList 按钮保持一致的设计风格
- **层级**：z-index 为 20，确保在其他元素之上

### 2. 视觉设计

- **颜色主题**：使用绿色系（green-50/green-200），区别于 WordList 的蓝色
- **图标**：使用编辑图标（笔和纸），符合"自定义文章"的功能特征
- **悬停效果**：颜色加深，提供视觉反馈
- **暗色模式**：适配暗色主题（green-900/green-800）

### 3. 交互设计

- **Tooltip 提示**：显示"自定义文章练习"
- **可访问性**：添加 title 和 aria-label 属性
- **过渡动画**：200ms 的颜色过渡效果

### 4. 技术实现

```tsx
{
  /* 自定义文章悬浮按钮 */
}
<Tooltip
  content="自定义文章练习"
  placement="top"
  className="!absolute left-5 top-[60%] z-20"
>
  <a
    href="/custom-article"
    title="自定义文章练习"
    aria-label="自定义文章练习"
    className="fixed left-0 top-[60%] z-20 rounded-lg rounded-l-none bg-green-50 px-2 py-3 text-lg hover:bg-green-200 focus:outline-none dark:bg-green-900 dark:hover:bg-green-800 transition-colors duration-200"
  >
    <svg className="h-6 w-6 text-green-600 dark:text-green-400">
      {/* 编辑图标 */}
    </svg>
  </a>
</Tooltip>;
```

## 优势

1. **不干扰现有布局**：悬浮设计不影响主要内容区域
2. **视觉一致性**：与 WordList 按钮样式保持一致
3. **位置合理**：左侧位置符合用户习惯，容易发现
4. **功能明确**：图标和提示清楚表达功能
5. **响应式友好**：适配不同屏幕尺寸和主题

## 用户体验

- 用户在练习单词时可以随时切换到自定义文章练习
- 悬浮按钮不会干扰正常的打字练习
- 提供了两种练习模式之间的便捷切换

## 执行日期

2025-01-16
