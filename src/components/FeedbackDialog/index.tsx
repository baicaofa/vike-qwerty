import { FeedbackForm } from "../FeedbackForm";
import * as Dialog from "@radix-ui/react-dialog";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import IconMessageCircle from "~icons/tabler/message-circle";

interface FeedbackDialogProps {
  buttonClassName?: string;
  buttonText?: string;
  showIcon?: boolean;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  buttonClassName = "",
  showIcon = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("common");
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className={`flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-700 ${buttonClassName}`}
        >
          {showIcon && <IconMessageCircle className="mr-1.5 h-4 w-4" />}
          {t("feedback")}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-0 shadow-xl animate-in fade-in-0 zoom-in-95 dark:bg-gray-800">
          <FeedbackForm onClose={() => setIsOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
