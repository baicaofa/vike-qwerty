# Dexie v10 升级与回滚说明

## 目标
- 将 IndexedDB 结构升级到 v10，统一表结构与索引，降低数据不一致与重复风险。

## 关键变更
- 版本号：`db.verno` 期望版本=10。
- 清空两表（仅本地）：`wordReviewRecords`、`reviewHistories`。
- 在线迁移 `wordRecords`：
  - 为每个 performanceEntry 补齐 `entryUuid`（如缺则生成）；
  - `mistakes` 兜底 `{}`；
  - 按 `entryUuid` 去重合并；
  - 重算 `firstSeenAt/lastPracticedAt`；
  - 按 `[dict+word]` 聚合保留 `last_modified` 新者。
- `familiarWords`：v10 升级按 `[dict+word]` 去重，运行时写入严格 upsert；v10 stores 将 `[dict+word]` 提升为唯一。
- `chapterRecords/reviewRecords`：时间字段统一为 `createTime`（替代旧 `timeStamp`）。

## 升级触发
- 在 `src/utils/db/index.ts` 的 `this.version(10)` 中声明 stores 与 `upgrade(async tx => ...)` 迁移逻辑。
- 推荐在 `src/pages/+onHydrationEnd.ts` 中首次水合后调用 `checkAndUpgradeDatabase()`，异步执行升级（不阻塞首屏）。

## 升级耗时与建议
- 取决于数据量；建议：
  - 在升级期间避免并发大量写入；
  - 对迁移操作分批处理（当前实现已做），必要时增加批大小/日志；
  - 遇到 ConstraintError（uuid 唯一冲突）时，按控制台指引重置数据库或重试。

## 验证要点
- `wordRecords`：entryUuid 全量存在；mistakes 为对象；[dict+word] 无重复；first/last 时间正确；主页面可用。
- `familiarWords`：无重复 [dict+word]；切换熟词标记稳定。
- 两表清空：`wordReviewRecords`、`reviewHistories` 计数为 0（升级后）。

## 回滚策略
- 不建议回退 IndexedDB 版本号（浏览器不支持降级）。
- 如出现不可恢复故障：
  1) 备份可能需要的本地数据（如导出为 JSON）。
  2) 执行 `db.delete()` 清除本地数据库，刷新页面重新初始化。
  3) 前端回滚到上一个稳定包；后端保持版本拒写中间件以免旧端误写。

## 常见问题
- 初次升级耗时较长：视数据体量属正常；可在控制台观察进度日志。
- 升级中断：刷新后会再次触发升级；部分迁移具备幂等。
- 同步失败：检查 `x-app-data-version` 请求头、Cookie 鉴权与 CORS 凭证；查看服务器日志的 warn/skip。
