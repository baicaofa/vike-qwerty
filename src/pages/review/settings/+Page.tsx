import ReviewNav from "@/components/ReviewNav";
import { Link } from "@/components/ui/Link";
import { useReviewConfig } from "@/hooks/useSpacedRepetition";
import type { IReviewConfig } from "@/utils/db/reviewConfig";
import { PRESET_CONFIGS } from "@/utils/spaced-repetition/config";
import type React from "react";
import { useEffect, useState } from "react";

const ConfigCard: React.FC<{
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
}> = ({ title, children, collapsible = false }) => {
  const [isExpanded, setIsExpanded] = useState(!collapsible);

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div
        className={`p-4 ${collapsible ? "cursor-pointer" : ""}`}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {collapsible && (
            <span className="text-gray-500">{isExpanded ? "▼" : "▶"}</span>
          )}
        </div>
      </div>
      {isExpanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

const PresetSelector: React.FC<{
  onApplyPreset: (preset: Partial<IReviewConfig>) => void;
}> = ({ onApplyPreset }) => {
  const presets = Object.entries(PRESET_CONFIGS);

  const presetInfo = {
    beginner: { name: "初学者", description: "轻松入门" },
    standard: { name: "标准", description: "平衡配置" },
    intensive: { name: "高强度", description: "快速进步" },
    relaxed: { name: "轻松", description: "时间有限" },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {presets.map(([key, preset]) => {
        const info = presetInfo[key as keyof typeof presetInfo];
        return (
          <div
            key={key}
            className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1">{info.name}</h3>
            <p className="text-xs text-gray-600 mb-2">{info.description}</p>
            <div className="text-xs text-gray-500 mb-2 space-y-1">
              <div>目标: {preset.dailyReviewTarget}</div>
              <div>间隔: {preset.baseIntervals.slice(0, 3).join(", ")}...</div>
            </div>
            <button
              type="button"
              onClick={() => onApplyPreset(preset)}
              className="w-full bg-blue-600 text-white py-1.5 rounded text-xs hover:bg-blue-700 transition-colors"
            >
              应用
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default function ReviewSettings() {
  const { config, loading, updateConfig, resetConfig } = useReviewConfig();
  const [localConfig, setLocalConfig] = useState<IReviewConfig | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setLocalConfig({ ...config });
    }
  }, [config]);

  const handleConfigChange = (field: keyof IReviewConfig, value: unknown) => {
    if (!localConfig) return;

    setLocalConfig((prev) => (prev ? { ...prev, [field]: value } : null));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!localConfig || !hasChanges) return;

    setSaving(true);
    try {
      await updateConfig(localConfig);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save config:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("确定要重置为默认设置吗？这将清除所有自定义配置。")) {
      setSaving(true);
      try {
        await resetConfig();
        setHasChanges(false);
      } catch (error) {
        console.error("Failed to reset config:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleApplyPreset = (preset: Partial<IReviewConfig>) => {
    if (!localConfig) return;
    const newConfig = { ...localConfig, ...preset };
    setLocalConfig(newConfig);
    setHasChanges(true);
  };

  if (loading || !localConfig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载设置中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 暂时移除推荐功能，因为需要不同的数据结构
  // const recommendations = getConfigRecommendations(localConfig);

  return (
    <div className="container mx-auto px-4 py-6">
      <ReviewNav />

      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">复习设置</h1>
          <Link
            href="/review/dashboard"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← 返回仪表板
          </Link>
        </div>
        <p className="text-gray-600 text-sm">自定义您的复习体验</p>
      </div>

      {/* 保存提示 */}
      {hasChanges && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-blue-800 text-sm">您有未保存的更改</p>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => {
                  setLocalConfig(config ? { ...config } : null);
                  setHasChanges(false);
                }}
                className="px-3 py-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 预设配置 */}
      <ConfigCard title="快速配置">
        <PresetSelector onApplyPreset={handleApplyPreset} />
      </ConfigCard>

      {/* 核心设置 */}
      <ConfigCard title="核心设置">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              每日目标
            </label>
            <input
              type="number"
              min="1"
              max="500"
              value={localConfig.dailyReviewTarget}
              onChange={(e) =>
                handleConfigChange(
                  "dailyReviewTarget",
                  parseInt(e.target.value)
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="20-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最大复习数
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={localConfig.maxReviewsPerDay}
              onChange={(e) =>
                handleConfigChange("maxReviewsPerDay", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="上限"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localConfig.enableNotifications}
                onChange={(e) =>
                  handleConfigChange("enableNotifications", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                复习提醒
              </span>
            </label>
            {localConfig.enableNotifications && (
              <input
                type="time"
                value={localConfig.notificationTime}
                onChange={(e) =>
                  handleConfigChange("notificationTime", e.target.value)
                }
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            )}
          </div>
        </div>
      </ConfigCard>

      {/* 高级设置 */}
      <ConfigCard title="高级设置" collapsible={true}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            复习间隔序列 (天)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {localConfig.baseIntervals.map((interval, index) => (
              <div key={index} className="flex items-center space-x-1">
                <span className="text-xs text-gray-600 w-8">L{index + 1}:</span>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={interval}
                  onChange={(e) => {
                    const newIntervals = [...localConfig.baseIntervals];
                    newIntervals[index] = parseInt(e.target.value);
                    handleConfigChange("baseIntervals", newIntervals);
                  }}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                />
                <span className="text-xs text-gray-500">天</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            建议递增序列：1, 3, 7, 15, 30, 60 天
          </p>
        </div>
      </ConfigCard>

      {/* 操作按钮 */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
        >
          重置默认
        </button>

        <div className="space-x-2">
          <Link
            href="/review/dashboard"
            className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
          >
            返回
          </Link>

          {hasChanges && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
