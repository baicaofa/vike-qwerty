# 同步协议 v10（前后端契约）

## 版本与请求头
- 客户端必须在所有同步请求中携带请求头：`x-app-data-version: v10`
- 服务器在 `/api/sync` 路由前挂载版本拒写中间件：低于 v10 返回 `426`，响应体：
`{ "code": "VERSION_REJECTED", "min": "v10" }`

## 统一时间边界（Date ↔︎ number(ms)）
- 入站（客户端→服务端）：客户端以毫秒 number 上传；服务端转换为 Date 存储。
- 出站（服务端→客户端）：服务端将 Date 全部转换为毫秒 number 返回。

## 表级契约

### wordRecords
- 客户端字段要点：
  - `uuid: string`
  - `dict: string`, `word: string`
  - `performanceHistory: { timeStamp: number, chapter: number|null, timing: number[], wrongCount: number, mistakes: object, entryUuid: string }[]`
  - `firstSeenAt?: number`, `lastPracticedAt?: number`
  - `sync_status: "local_new"|"local_modified"|"local_deleted"|"synced"`
  - `last_modified: number`
- 服务器入站合并：
  - 以 `{userId, dict, word}` 唯一定位；
  - `performanceHistory` 按 `entryUuid` 去重合并，若冲突取 `timeStamp` 新者；
  - 合并后按 `timeStamp` 升序排序，并重算 `firstSeenAt/lastPracticedAt`；
  - `mistakes` 兜底 `{}`。
- 出站：按上述字段返回，时间一律为毫秒。

### wordReviewRecords（间隔重复）
- 客户端字段要点：`uuid`, `word`, `intervalSequence`, `currentIntervalIndex`, `nextReviewAt`, `lastPracticedAt`, `lastReviewedAt`, `firstSeenAt`, `sync_status`, `last_modified` 等（全部毫秒 number）。
- 入站：`{userId, word}` 定位，upsert；时间字段转为 Date。
- 出站：时间全部毫秒。

### reviewHistories（复习历史，v10 重点改造）
- 客户端上传：
  - 使用 `parentUuid: string` 指向父 `wordReviewRecord.uuid`；
  - 不再上传 `wordReviewRecordId`（数据库内部 ObjectId 外键）；
  - 其他字段：`uuid`, `word`, `dict`, `reviewedAt(ms)`, `reviewResult`, `responseTime`, `reviewType`, `sessionId?`, `sync_status`, `last_modified`。
- 服务器入站：
  - 先解析本批/数据库中的父：`parentUuid -> wordReviewRecordId(ObjectId)`；找不到父则跳过并记录 warn（避免“孤儿”记录）。
- 服务器出站：
  - 仅回传 `parentUuid`，不回传内部 `wordReviewRecordId`（隐藏数据库外键实现）。

### familiarWords
- 唯一性：`[dict+word]` 唯一；v10 升级去重保留 `last_modified` 新者；运行时写入严格 upsert。

### chapterRecords / reviewRecords
- 字段统一：`createTime: number`（替代旧的 `timeStamp`）。

### reviewConfigs
- 维持既有结构，时间边界同一规则。

## 幂等与冲突
- `wordRecords` 使用 `entryUuid` 幂等去重；重复推送同一 `entryUuid` 不产生重复。
- `reviewHistories` 缺失父时跳过；存在父时按 `uuid` 幂等 upsert。
- 其余表以 `uuid` 记录级 upsert。

## 认证与安全
- 认证：优先 HttpOnly Cookie（`withCredentials: true`），兼容 Authorization Bearer。
- CORS：服务器启用 `credentials: true`，前端请求附带凭证。

## 错误码与可观测性
- 版本拒写：`426 { code: VERSION_REJECTED, min: "v10" }`
- 认证失败：`401`
- 权限不足（邮箱未验证等）：`403`
- 服务端错误：`5xx`
- 前端应分类记录错误（NETWORK/AUTH/PERMISSION/SERVER/UNKNOWN）与重试策略。

## 变更清单（与 v9 相比）
- 新增：`reviewHistories.parentUuid`；
- 隐藏：`reviewHistories.wordReviewRecordId`（仅服务器内部使用）；
- 统一时间：所有 Date 出站为毫秒；
- `wordRecords` 合并策略改为 `entryUuid` 去重；
- `chapter/review` 时间字段统一为 `createTime`；
- `familiarWords` `[dict+word]` 唯一与运行时 upsert。



