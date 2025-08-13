import "./SyncStatusIndicator.css";
import { useSync } from "@/hooks/useSync";
import type React from "react";

export const SyncStatusIndicator: React.FC = () => {
  const { syncState, lastSyncResult, hasChanges, triggerSync } = useSync();

  // 获取状态图标
  const getStatusIcon = () => {
    switch (syncState) {
      case "syncing":
        return <span className="syncing-icon">🔄</span>;
      case "success":
        return <span className="success-icon">✅</span>;
      case "error":
        return <span className="error-icon">❌</span>;
      default:
        return hasChanges ? (
          <span className="pending-icon">🔄</span>
        ) : (
          <span className="success-icon">✅</span>
        );
    }
  };

  // 获取状态提示文本
  const getStatusText = () => {
    switch (syncState) {
      case "syncing":
        return "正在同步...";
      case "success":
        return lastSyncResult
          ? `同步成功 (${lastSyncResult.changesApplied} 条本地变更, ${lastSyncResult.serverChanges} 条服务器变更)`
          : "同步成功";
      case "error":
        return lastSyncResult?.error
          ? `同步失败: ${lastSyncResult.error.message}`
          : "同步失败";
      default:
        return hasChanges ? "有待同步的变更" : "已同步";
    }
  };

  return (
    <div className="sync-status-container">
      <div
        className={`sync-status-indicator ${hasChanges ? "clickable" : ""}`}
        onClick={hasChanges ? () => triggerSync() : undefined}
        title={getStatusText()}
      >
        {getStatusIcon()}
      </div>
    </div>
  );
};
