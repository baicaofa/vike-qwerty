# 修复 wordReviewRecords 同步失败问题

## 问题描述

**错误信息**：`wordReviewRecords validation failed: lastReviewedAt: Path 'lastReviewedAt' is required.`

**问题根源**：

1. 客户端的 `lastReviewedAt` 字段是可选的 `number?` 类型
2. 服务端的 `lastReviewedAt` 字段是必需的 `Date` 类型
3. 客户端的 `completeReview()` 方法没有更新 `lastReviewedAt` 字段
4. 同步控制器没有正确处理字段映射和类型转换

## 修复方案

### 1. 客户端修复 ✅

**文件**：`src/utils/db/wordReviewRecord.ts`
**修改**：在 `completeReview()` 方法中添加 `lastReviewedAt` 更新

```typescript
// 更新最后复习时间
this.lastReviewedAt = currentTime;
```

### 2. 同步控制器修复 ✅

**文件**：`src/server/controllers/syncController.ts`
**修改**：为 wordReviewRecords 添加专门的字段映射逻辑

**主要改进**：

- 时间戳字段转换（number → Date）
- 默认值处理：如果客户端没有 `lastReviewedAt`，使用 `lastPracticedAt` 或 `firstSeenAt`
- 必需字段的默认值设置
- 忽略客户端独有字段

### 3. 新记录创建修复 ✅

**文件**：`src/utils/spaced-repetition/scheduleGenerator.ts`
**修改**：在创建新记录时添加 `lastReviewedAt` 字段

```typescript
lastReviewedAt: now, // 设置最后复习时间
```

### 4. 更新函数修复 ✅

**文件**：`src/utils/spaced-repetition/scheduleGenerator.ts`
**修改**：在 `updateWordReviewSchedule()` 函数中添加 `lastReviewedAt` 更新

```typescript
lastReviewedAt: wordReviewRecord.lastReviewedAt, // 添加最后复习时间更新
```

## 字段映射策略

| 客户端字段                    | 服务端字段                         | 转换策略                                                                                             |
| ----------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `lastReviewedAt?: number`     | `lastReviewedAt: Date`             | `safeParseDate(clientLastReviewedAt) \|\| safeParseDate(clientLastPracticedAt) \|\| firstSeenAtDate` |
| `firstSeenAt: number`         | `firstSeenAt: Date`                | `safeParseDate(clientFirstSeenAt) \|\| new Date()`                                                   |
| `nextReviewAt: number`        | `nextReviewAt: Date`               | `safeParseDate(clientNextReviewAt) \|\| new Date()`                                                  |
| `consecutiveCorrect?: number` | `consecutiveCorrect: number`       | `consecutiveCorrect \|\| 0`                                                                          |
| -                             | `forgettingFactor: number`         | 默认值 `0.5`                                                                                         |
| -                             | `reviewLevel: number`              | 默认值 `0`                                                                                           |
| -                             | `lastReviewResult: string \| null` | 默认值 `null`                                                                                        |

## 测试验证

修复后需要验证：

1. 新的复习记录能正确同步
2. 现有记录的同步不会失败
3. `lastReviewedAt` 字段在复习后正确更新

## 后续优化

可选的改进：

1. 添加数据迁移脚本修复历史数据中的空 `lastReviewedAt` 字段
2. 统一客户端和服务端的字段定义
3. 添加更严格的数据验证

## 修复时间

2024-12-XX - 完成客户端和同步控制器修复
