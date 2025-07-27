import styles from "./index.module.css";
import type { ExportProgress, ImportProgress } from "@/utils/db/data-export";
import { exportDatabase, importDatabase } from "@/utils/db/data-export";
import * as Progress from "@radix-ui/react-progress";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

export default function DataSetting() {
  const { t } = useTranslation("typing");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const exportProgressCallback = useCallback(
    ({ totalRows, completedRows, done }: ExportProgress) => {
      if (done) {
        setIsExporting(false);
        setExportProgress(100);
        return true;
      }
      if (totalRows) {
        setExportProgress(Math.floor((completedRows / totalRows) * 100));
      }

      return true;
    },
    []
  );

  const onClickExport = useCallback(() => {
    setExportProgress(0);
    setIsExporting(true);
    exportDatabase(exportProgressCallback);
  }, [exportProgressCallback]);

  const importProgressCallback = useCallback(
    ({ totalRows, completedRows, done }: ImportProgress) => {
      if (done) {
        setIsImporting(false);
        setImportProgress(100);
        return true;
      }
      if (totalRows) {
        setImportProgress(Math.floor((completedRows / totalRows) * 100));
      }

      return true;
    },
    []
  );

  const onStartImport = useCallback(() => {
    setImportProgress(0);
    setIsImporting(true);
  }, []);

  const onClickImport = useCallback(() => {
    importDatabase(onStartImport, importProgressCallback);
  }, [importProgressCallback, onStartImport]);

  return (
    <ScrollArea.Root className="flex-1 select-none overflow-y-auto ">
      <ScrollArea.Viewport className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>{t("dataExport.label")}</span>
            <span className={styles.sectionDescription}>
              {t("dataExport.description1")}
              <strong>{t("dataExport.localOnly")}</strong>
              {t("dataExport.description2")}
            </span>
            <span className="pl-4 text-left text-sm font-bold leading-tight text-red-500">
              {t("dataExport.safetyTip")}
            </span>
            <div className="flex h-3 w-full items-center justify-start px-5">
              <Progress.Root
                className="translate-z-0 relative h-2 w-11/12 transform  overflow-hidden rounded-full bg-gray-200"
                value={exportProgress}
              >
                <Progress.Indicator
                  className="cubic-bezier(0.65, 0, 0.35, 1) h-full w-full bg-blue-400 transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${100 - exportProgress}%)` }}
                />
              </Progress.Root>
              <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${exportProgress}%`}</span>
            </div>

            <button
              className="my-btn-primary ml-4 disabled:bg-gray-300"
              type="button"
              onClick={onClickExport}
              disabled={isExporting}
              title={t("dataExport.buttonTitle")}
            >
              {t("dataExport.button")}
            </button>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>{t("dataImport.label")}</span>
            <span className={styles.sectionDescription}>
              {t("dataImport.description1")}
              <strong className="text-sm font-bold text-red-500">
                {t("dataImport.coverTip")}
              </strong>
              {t("dataImport.description2")}
            </span>

            <div className="flex h-3 w-full items-center justify-start px-5">
              <Progress.Root
                className="translate-z-0 relative h-2 w-11/12 transform  overflow-hidden rounded-full bg-gray-200"
                value={importProgress}
              >
                <Progress.Indicator
                  className="cubic-bezier(0.65, 0, 0.35, 1) h-full w-full bg-blue-400 transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${100 - importProgress}%)` }}
                />
              </Progress.Root>
              <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${importProgress}%`}</span>
            </div>

            <button
              className="my-btn-primary ml-4 disabled:bg-gray-300"
              type="button"
              onClick={onClickImport}
              disabled={isImporting}
              title={t("dataImport.buttonTitle")}
            >
              {t("dataImport.button")}
            </button>
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex touch-none select-none bg-transparent "
        orientation="vertical"
      ></ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
