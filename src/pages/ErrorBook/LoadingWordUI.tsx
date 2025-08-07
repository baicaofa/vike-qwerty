import { LoadingUI } from "@/components/Loading";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import ErrorIcon from "~icons/ic/outline-error";

type LoadingWordUIProps = {
  className?: string;
  isLoading: boolean;
  hasError: boolean;
};

export const LoadingWordUI: FC<LoadingWordUIProps> = ({
  className,
  isLoading,
  hasError,
}) => {
  const { t } = useTranslation("errors");
  return (
    <div className={`${className}`}>
      {hasError ? (
        <div
          className="tooltip !bg-transparent"
          data-tip={t("errorBook.loadFailed", "数据加载失败")}
        >
          <ErrorIcon className="text-red-500" />
        </div>
      ) : (
        isLoading && <LoadingUI />
      )}
    </div>
  );
};
