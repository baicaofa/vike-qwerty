“后端改造（Mongoose Schema 与同步控制器）” PR 的可执行细化清单（可直接建任务卡），包含改动点、触点、观测指标与回退点。

### PR-BE-1 版本拒写中间件（x-app-data-version）
- 变更
  - 新增 `src/server/middleware/appVersion.ts`
    - 从请求头读取 `x-app-data-version`
    - 校验常量 `MIN_APP_DATA_VERSION='v10'`
    - 小于最小版本时直接返回 426（Upgrade Required）或 409，并附带提示信息与最小版本
  - 在 `src/server/routes/sync.ts` 引入并置于 `protect` 之后、`syncData` 之前
- 控制器/触点
  - `src/server/routes/sync.ts`
  - 新增 `src/server/middleware/appVersion.ts`
- 观测指标
  - 版本拒写计数（含版本号）、占比
  - 被拒写用户/UA 分布
- 回退点
  - 路由移除该中间件即可；不影响数据

### PR-BE-2 Cookie 鉴权改造（HttpOnly）
- 变更
  - 依赖：`cookie-parser`
  - `src/server/index.ts`
    - `app.use(cookieParser())`
    - CORS：允许凭证 `Access-Control-Allow-Credentials: true`，来源白名单
  - `src/server/middleware/auth.ts`
    - `protect` 读取优先级：Cookie(token) → Authorization Bearer（兼容期保留）
    - 校验通过后挂载 `req.user`
  - `src/server/controllers/auth.ts`
    - 登录：校验成功后 `res.cookie('token', jwt, { httpOnly:true, secure:prod, sameSite:'lax', path:'/', maxAge:... })`
    - 登出：`res.clearCookie('token', { path:'/' })`
- 控制器/触点
  - `src/server/middleware/auth.ts`
  - `src/server/controllers/auth.ts`
  - `src/server/index.ts`
- 观测指标
  - Cookie 登录成功率；Cookie 与 Bearer 占比
  - 鉴权失败原因分布
- 回退点
  - 保留 Bearer 读取逻辑即可兜底；Cookie 设置可临时关闭

### PR-BE-3 Schema 调整与索引（entryUuid 与 parentUuid 接入面）
- 变更
  - `src/server/models/WordRecord.ts`
    - `PerformanceEntrySchema` 增加：
      - `entryUuid: { type: String, required: true }`
      - `mistakes: { type: Schema.Types.Mixed, default: {} }`（保持默认空对象）
    - 保持唯一索引：`WordRecordSchema.index({ userId:1, dict:1, word:1 }, { unique:true })`
    - 二级索引：`{ userId:1, lastPracticedAt:1 }`、`{ userId:1, updatedAt:1 }`
  - `src/server/models/ReviewHistory.ts`
    - 可选冗余字段：`parentUuid: { type: String, index: true }`（用于回传/排错；外键仍用 `wordReviewRecordId`）
    - 维持现有索引：`(userId, reviewedAt)`、`(userId, word, reviewedAt)`、`(userId, sessionId)`、`(userId, reviewResult, reviewedAt)`
  - 建索引（确保已创建）：使用 mongoose schema 索引，或单独脚本 ensureIndex（可选）
- 同步控制器要点（仅触点说明，合并逻辑放在 PR-BE-4）
  - 入站校验：
    - wordRecords：`performanceHistory[*].entryUuid` 必须存在；否则 400
    - reviewHistories：`parentUuid` 必须存在；不再接受以 `word` 回填主键的路径（收到也忽略）
  - 出站格式化：
    - reviewHistories：附带 `parentUuid`（由 `wordReviewRecord.uuid` 读取），隐藏 `wordReviewRecordId`
- 控制器/触点
  - `src/server/models/WordRecord.ts`
  - `src/server/models/ReviewHistory.ts`
  - `src/server/controllers/syncController.ts`（入站验证点、出站 `formatRecordForSync` 附带 parentUuid）
- 观测指标
  - 入站校验失败数（缺 entryUuid/parentUuid）
  - 新索引创建完成率（一次性）
- 回退点
  - `entryUuid` 与 `parentUuid` 校验可先设为“警告不拒写”，必要时再升为强校验

### PR-BE-4 同步控制器合并逻辑（可直接落地）

- 涉及文件
  - `src/server/controllers/syncController.ts`（核心）
  - 可选：`src/server/utils/syncUtils.ts`（拆出通用函数）
  - 仅本 PR 改控制器逻辑，不动 Schema

### 变更目标
- 入站（客户端→服务端）：按表执行幂等 upsert；合并逻辑统一；强制外键走 `parentUuid`；wordRecords 条目按 `entryUuid` 去重。
- 出站（服务端→客户端）：统一 Date→毫秒；`reviewHistories` 回传 `parentUuid`，隐藏 `ObjectId`。

---

## 入站处理（下载后再上传的统一合并逻辑）

#### 入口与通用校验（延续 PR-BE-1/2/3）
- 检查 `x-app-data-version >= v10`
- 鉴权：HttpOnly Cookie 优先
- 请求体校验：`lastSyncTimestamp: string`、`changes: SyncChange[]`
- 每条变更必须含：`table ∈ 白名单`、`action ∈ {create|update|delete}`、`data.uuid` 存在
- 仅在边界做毫秒→Date 转换；保留 `lastModified:number`

#### 通用辅助函数（建议抽到 utils）
```ts
function toDate(num?: number): Date | undefined { return typeof num === 'number' ? new Date(num) : undefined; }

function pickLatestByLastModified(clientMs: number, serverClientModifiedAt?: Date): 'client'|'server' {
  const serverMs = serverClientModifiedAt?.getTime() ?? -1;
  return clientMs >= serverMs ? 'client' : 'server';
}

function ensureArray<T>(v: any): T[] { return Array.isArray(v) ? v : []; }

function buildPerfEntryKey(e): string {
  // 优先 entryUuid；回退用 timeStamp + featureHash
  if (e.entryUuid) return `uuid:${e.entryUuid}`;
  const feature = `${e.chapter ?? 'n'}:${Array.isArray(e.timing)? e.timing.length:0}:${e.wrongCount ?? 0}`;
  return `ts:${(e.timeStamp instanceof Date ? e.timeStamp.getTime() : e.timeStamp) || 0}:${feature}`;
}
```

---

## 各表合并规则（入站）

### 1) wordRecords（练习表现，条目级合并）
- 关键约束
  - 唯一键：`(userId, dict, word)`；幂等锚点：`uuid`
  - `performanceHistory[*]` 必须有 `entryUuid`（无则 400）
  - `mistakes` 必须存在（无则 `{}`）
- 处理流程
```ts
// 查找既存：优先 uuid，再回退 (userId, dict, word)
const existing = await WordRecordModel.findOne({ userId, uuid }) 
               ?? await WordRecordModel.findOne({ userId, dict, word });

if (action === 'delete') {
  if (existing && !existing.isDeleted) { existing.isDeleted = true; await existing.save(); }
  return;
}

// 合并策略选择
const winner = pickLatestByLastModified(client.lastModified, existing?.clientModifiedAt);

// 组合 history（条目级去重）
const serverHistory = ensureArray(existing?.performanceHistory);
const clientHistory = ensureArray(client.performanceHistory).map(e => ({
  ...e,
  mistakes: e.mistakes ?? {},
  timeStamp: toDate(e.timeStamp)!, // type guard
}));
const map = new Map<string, any>();
for (const e of serverHistory) map.set(buildPerfEntryKey(e), e);
for (const e of clientHistory) map.set(buildPerfEntryKey(e), e);
const mergedHistory = Array.from(map.values()).sort((a,b)=>a.timeStamp.getTime()-b.timeStamp.getTime());

// 生成写入文档
const doc = existing ?? new WordRecordModel({ userId, uuid });
doc.set({
  dict, word,
  performanceHistory: mergedHistory,
  firstSeenAt: toDate(client.firstSeenAt) ?? (mergedHistory[0]?.timeStamp ?? new Date()),
  lastPracticedAt: toDate(client.lastPracticedAt) ?? (mergedHistory.at(-1)?.timeStamp ?? new Date()),
  isDeleted: false,
});

if (winner === 'client') {
  doc.set({
    sync_status: client.sync_status ?? 'synced',
    last_modified: client.last_modified,
    clientModifiedAt: new Date(client.last_modified),
  });
}
await doc.save();
```

### 2) wordReviewRecords（跨词典聚合，记录级 upsert）
- 关键约束
  - 唯一键：`(userId, word)`；幂等 uuid
  - `sourceDicts` 做并集合并；其余字段“新者胜”
```ts
const existing = await WRR.findOne({ userId, uuid }) ?? await WRR.findOne({ userId, word });

if (action === 'delete') { if (existing && !existing.isDeleted) { existing.isDeleted = true; await existing.save(); } return; }

const winner = pickLatestByLastModified(client.lastModified, existing?.clientModifiedAt);
const mergedSourceDicts = Array.from(new Set([...(existing?.sourceDicts ?? []), ...(client.sourceDicts ?? [])]));

const doc = existing ?? new WRR({ userId, uuid });
doc.set({
  word,
  intervalSequence: client.intervalSequence ?? existing?.intervalSequence ?? [1,3,7,15,30,60],
  currentIntervalIndex: client.currentIntervalIndex ?? existing?.currentIntervalIndex ?? 0,
  nextReviewAt: toDate(client.nextReviewAt) ?? existing?.nextReviewAt ?? new Date(),
  totalReviews: client.totalReviews ?? existing?.totalReviews ?? 0,
  consecutiveCorrect: client.consecutiveCorrect ?? existing?.consecutiveCorrect ?? 0,
  lastReviewedAt: toDate(client.lastReviewedAt) ?? existing?.lastReviewedAt ?? new Date(),
  todayPracticeCount: client.todayPracticeCount ?? existing?.todayPracticeCount ?? 0,
  lastPracticedAt: toDate(client.lastPracticedAt) ?? existing?.lastPracticedAt ?? new Date(),
  sourceDicts: mergedSourceDicts,
  preferredDict: client.preferredDict ?? existing?.preferredDict ?? mergedSourceDicts[0] ?? '',
  firstSeenAt: toDate(client.firstSeenAt) ?? existing?.firstSeenAt ?? new Date(),
  isDeleted: false,
});
if (winner === 'client') {
  doc.set({ sync_status: client.sync_status ?? 'synced', last_modified: client.last_modified, clientModifiedAt: new Date(client.last_modified) });
}
await doc.save();
```

### 3) reviewHistories（append-only，强依赖 parentUuid）
- 关键约束
  - 仅允许 create 与软删；不接受 update（视为 no-op）
  - 解析外键：`parentUuid → wordReviewRecordId`（按 userId+uuid 查主表）
  - 冗余保留：`word`、`dict` 仅查询辅助，不参与关联
```ts
// 解析外键
const parent = await WRR.findOne({ userId, uuid: client.parentUuid });
if (!parent) { audit.skip('reviewHistories', 'PARENT_NOT_FOUND', client.uuid); return; }

if (action === 'delete') {
  const existing = await RH.findOne({ userId, uuid: client.uuid });
  if (existing && !existing.isDeleted) { existing.isDeleted = true; await existing.save(); }
  return;
}
if (action === 'update') { return; } // append-only

const doc = new RH({
  userId, uuid: client.uuid,
  wordReviewRecordId: parent._id,
  word: client.word, dict: client.dict,
  reviewedAt: toDate(client.reviewedAt),
  reviewResult: client.reviewResult,
  responseTime: client.responseTime,
  intervalProgressBefore: client.intervalProgressBefore,
  intervalProgressAfter: client.intervalProgressAfter,
  intervalIndexBefore: client.intervalIndexBefore,
  intervalIndexAfter: client.intervalIndexAfter,
  reviewType: client.reviewType,
  sessionId: client.sessionId,
  sync_status: client.sync_status ?? 'synced',
  last_modified: client.last_modified,
  clientModifiedAt: new Date(client.last_modified),
});
await doc.save();
```

### 4) familiarWords（标志位覆盖）
- 唯一键 `(userId, dict, word)`；`isFamiliar` 覆盖；删除为软删
```ts
const existing = await FW.findOne({ userId, uuid }) ?? await FW.findOne({ userId, dict, word });
if (action === 'delete') { if (existing && !existing.isDeleted) { existing.isDeleted = true; await existing.save(); } return; }

const doc = existing ?? new FW({ userId, uuid, dict, word });
doc.set({
  isFamiliar: !!client.isFamiliar,
  sync_status: client.sync_status ?? 'synced',
  last_modified: client.last_modified,
  clientModifiedAt: new Date(client.last_modified),
  isDeleted: false,
});
await doc.save();
```

### 5) chapterRecords（记录级 upsert）
- 锚点：`uuid` 优先；回退 `(userId, dict, chapter, createTime)`
```ts
const existing = await CR.findOne({ userId, uuid }) ?? await CR.findOne({ userId, dict, chapter, createTime: toDate(client.createTime) });
if (action === 'delete') { if (existing && !existing.isDeleted) { existing.isDeleted = true; await existing.save(); } return; }

const doc = existing ?? new CR({ userId, uuid });
doc.set({
  dict, chapter,
  time: client.time, correctCount: client.correctCount, wrongCount: client.wrongCount,
  wordCount: client.wordCount, correctWordIndexes: client.correctWordIndexes ?? [],
  wordNumber: client.wordNumber, wordRecordIds: client.wordRecordIds ?? [],
  timeStamp: toDate(client.createTime), // 若模型用 createTime 字段，按你的 Schema 对齐
  sync_status: client.sync_status ?? 'synced',
  last_modified: client.last_modified,
  clientModifiedAt: new Date(client.last_modified),
  isDeleted: false,
});
await doc.save();
```

### 6) reviewRecords（记录级 upsert）
```ts
const existing = await RR.findOne({ userId, uuid });
if (action === 'delete') { if (existing && !existing.isDeleted) { existing.isDeleted = true; await existing.save(); } return; }

const doc = existing ?? new RR({ userId, uuid });
doc.set({
  dict, index: client.index ?? 0, createTime: toDate(client.createTime),
  isFinished: !!client.isFinished, words: client.words ?? [],
  sync_status: client.sync_status ?? 'synced',
  last_modified: client.last_modified,
  clientModifiedAt: new Date(client.last_modified),
  isDeleted: false,
});
await doc.save();
```

---

## 出站格式化（服务端→客户端）
- 统一转换：所有 `Date` → 毫秒 number
- `reviewHistories`：附带 `parentUuid`（由 `wordReviewRecordId` 查询其 `uuid`）；隐藏 `wordReviewRecordId`（不暴露 ObjectId）
```ts
function formatRecordForSync(record, table): SyncChange {
  const data = { ...record.toObject?.() ?? record };
  delete data._id; delete data.__v;

  // 特殊：wordRecords.performanceHistory 时间转毫秒
  if (table === 'wordRecords' && Array.isArray(data.performanceHistory)) {
    data.performanceHistory = data.performanceHistory.map(e => ({
      ...e,
      timeStamp: e.timeStamp instanceof Date ? e.timeStamp.getTime() : e.timeStamp,
    }));
  }

  // 特殊：reviewHistories parentUuid 回填
  if (table === 'reviewHistories' && data.wordReviewRecordId) {
    data.parentUuid = idToUuidCache.get(data.wordReviewRecordId) // 预热或查询
    delete data.wordReviewRecordId;
  }

  // 统一 Date→毫秒
  for (const k in data) {
    const v = data[k];
    if (v instanceof Date) data[k] = v.getTime();
    else if (Array.isArray(v)) data[k] = v.map(x => x instanceof Date ? x.getTime() : x);
  }

  return { table, action: 'update', data };
}
```

---

## 可观测指标（新增/增强）
- 入站
  - 每表：create/update/delete 成功数、软删数、跳过数（原因：校验失败/外键缺失/冲突败选）
  - 冲突解决次数（client 胜/server 胜）
  - wordRecords：条目合并总数、去重条数（entryUuid/回退键）
  - reviewHistories：外键解析失败计数（按 parentUuid）
- 出站
  - 回传变更数；Date→毫秒转换错误数（理论应为 0）

---

## 事务与批处理
- changes 可按表分组并行处理（每表内部串行，避免死锁）
- 大批量写入建议使用 `bulkWrite`（注意恢复 `clientModifiedAt` 与软删位）

---

## 回退点
- 灰度开关 `SYNC_PROTOCOL_V10_ENABLED`：
  - 关闭：不强制 entryUuid/parentUuid 校验，回退为旧合并（短期过渡）
  - 发生高错误率或外键解析失败飙升时，快速关闭开关并记录样本

---

## 验收要点（后端侧）
- `wordRecords`：多端并发/重复回放不产生重复条目；合并后 history 有序、无遗漏
- `reviewHistories`：仅 parentUuid 路径；无 `word` 回填外键；append-only
- 全链路时间字段正确（API 毫秒，DB Date）
- 同步成功率、冲突解决次数、外键失败率均在阈值内



### PR-BE-5 出站格式与同步窗口（服务端→客户端）
- 变更
  - 统一出站格式化：
    - Date→毫秒 number（全表统一）
    - `reviewHistories` 回传 `parentUuid`，隐藏 `wordReviewRecordId`
  - 同步窗口：
    - 仅回传 `updatedAt > clientLastSyncTimestamp` 的变更
    - 返回 `newSyncTimestamp = now()`（或最后一条 updatedAt），由客户端推进
  - id→uuid 映射缓存：
    - 在控制器内对 `wordReviewRecordId`→`uuid` 做批量预热（一次性查询 Map），避免 N+1
- 触点
  - `src/server/controllers/syncController.ts`: 出站打包逻辑、格式化函数
- 观测指标
  - 回传记录数/批；格式化失败数（应为0）；映射缓存命中率
- 验收
  - 客户端收到的数据时间字段均为毫秒；`reviewHistories` 含 `parentUuid`、不含 `_id/wordReviewRecordId`
- 回退点
  - 暂时保留旧路径（回传 ObjectId），但优先走新路径；出现异常时切回旧路径

### PR-BE-6 兼容适配与审计（snake_case→camelCase、错误分类、审计日志）
- 变更
  - 入站字段兼容：
    - 在同步入口对旧命名兼容映射：`sync_status→syncStatus`、`last_modified→lastModified`、`timeStamp→createTime/timeStamp` 等
    - 字段白名单过滤（防止多余字段污染）
  - 统一错误分类（便于统计与前端提示）：
    - `VALIDATION_ERROR`、`VERSION_REJECTED`、`FK_NOT_FOUND`、`CONFLICT_LOST`、`RATE_LIMITED`、`SERVER_ERROR`
  - 审计记录（建议轻量日志，不单独落库）：
    - 每批同步写：表、action、count、失败原因计数；外键失败列表（最多 N 条样本）
- 触点
  - `src/server/controllers/syncController.ts`: 入站字段规范化、错误分类、审计日志
  - `src/server/middleware/errorHandler.ts`（如有）
- 观测指标
  - 各错误类型计数；字段兼容触发次数；外键失败率
- 验收
  - 旧客户端字段名在过渡期可被接受且不报错；日志中可见错误分类聚合
- 回退点
  - 关闭兼容映射，仅接受新字段（严格模式）

### PR-BE-7 灰度与特性开关（同步协议 v10）
- 变更
  - 环境开关：
    - `SYNC_PROTOCOL_V10_ENABLED=true/false`：强制 `entryUuid/parentUuid` 与新合并策略
    - `ALLOW_LEGACY_WRITE=false`：禁止旧端写入（除只读）
  - 允许白名单用户/比例灰度：
    - 支持通过环境变量或配置文件注入 `USER_ALLOWLIST`、`ROLLOUT_PERCENT`
  - 控制器内分支：
    - 开关关闭时：降级为旧合并（短期兜底），并打日志标记降级
- 触点
  - `src/server/controllers/syncController.ts`: 关键分支
  - `src/server/index.ts`: 注入开关配置
- 观测指标
  - 开关开启用户比例、降级命中次数；对应错误率变化
- 验收
  - 小比例开启不影响整体成功率；无大面积异常
- 回退点
  - 关闭开关，立刻回到旧策略

### PR-BE-8 数据完整性维护作业（软删清理/重复清理/指数修复）
- 变更
  - 脚本与定时任务（可先离线脚本，后再定时）：
    - `scripts/cleanup-soft-deleted.ts`：清理 `isDeleted=true` 且超过 N 天的记录（各表）
    - `scripts/cleanup-duplicates.ts`：按唯一键（如 `(userId, dict, word)` / `(userId, word)`）保留 `clientModifiedAt` 最新，删除其余
    - `scripts/rebuild-indexes.ts`：确保索引存在，必要时重建
    - `scripts/audit-repair-reviewHistories.ts`：孤儿历史（外键缺失）统计与隔离
  - 幂等、可干跑（dry-run），输出影响行数
- 触点
  - `src/server/scripts/*.ts`
- 观测指标
  - 软删清理数量、重复清理数量、孤儿历史数量、索引重建耗时
- 验收
  - 干跑报告正确；正式执行后数据库一致性指标改善
- 回退点
  - 脚本支持 `dryRun=true` 与 `--since=...` 范围控制；支持导出备份清单，必要时回滚

### PR-BE-9 观测与告警（健康检查、指标、阈值告警）
- 变更
  - 健康检查与简单指标端点（如无 Prometheus，可先日志上报）：
    - `/healthz`: 返回 DB 连接/队列积压等
    - 指标：同步成功率、平均耗时、冲突解决次数、外键失败率、版本拒写率、每表 upsert 统计
  - 阈值告警（先基于日志/服务商告警）：
    - 同步错误率 > X%
    - 外键失败率 > Y%
    - 版本拒写率异常升高
- 触点
  - `src/server/index.ts` 或 `src/server/controllers/metrics.ts`
- 观测指标
  - 见上；并可添加每 5 分钟聚合日志
- 验收
  - 指标端点可访问；日志中看到稳定聚合
- 回退点
  - 关闭指标端点与告警配置（不影响核心同步）

### PR-BE-10 文档与回滚手册
- 变更
  - 文档：
    - `doc/后端-同步协议-v10.md`：字段表、时间转换、外键规则、冲突策略、兼容与开关
    - `doc/后端-运维脚本.md`：脚本说明、dry-run/正式执行、回滚方法
    - `doc/灰度与回退.md`：开关说明、观测指标、阈值、回退流程
  - 供 QA 的验收 checklist
- 触点
  - `doc/*`
- 观测指标
  - 无（文档项）
- 验收
  - 文档完整可用；能支撑上线与回退
- 回退点
  - 无代码影响

—

