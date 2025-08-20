任务：后端-PR-BE-1 版本拒写中间件 (x-app-data-version)

范围：
- 新增 `src/server/middleware/appVersion.ts`，导出 `appVersionEnforce` 中间件与 `MIN_SUPPORTED_APP_DATA_VERSION` 常量（v10）。
- 在 `src/server/routes/sync.ts` 的路由链中插入版本校验：放在 `protect` 与 `requireEmailVerified` 之后、`syncData` 之前。

接口契约：
- 客户端请求头必须携带 `x-app-data-version: v10`。
- 不满足时返回 `426` 状态码与 JSON `{ code: "VERSION_REJECTED", min: "v10" }`。

注意：该中间件仅作用于 `/api/sync`；后续可按需扩展至其他与数据写入相关的接口。

验证要点：
- 未带或非 v10 版本时被拒绝；v10 正常。


