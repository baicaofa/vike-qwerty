import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <div className="bg-white rounded-lg shadow-inner mb-4 border border-gray-100">
      <div
        className={`p-3 ${collapsible ? "cursor-pointer" : ""}`}
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-gray-800">{title}</h3>
          {collapsible && (
            <span className="text-gray-500">{isExpanded ? "▼" : "▶"}</span>
          )}
        </div>
      </div>
      {isExpanded && <div className="px-3 pb-3">{children}</div>}
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

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { config, loading, updateConfig, resetConfig } = useReviewConfig();
  const [localConfig, setLocalConfig] = useState<IReviewConfig | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setLocalConfig({ ...config });
      setHasChanges(false);
    }
  }, [config, isOpen]);

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
      onClose(); // 保存成功后关闭弹窗
    } catch (error) {
      console.error("Failed to save config:", error);
      // 这里可以添加一个 toast 通知用户保存失败
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
        onClose(); // 重置成功后关闭弹窗
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

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("您有未保存的更改，确定要关闭吗？")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="max-w-3xl h-[60vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>复习设置</DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 -mr-4">
          {loading || !localConfig ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">加载设置中...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <ConfigCard title="快速配置">
                <PresetSelector onApplyPreset={handleApplyPreset} />
              </ConfigCard>

              <ConfigCard title="核心设置">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={localConfig.enableNotifications}
                        onChange={(e) =>
                          handleConfigChange(
                            "enableNotifications",
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        复习提醒
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      提醒时间
                    </label>
                    <input
                      type="time"
                      value={localConfig.notificationTime}
                      onChange={(e) =>
                        handleConfigChange("notificationTime", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </ConfigCard>

              <ConfigCard title="间隔设置">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    记忆间隔 (天)
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    定义每个复习阶段之间的时间间隔，用逗号分隔。
                  </p>
                  <textarea
                    value={localConfig.baseIntervals.join(", ")}
                    onChange={(e) =>
                      handleConfigChange(
                        "baseIntervals",
                        e.target.value
                          .split(",")
                          .map((s) => parseFloat(s.trim()))
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={2}
                    placeholder="例如: 0.5, 1, 3, 7, 15, 30"
                  />
                </div>
              </ConfigCard>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            <Button variant="ghost" onClick={handleReset} disabled={saving}>
              重置为默认
            </Button>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={saving || !hasChanges}>
              {saving ? "保存中..." : "保存更改"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
