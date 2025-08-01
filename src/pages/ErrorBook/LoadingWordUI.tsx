import { LoadingUI } from "@/components/Loading";
import type { FC } from "react";
import ErrorIcon from "~icons/ic/outline-error";
import { useTranslation } from "react-i18next";

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
        <div className="tooltip !bg-transparent" data-tip={t("errorBook.loadFailed")}>
          <ErrorIcon className="text-red-500" />
        </div>
      ) : (
        isLoading && <LoadingUI />
      )}
    </div>
  );
};
