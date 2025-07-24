# 修复数据表重复键错误

## 问题描述

同步时出现 MongoDB 重复键错误，涉及多个数据表：

```
E11000 duplicate key error collection: KEYBR.wordreviewrecords index: userId_1_word_1 dup key: { userId: ObjectId('67fb6de6ddc5a6ec74a829f3'), word: "possess" }
```

## 问题根源

**数据库约束与同步逻辑不匹配**：

- 某些表的 MongoDB 唯一索引基于业务逻辑字段（如 userId + word）
- 但同步逻辑统一使用 `{ userId, uuid }` 作为查询条件
- 导致系统无法正确识别已存在的记录，触发重复键错误

## 受影响的表

### 1. WordReviewRecord ✅ 已修复

- **MongoDB 约束**: `{ userId: 1, word: 1 }`
- **修复方案**: 使用 `{ userId, word }` 查询条件

### 2. FamiliarWord ✅ 已修复

- **MongoDB 约束**: `{ userId: 1, dict: 1, word: 1 }`
- **修复方案**: 使用 `{ userId, dict, word }` 查询条件

### 3. WordRecord ✅ 已有特殊处理

- **MongoDB 约束**: `{ userId: 1, dict: 1, word: 1 }`
- **现状**: 已有专门的同步逻辑

## 解决方案

### 1. 修改服务端同步逻辑

在 `src/server/controllers/syncController.ts` 中为受影响的表添加特殊处理：

- 使用与数据库唯一约束一致的查询条件
- 正确处理创建、更新、删除操作
- 保持 UUID 的一致性

### 2. 修改客户端创建逻辑

在 `src/utils/spaced-repetition/scheduleGenerator.ts` 中：

- 将 `db.wordReviewRecords.add()` 改为 `db.wordReviewRecords.put()`
- 避免在并发情况下创建重复记录

## 修改的文件

1. `src/server/controllers/syncController.ts` - 添加特殊处理逻辑
2. `src/utils/spaced-repetition/scheduleGenerator.ts` - 优化创建方法

## 预期效果

- 解决所有相关表的同步重复键错误
- 确保数据唯一性约束得到正确执行
- 保持数据一致性和同步稳定性
