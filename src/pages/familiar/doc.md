# 熟词标记功能开发文档计划

## 一、项目概述

### 1.1 目标

实现用户标记熟词功能，支持本地和云端数据同步，提供熟词过滤和管理功能。

### 1.2 功能范围

- 单词标记/取消标记
- 熟词列表管理
- 熟词过滤
- 数据同步
- 数据导入导出

## 二、技术架构

### 2.1 数据库设计

#### 本地数据库（Dexie.js）

- 表名：`familiarWords`
- 主键：`id`
- 索引：
  - `uuid`（唯一索引）
  - `[dict+word]`（复合索引）
- 字段：
  - `id`: 自增主键
  - `uuid`: 唯一标识符
  - `word`: 单词
  - `dict`: 词典 ID
  - `isFamiliar`: 是否熟词
  - `sync_status`: 同步状态
  - `last_modified`: 最后修改时间

#### 云端数据库（MongoDB）

- 集合名：`FamiliarWord`
- 索引：
  - `{ userId: 1, dict: 1, word: 1 }`
  - `{ userId: 1, updatedAt: 1 }`
- 字段：
  - `uuid`: 唯一标识符
  - `userId`: 用户 ID
  - `word`: 单词
  - `dict`: 词典 ID
  - `isFamiliar`: 是否熟词
  - `sync_status`: 同步状态
  - `last_modified`: 最后修改时间
  - `clientModifiedAt`: 客户端修改时间
  - `serverModifiedAt`: 服务器修改时间
  - `isDeleted`: 是否删除

### 2.2 同步机制

- 使用现有同步服务
- 支持离线操作
- 冲突解决策略
