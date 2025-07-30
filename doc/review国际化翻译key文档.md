# Review 模块国际化翻译 Key 文档

## 概述

本文档列出了 Review 模块国际化所需的所有翻译 key，按照功能模块分类组织。

## 翻译文件位置

- 中文翻译：`public/locales/zh/review.json`
- 英文翻译：`public/locales/en/review.json`

## 翻译 Key 结构

### 1. Dashboard（仪表板）

```json
{
  "dashboard": {
    "title": "复习仪表板",
    "subtitle": "查看您的复习进度和统计数据",
    "recentProgress": "最近7天复习进度",
    "statistics": "复习统计",
    "viewHistory": "查看详细历史记录"
  }
}
```

**使用场景**：复习仪表板主页面

### 2. Stats（统计数据）

```json
{
  "stats": {
    "todayReview": "今日复习",
    "target": "目标",
    "dueWords": "待复习单词",
    "needReview": "需要复习",
    "totalReviews": "总复习次数",
    "cumulativeReview": "累计复习",
    "streakDays": "连续复习天数",
    "keepRecord": "保持记录",
    "totalWords": "总单词数",
    "reviewedWords": "已复习单词",
    "weeklyReviews": "本周复习次数",
    "averageAccuracy": "平均准确率",
    "excellent": "优秀",
    "good": "良好",
    "fair": "一般",
    "needsImprovement": "需改进",
    "warmingUp": "热身中"
  }
}
```

**使用场景**：统计卡片、性能等级显示

### 3. Chart（图表）

```json
{
  "chart": {
    "accuracy": "准确率",
    "actualReview": "实际复习",
    "targetAmount": "目标数量"
  }
}
```

**使用场景**：进度图表、数据可视化

### 4. TimeRange（时间范围）

```json
{
  "timeRange": {
    "label": "选择时间范围",
    "last7Days": "最近7天",
    "last30Days": "最近30天",
    "last3Months": "最近3个月",
    "allTime": "全部时间"
  }
}
```

**使用场景**：历史记录筛选器

### 5. History（历史记录）

```json
{
  "history": {
    "title": "复习历史",
    "subtitle": "查看您的复习记录和进度",
    "noRecords": "暂无复习记录",
    "word": "单词",
    "lastReview": "最后复习",
    "reviewCount": "复习次数",
    "level": "等级",
    "accuracy": "准确率",
    "interval": "间隔",
    "nextReview": "下次复习",
    "neverReviewed": "未复习",
    "filterByLevel": "按等级筛选",
    "allLevels": "所有等级",
    "level1": "等级 1",
    "level2": "等级 2",
    "level3": "等级 3",
    "level4": "等级 4",
    "level5": "等级 5",
    "searchPlaceholder": "搜索单词...",
    "sortBy": "排序方式",
    "sortByLastReview": "按最后复习时间",
    "sortByReviewCount": "按复习次数",
    "sortByLevel": "按等级",
    "sortByAccuracy": "按准确率",
    "studyDays": "学习天数",
    "studyDaysSubtitle": "有复习记录的天数",
    "masteredWords": "掌握单词",
    "masteredWordsSubtitle": "记忆强度 > 80%",
    "reviewTrend": "复习趋势",
    "dailyReviewStats": "每日复习数量和准确率",
    "reviewCount": "复习数量"
  }
}
```

**使用场景**：复习历史页面、单词记录显示

### 6. Practice（练习）

```json
{
  "practice": {
    "title": "复习练习",
    "subtitle": "开始您的复习练习",
    "startPractice": "开始练习",
    "continuePractice": "继续练习",
    "practiceComplete": "练习完成",
    "word": "单词",
    "meaning": "释义",
    "example": "例句",
    "remember": "记得",
    "forget": "忘记",
    "difficult": "困难",
    "easy": "简单",
    "nextWord": "下一个单词",
    "previousWord": "上一个单词",
    "progress": "进度",
    "accuracy": "准确率",
    "timeSpent": "用时",
    "wordsReviewed": "已复习单词",
    "wordsRemaining": "剩余单词",
    "pausePractice": "暂停练习",
    "resumePractice": "继续练习",
    "endPractice": "结束练习",
    "practiceSummary": "练习总结",
    "totalWords": "总单词数",
    "correctAnswers": "正确答案",
    "incorrectAnswers": "错误答案",
    "averageTime": "平均用时",
    "bestAccuracy": "最佳准确率",
    "practiceAgain": "再次练习",
    "backToDashboard": "返回仪表板",
    "preparingWords": "正在准备您的复习单词",
    "backToReviewPage": "返回复习页面",
    "switchToPracticed": "切换到已练习模式",
    "switchToUnpracticed": "切换到未练习模式",
    "practiceMode": "练习模式"
  }
}
```

**使用场景**：复习练习页面、练习状态显示

### 7. Today（今日复习）

```json
{
  "today": {
    "title": "今日复习",
    "subtitle": "完成今日的复习任务",
    "todayTarget": "今日目标",
    "completed": "已完成",
    "remaining": "剩余",
    "startTodayReview": "开始今日复习",
    "noReviewToday": "今日无需复习",
    "allCompleted": "今日复习已完成",
    "comebackTomorrow": "明天再来复习吧",
    "reviewProgress": "复习进度",
    "wordsToReview": "待复习单词",
    "wordsCompleted": "已完成单词",
    "timeEstimate": "预计用时",
    "minutes": "分钟",
    "noUnpracticedWords": "没有未练习的单词",
    "noPracticedWords": "没有已练习的单词",
    "unpracticed": "未练习",
    "practiced": "已练习",
    "practicedCount": "已练习 {{count}} 次"
  }
}
```

**使用场景**：今日复习页面、进度显示

### 8. Status（状态）

```json
{
  "status": {
    "loading": "加载中...",
    "noData": "暂无数据",
    "error": "加载失败",
    "retry": "重试"
  }
}
```

**使用场景**：加载状态、错误处理

### 9. Trends（趋势）

```json
{
  "trends": {
    "up": "上升",
    "down": "下降",
    "stable": "稳定"
  }
}
```

**使用场景**：趋势指示器

### 10. Colors（颜色）

```json
{
  "colors": {
    "blue": "蓝色",
    "green": "绿色",
    "yellow": "黄色",
    "red": "红色",
    "gray": "灰色"
  }
}
```

**使用场景**：颜色主题描述

### 11. WordCard（单词卡片）

```json
{
  "wordCard": {
    "due": "到期",
    "graduated": "已毕业",
    "practiceCount": "练习次数",
    "reviewProgress": "复习进度",
    "priority": "优先级",
    "nextReview": "下次复习",
    "completed": "已完成",
    "totalReviews": "总复习次数",
    "intervalLevel": "间隔等级"
  }
}
```

**使用场景**：单词卡片组件

### 12. Nav（导航）

```json
{
  "nav": {
    "reviewSettings": "复习设置"
  }
}
```

**使用场景**：导航栏

### 13. RoundProgress（轮次进度）

```json
{
  "roundProgress": {
    "round": "第 {{round}} 轮",
    "completedWords": "完成 {{completed}} / {{total}} 个单词",
    "remainingWords": "还需完成 {{remaining}} 个单词才能进入下一轮",
    "roundCompleted": "此轮次已完成，可以开始下一轮"
  }
}
```

**使用场景**：轮次进度显示组件

### 14. Summary（摘要）

```json
{
  "summary": {
    "noData": "暂无复习计划数据",
    "todayOverview": "今日计划概览",
    "plannedReview": "计划复习",
    "urgentReview": "紧急复习",
    "estimatedTime": "预估时间(分钟)",
    "easy": "轻松",
    "normal": "适中",
    "hard": "困难",
    "difficultyLevel": "难度等级"
  }
}
```

**使用场景**：复习摘要组件

### 15. Buttons（按钮）

```json
{
  "buttons": {
    "close": "关闭",
    "refresh": "刷新",
    "back": "返回"
  }
}
```

**使用场景**：通用按钮文本

### 16. Tooltips（提示）

```json
{
  "tooltips": {
    "reviewStatus": "复习状态",
    "practiceProgress": "练习进度"
  }
}
```

**使用场景**：工具提示

### 17. Messages（消息）

```json
{
  "messages": {
    "loadingData": "正在加载数据...",
    "noWordsToReview": "没有需要复习的单词",
    "practiceComplete": "练习完成！",
    "continuePractice": "继续练习",
    "startNewPractice": "开始新练习"
  }
}
```

**使用场景**：系统消息

### 18. Filters（筛选器）

```json
{
  "filters": {
    "allWords": "所有单词",
    "unpracticedWords": "未练习单词",
    "practicedWords": "已练习单词",
    "urgentWords": "紧急单词",
    "dueWords": "到期单词"
  }
}
```

**使用场景**：单词筛选

### 19. Progress（进度）

```json
{
  "progress": {
    "completed": "已完成",
    "remaining": "剩余",
    "total": "总计",
    "percentage": "百分比"
  }
}
```

**使用场景**：进度显示

### 20. Time（时间）

```json
{
  "time": {
    "minutes": "分钟",
    "seconds": "秒",
    "hours": "小时",
    "days": "天"
  }
}
```

**使用场景**：时间单位

### 21. Difficulty（难度）

```json
{
  "difficulty": {
    "easy": "简单",
    "normal": "普通",
    "hard": "困难",
    "expert": "专家"
  }
}
```

**使用场景**：难度等级

### 22. Achievements（成就）

```json
{
  "achievements": {
    "streak": "连续天数",
    "accuracy": "准确率",
    "speed": "速度",
    "mastery": "掌握度"
  }
}
```

**使用场景**：成就系统

## 使用 Common 命名空间的 Key

以下 key 使用 `common` 命名空间，已在 `common.json` 中定义：

- `common:buttons.refresh` - "刷新" / "Refresh"
- `common:buttons.back` - "返回" / "Back"
- `common:buttons.close` - "关闭" / "Close"
- `common:navigation.home` - "首页" / "Home"

## 插值使用

支持插值的翻译 key：

- `review:roundProgress.round` - 使用 `{{round}}` 插值
- `review:roundProgress.completedWords` - 使用 `{{completed}}` 和 `{{total}}` 插值
- `review:roundProgress.remainingWords` - 使用 `{{remaining}}` 插值
- `review:today.practicedCount` - 使用 `{{count}}` 插值

## 注意事项

1. 所有翻译 key 都使用小写字母和冒号分隔
2. 支持嵌套结构，便于组织和管理
3. 插值使用双大括号 `{{variable}}` 格式
4. 确保中英文翻译文件结构一致
5. 新增翻译 key 时需要同时更新中英文文件