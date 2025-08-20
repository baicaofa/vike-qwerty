任务：后端-PR-BE-3 Schema 对齐（entryUuid/mistakes 默认、reviewHistories.parentUuid 冗余）

变更范围：
- `src/server/models/WordRecord.ts`
  - `IPerformanceEntry` 增加 `entryUuid: string`（v10 标准），并在 `PerformanceEntrySchema` 中设为 `required: true`，默认使用 `new ObjectId().toString()` 以兼容旧数据迁移。
  - `mistakes` 字段设置 `default: {}`，避免客户端未传时校验失败。
- `src/server/models/ReviewHistory.ts`
  - 新增 `parentUuid?: string` 字段并建立索引，用于回传外键（例如本地 `wordReviewRecord` 的 `uuid`）。

兼容性：
- 旧数据读写不报错；缺失的 `entryUuid` 会在服务端默认补齐。

验证要点：
- 模型编译通过；索引创建无冲突；写入不传 `mistakes` 也可通过（默认 `{}`）。


