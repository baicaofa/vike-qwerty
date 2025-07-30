# 标点符号控制功能实现

## 🎯 功能概述

在自定义文章练习页面添加了标点符号控制按钮，允许用户在练习过程中实时切换是否显示标点符号。

## ✨ 功能特点

### 1. **双重按钮位置**
- **顶部操作栏**: 在页面顶部的操作按钮区域添加了标点符号控制按钮
- **底部控制栏**: 在练习控制按钮区域也添加了相同的功能按钮

### 2. **实时切换**
- 用户可以在练习过程中随时切换标点符号显示状态
- 切换时会自动暂停练习，处理文本后恢复练习状态
- 无需重新开始练习

### 3. **视觉反馈**
- **隐藏标点模式**: 按钮显示橙色，图标为编辑笔，文本为"显示标点"
- **显示标点模式**: 按钮显示灰色，图标为X，文本为"隐藏标点"
- 按钮状态实时反映当前的标点符号设置

### 4. **智能处理**
- 切换时会自动重新处理文本内容
- 保持当前的练习进度和统计信息
- 平滑的状态转换，不影响用户体验

## 🔧 技术实现

### 核心函数
```typescript
const handleTogglePunctuation = () => {
  // 如果正在练习，先暂停
  if (state.isTyping && !state.isPaused) {
    safeDispatch({ type: ArticleActionType.PAUSE_TYPING });
  }
  
  // 更新预处理设置
  dispatch({
    type: ArticleActionType.UPDATE_PREPROCESS_SETTINGS,
    payload: { 
      removePunctuation: !state.preprocessSettings.removePunctuation 
    },
  });
  
  // 重新处理文本
  dispatch({ type: ArticleActionType.PROCESS_TEXT });
  
  // 如果之前正在练习，恢复练习
  if (state.isTyping && !state.isPaused) {
    safeDispatch({ type: ArticleActionType.RESUME_TYPING });
  }
};
```

### 状态管理
- 使用现有的 `preprocessSettings.removePunctuation` 状态
- 通过 `UPDATE_PREPROCESS_SETTINGS` action 更新设置
- 通过 `PROCESS_TEXT` action 重新处理文本

### UI 组件
- 按钮使用条件样式，根据当前状态显示不同颜色
- 图标和文本根据状态动态变化
- 提供 tooltip 提示功能

## 📍 按钮位置

### 1. 顶部操作栏
```tsx
{/* 标点符号控制按钮 */}
<button
  type="button"
  onClick={handleTogglePunctuation}
  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
    state.preprocessSettings.removePunctuation
      ? "bg-orange-600 hover:bg-orange-700 text-white"
      : "bg-gray-600 hover:bg-gray-700 text-white"
  }`}
>
  {/* 动态图标和文本 */}
</button>
```

### 2. 底部控制栏
```tsx
{/* 标点符号切换按钮 */}
<button
  type="button"
  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
    state.preprocessSettings.removePunctuation
      ? "bg-orange-600 hover:bg-orange-700 text-white"
      : "bg-gray-600 hover:bg-gray-700 text-white"
  }`}
  onClick={handleTogglePunctuation}
>
  {/* 动态图标和文本 */}
</button>
```

## 🎨 用户体验

### 使用场景
1. **练习前设置**: 用户可以在开始练习前选择是否显示标点符号
2. **练习中调整**: 用户可以在练习过程中根据需要进行调整
3. **不同难度**: 隐藏标点符号可以增加练习难度，显示标点符号更适合初学者

### 交互流程
1. 用户点击标点符号控制按钮
2. 系统自动暂停当前练习（如果正在练习）
3. 更新预处理设置并重新处理文本
4. 恢复练习状态（如果之前正在练习）
5. 用户看到更新后的文本内容

## 🔄 与其他功能的集成

### 与现有系统的兼容性
- ✅ 完全兼容现有的状态管理系统
- ✅ 与文章上传、编辑功能无缝集成
- ✅ 保持练习统计数据的准确性
- ✅ 支持多语言翻译

### 与预处理步骤的关系
- 这个功能实际上是预处理步骤的实时版本
- 用户可以在练习过程中动态调整预处理设置
- 提供了更灵活的使用体验

## 📝 需要添加的翻译

```json
{
  "practice": {
    "showPunctuation": "显示标点",
    "hidePunctuation": "隐藏标点"
  }
}
```

## 🚀 优势

1. **灵活性**: 用户可以随时调整标点符号显示
2. **直观性**: 按钮状态清晰反映当前设置
3. **便捷性**: 无需重新开始练习即可调整设置
4. **一致性**: 与现有UI设计风格保持一致
5. **可访问性**: 提供tooltip提示和图标说明