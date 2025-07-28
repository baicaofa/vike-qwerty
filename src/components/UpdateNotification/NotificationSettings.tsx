import {
  notificationConfigAtom,
  resetNotificationConfigAtom,
  updateNotificationPreferencesAtom,
} from "@/store/updateNotification";
import { useAtom, useSetAtom } from "jotai";
import { RotateCcw, Settings } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function NotificationSettings() {
  const { t } = useTranslation("common");
  const [config] = useAtom(notificationConfigAtom);
  const updatePreferences = useSetAtom(updateNotificationPreferencesAtom);
  const resetConfig = useSetAtom(resetNotificationConfigAtom);
  const [isOpen, setIsOpen] = useState(false);

  const handlePreferenceChange = (
    key: keyof typeof config.preferences,
    value: boolean
  ) => {
    updatePreferences({ [key]: value });
  };

  const handleReset = () => {
    resetConfig();
    setIsOpen(false);
  };

  return (
    <>
      {/* 设置按钮 */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label={t("notification.settings")}
      >
        <Settings size={16} />
      </button>

      {/* 设置弹窗 */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("notification.settingsTitle")}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("notification.productUpdates")}
                </label>
                <input
                  type="checkbox"
                  checked={config.preferences.showUpdates}
                  onChange={(e) =>
                    handlePreferenceChange("showUpdates", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("notification.newFeatures")}
                </label>
                <input
                  type="checkbox"
                  checked={config.preferences.showFeatures}
                  onChange={(e) =>
                    handlePreferenceChange("showFeatures", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("notification.maintenance")}
                </label>
                <input
                  type="checkbox"
                  checked={config.preferences.showMaintenance}
                  onChange={(e) =>
                    handlePreferenceChange("showMaintenance", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("notification.announcements")}
                </label>
                <input
                  type="checkbox"
                  checked={config.preferences.showAnnouncements}
                  onChange={(e) =>
                    handlePreferenceChange(
                      "showAnnouncements",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <RotateCcw size={14} />
                {t("notification.resetSettings")}
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>
                {t("notification.lastViewedTime")}{" "}
                {config.lastViewedTime
                  ? new Date(config.lastViewedTime).toLocaleString()
                  : t("notification.neverViewed")}
              </p>
              <p>
                {t("notification.dismissedCount", {
                  count: config.dismissedNotifications.length,
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
