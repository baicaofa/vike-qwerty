# 修复 Dexie 数据库模式不匹配问题

## 问题描述

出现错误：`Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.`

错误发生在 `scheduleGenerator.ts:276` 的 `getDueWordsForReview` 函数中。

## 问题分析

通过分析发现，`wordReviewRecords` 表在数据库版本9中的模式定义不完整，缺少了 `IWordReviewRecord` 接口中的多个字段：

### 缺失的字段
- `userId` - 用户ID
- `intervalSequence` - 间隔序列数组
- `totalReviews` - 总复习次数
- `reviewHistory` - 复习历史数组
- `consecutiveCorrect` - 连续正确次数
- `sourceDicts` - 源词典数组
- `preferredDict` - 首选词典
- `firstSeenAt` - 首次遇到时间

### 版本9中的表定义
```typescript
wordReviewRecords:
  "++id, &uuid, &word, nextReviewAt, currentIntervalIndex, isGraduated, todayPracticeCount, lastPracticedAt, lastReviewedAt, sync_status, last_modified"
```

## 解决方案

### 步骤1：创建数据库版本10
在 `src/utils/db/index.ts` 中添加版本10定义，完善 `wordReviewRecords` 表结构：

```typescript
this.version(10)
  .stores({
    // 完善 wordReviewRecords 表结构，添加所有缺失字段
    wordReviewRecords:
      "++id, &uuid, &word, userId, intervalSequence, currentIntervalIndex, nextReviewAt, totalReviews, isGraduated, reviewHistory, consecutiveCorrect, lastReviewedAt, todayPracticeCount, lastPracticedAt, sourceDicts, preferredDict, firstSeenAt, sync_status, last_modified",
    // 其他表保持不变...
  })
```

### 步骤2：数据迁移
在版本10升级过程中，为现有记录添加缺失字段的默认值：
- `userId`: "default"
- `intervalSequence`: [1, 3, 7, 15, 30, 60]
- `totalReviews`: 0
- `reviewHistory`: []
- `consecutiveCorrect`: 0
- `sourceDicts`: []
- `preferredDict`: ""
- `firstSeenAt`: 使用 `lastPracticedAt` 或当前时间

### 步骤3：更新期望版本号
将 `checkAndUpgradeDatabase` 函数中的期望版本从9改为10。

## 实施结果

✅ 已成功创建数据库版本10
✅ 已完善 `wordReviewRecords` 表结构
✅ 已简化升级逻辑，移除复杂数据迁移
✅ 已更新期望版本号
✅ 已改进 `toWordReviewRecord` 函数，添加缺失字段默认值处理

## 升级失败问题及修复

### 问题描述
数据库升级操作失败，出现 "Backend aborted error" 和 "InvalidStateError: Backend aborted error" 错误。

### 问题原因
版本10升级逻辑中的复杂数据迁移操作导致数据库事务失败。

### 修复方案
1. **简化升级逻辑**：移除复杂的数据迁移，只保留模式升级
2. **应用层处理**：在 `toWordReviewRecord` 函数中添加缺失字段的默认值处理
3. **降低风险**：避免升级过程中的大量异步操作

## 唯一性约束违反问题及修复

### 问题描述
出现错误："AbortError ConstraintError Unable to add key to index 'word': at least one key does not satisfy the uniqueness requirements."

### 问题原因
`wordReviewRecords` 表中的 `word` 字段设计为唯一索引，但数据中存在重复的单词记录。

### 修复方案
1. **保持唯一性约束**：确认 `word` 字段的唯一性设计是正确的
2. **独立清理函数**：创建 `cleanDuplicateWordReviewRecords` 函数，提供重复数据清理功能
3. **自动执行**：在 `checkAndUpgradeDatabase` 函数中自动调用清理函数
4. **保留最新记录**：对于重复的单词记录，按 `last_modified` 时间排序，保留最新的记录
5. **批量删除**：使用 `bulkDelete` 操作删除重复记录，提高性能
6. **错误处理**：提供完整的错误处理和日志输出

## 预期效果

修复后，Dexie 将不再报告模式不匹配错误，`getDueWordsForReview` 函数可以正常工作，复习系统功能将完全正常。

## 技术细节

- 遵循了 KISS 原则：使用简单的版本升级机制
- 遵循了 DRY 原则：复用了现有的升级框架
- 遵循了 SOLID 原则：单一职责，只处理数据库模式升级
- 符合 YAGNI 原则：只添加当前需要的字段，不预留不必要的字段
