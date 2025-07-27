import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import React from "react";
import IconAlertTriangle from "~icons/tabler/alert-triangle";
import IconX from "~icons/tabler/x";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "确认",
  cancelText = "取消",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none dark:bg-gray-800">
          <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </Dialog.Title>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              aria-label="关闭"
            >
              <IconX />
            </button>
          </Dialog.Close>

          <div className="mt-4 flex items-start space-x-3">
            <IconAlertTriangle className="h-6 w-6 flex-shrink-0 text-yellow-500" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {message}
            </p>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button onClick={onClose} variant="outline" disabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant="destructive"
              disabled={isLoading}
            >
              {isLoading ? "处理中..." : confirmText}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
