import NotificationSettings from "./NotificationSettings";
import Tooltip from "@/components/Tooltip";
import { notificationsList } from "@/data/notifications";
import {
  type NotificationItem,
  hasNewUpdatesAtom,
  isUpdateNotificationOpenAtom,
  markUpdatesAsViewedAtom,
} from "@/store/updateNotification";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Bell, X } from "lucide-react";
import { useState } from "react";

function ProductNewsItem({
  title,
  tag,
  desc,
  images = [],
  btn,
}: Omit<NotificationItem, "date" | "id" | "type" | "priority">) {
  const [current, setCurrent] = useState(0);
  const hasMultiple = images && images.length > 1;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-lg">{title}</span>
        {tag && (
          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">
            {tag}
          </span>
        )}
        {btn && (
          <button
            type="button"
            className="ml-2 px-2 py-0.5 text-xs bg-blue-500 text-white rounded"
          >
            {btn}
          </button>
        )}
      </div>
      <div className="text-gray-600 dark:text-gray-300 mb-4">{desc}</div>
      {images && images.length > 0 && (
        <div className="relative w-full mx-auto">
          {hasMultiple && (
            <button
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-blue-500 hover:bg-blue-600 rounded-full p-1 shadow"
              onClick={prev}
              aria-label="上一张"
            >
              &lt;
            </button>
          )}
          <img
            src={images[current]}
            alt=""
            className="rounded-lg w-full h-auto max-h-[400px] object-contain bg-gray-50 dark:bg-gray-800"
            style={{ minHeight: "200px" }}
          />
          {hasMultiple && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-blue-500 hover:bg-blue-600 rounded-full p-1 shadow"
              onClick={next}
              aria-label="下一张"
            >
              &gt;
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function UpdateNotification() {
  const [isOpen, setIsOpen] = useAtom(isUpdateNotificationOpenAtom);
  const hasNewUpdates = useAtomValue(hasNewUpdatesAtom);
  const markAsViewed = useSetAtom(markUpdatesAsViewedAtom);
  // 暂时直接使用静态数据，避免循环依赖问题
  const notifications = notificationsList;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // 关闭弹窗时标记为已查看
    markAsViewed();
  };

  return (
    <>
      <Tooltip content="动态更新">
        <div className="">
          <button
            type="button"
            onClick={handleOpen}
            className="relative  hover:bg-blue-500 hover:text-white text-black p-3 rounded-full  transition-all duration-200 hover:scale-105"
            aria-label="查看更新通知"
          >
            <Bell size={18} />
            {/* 小红点 */}
            {hasNewUpdates && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            )}
          </button>
        </div>
      </Tooltip>
      {/* 更新内容弹窗 */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          />

          {/* 弹窗内容 */}
          <div
            className="relative w-full bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl overflow-hidden"
            style={{
              maxWidth: "1200px",
              maxHeight: "95vh",
              height: "90vh",
              minHeight: "600px",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                产品更新
              </h3>
              <div className="flex items-center gap-2">
                <NotificationSettings />
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={handleClose}
                  aria-label="关闭弹窗"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div
              className="overflow-y-auto"
              style={{
                maxHeight: "calc(90vh - 120px)",
                minHeight: "500px",
              }}
            >
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  暂无通知内容
                </div>
              ) : (
                notifications.map((item, idx) => (
                  <div key={item.id || idx} className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {item.date}
                      </span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    </div>
                    <ProductNewsItem {...item} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
