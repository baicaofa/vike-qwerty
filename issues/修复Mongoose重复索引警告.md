# 修复 Mongoose 重复索引警告

## 问题描述

服务器启动时出现 Mongoose 警告：

```
(node:9632) [MONGOOSE] Warning: Duplicate schema index on {"userId":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
```

## 问题根源

在多个 Mongoose Schema 中，同时使用了：

1. **字段级别的索引定义**：`index: true`
2. **Schema 级别的索引定义**：`Schema.index()`

这导致了重复的索引创建，触发 Mongoose 警告。

## 受影响的模型

### 1. ReviewConfig ✅ 已修复

- **重复索引字段**: `userId`
- **问题**: 字段级别 `index: true` + Schema 级别 `index({ userId: 1 })`

### 2. WordRecord ✅ 已修复

- **重复索引字段**: `uuid`, `userId`, `dict`, `isDeleted`
- **问题**: 字段级别索引与 Schema 级别复合索引重复

### 3. WordReviewRecord ✅ 已修复

- **重复索引字段**: `uuid`, `userId`, `word`, `nextReviewAt`, `isDeleted`
- **问题**: 字段级别索引与 Schema 级别复合索引重复

### 4. ReviewHistory ✅ 已修复

- **重复索引字段**: `uuid`, `userId`, `wordReviewRecordId`, `word`, `reviewedAt`, `reviewResult`
- **问题**: 字段级别索引与 Schema 级别复合索引重复

## 修复原则

1. **保留 Schema 级别索引**：优先使用 `Schema.index()` 方法定义的索引
2. **移除字段级别索引**：删除字段定义中的 `index: true`
3. **保留必要的唯一约束**：保持 `unique: true` 用于唯一性约束
4. **优化索引策略**：移除不必要的单字段索引，优先使用复合索引

## 修复内容

### ReviewConfig 模型

- 移除 `userId` 字段的 `index: true`
- 保留 Schema 级别的 `{ userId: 1 }` 唯一索引

### WordRecord 模型

- 移除 `uuid` 字段的 `index: true`（保留 `unique: true`）
- 移除 `userId`, `dict`, `isDeleted` 字段的 `index: true`
- 保留 Schema 级别的复合索引

### WordReviewRecord 模型

- 移除 `uuid`, `userId`, `word`, `nextReviewAt`, `isDeleted` 字段的 `index: true`
- 保留 Schema 级别的复合索引

### ReviewHistory 模型

- 移除 `uuid`, `userId`, `wordReviewRecordId`, `word`, `reviewedAt`, `reviewResult` 字段的 `index: true`
- 保留 Schema 级别的复合索引

## 修改的文件

1. `src/server/models/ReviewConfig.ts`
2. `src/server/models/WordRecord.ts`
3. `src/server/models/WordReviewRecord.ts`
4. `src/server/models/ReviewHistory.ts`

## 预期效果

- 消除 Mongoose 重复索引警告
- 优化数据库索引策略
- 保持查询性能不变
- 减少不必要的索引开销
