import styles from "./index.module.css";
import { Link } from "@/components/Link";
import {
  isIgnoreCaseAtom,
  isShowAnswerOnHoverAtom,
  isShowPrevAndNextWordAtom,
  isSkipFamiliarWordAtom,
  isTextSelectableAtom,
  randomConfigAtom,
} from "@/store";
import { Switch } from "@headlessui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

interface AdvancedSettingProps {
  pageContext?: any;
}

export default function AdvancedSetting({
  pageContext,
}: AdvancedSettingProps = {}) {
  const { t } = useTranslation("typing");
  const [randomConfig, setRandomConfig] = useAtom(randomConfigAtom);
  const [isShowPrevAndNextWord, setIsShowPrevAndNextWord] = useAtom(
    isShowPrevAndNextWordAtom
  );
  const [isIgnoreCase, setIsIgnoreCase] = useAtom(isIgnoreCaseAtom);
  const [isTextSelectable, setIsTextSelectable] = useAtom(isTextSelectableAtom);
  const [isShowAnswerOnHover, setIsShowAnswerOnHover] = useAtom(
    isShowAnswerOnHoverAtom
  );
  const [isSkipFamiliarWord, setIsSkipFamiliarWord] = useAtom(
    isSkipFamiliarWordAtom
  );

  const onToggleRandom = useCallback(
    (checked: boolean) => {
      setRandomConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }));
    },
    [setRandomConfig]
  );

  const onToggleLastAndNextWord = useCallback(
    (checked: boolean) => {
      setIsShowPrevAndNextWord(checked);
    },
    [setIsShowPrevAndNextWord]
  );

  const onToggleIgnoreCase = useCallback(
    (checked: boolean) => {
      setIsIgnoreCase(checked);
    },
    [setIsIgnoreCase]
  );

  const onToggleTextSelectable = useCallback(
    (checked: boolean) => {
      setIsTextSelectable(checked);
    },
    [setIsTextSelectable]
  );
  const onToggleShowAnswerOnHover = useCallback(
    (checked: boolean) => {
      setIsShowAnswerOnHover(checked);
    },
    [setIsShowAnswerOnHover]
  );

  const onToggleSkipFamiliarWord = useCallback(
    (checked: boolean) => {
      setIsSkipFamiliarWord(checked);
    },
    [setIsSkipFamiliarWord]
  );

  return (
    <ScrollArea.Root className="flex-1 select-none overflow-y-auto ">
      <ScrollArea.Viewport className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              {t("advancedSettings.skipFamiliarWord.label", "跳过熟悉单词")}
            </span>
            <span className={styles.sectionDescription}>
              {t(
                "advancedSettings.skipFamiliarWord.description",
                "跳过熟悉单词"
              )}
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isSkipFamiliarWord}
                onChange={onToggleSkipFamiliarWord}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">
                {t("advancedSettings.skipFamiliarWord.status", "跳过熟悉单词", {
                  status: isSkipFamiliarWord
                    ? t("advancedSettings.skipFamiliarWord.enabled", "已启用")
                    : t("advancedSettings.skipFamiliarWord.disabled", "已禁用"),
                })}
              </span>
            </div>
            <Link
              className="my-btn-primary ml-4 disabled:bg-gray-300"
              href="/familiar"
              target="_blank"
              title={t("advancedSettings.viewFamiliarWords", "查看熟悉单词")}
              pageContext={pageContext}
            >
              {t("advancedSettings.viewFamiliarWords", "查看熟悉单词")}
            </Link>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              {t("advancedSettings.randomOrder.label", "随机顺序")}
            </span>
            <span className={styles.sectionDescription}>
              {t("advancedSettings.randomOrder.description", "随机顺序")}
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={randomConfig.isOpen}
                onChange={onToggleRandom}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">
                {t("advancedSettings.randomOrder.status", "随机顺序", {
                  status: randomConfig.isOpen
                    ? t("advancedSettings.randomOrder.enabled", "已启用")
                    : t("advancedSettings.randomOrder.disabled", "已禁用"),
                })}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              {t(
                "advancedSettings.showPrevNext.label",
                "显示前一个和后一个单词"
              )}
            </span>
            <span className={styles.sectionDescription}>
              {t(
                "advancedSettings.showPrevNext.description",
                "显示前一个和后一个单词"
              )}
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isShowPrevAndNextWord}
                onChange={onToggleLastAndNextWord}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">
                {t(
                  "advancedSettings.showPrevNext.status",
                  "显示前一个和后一个单词",
                  {
                    status: isShowPrevAndNextWord
                      ? t("advancedSettings.showPrevNext.enabled", "已启用")
                      : t("advancedSettings.showPrevNext.disabled", "已禁用"),
                  }
                )}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              {t("advancedSettings.ignoreCase.label", "忽略大小写")}
            </span>
            <span className={styles.sectionDescription}>
              {t("advancedSettings.ignoreCase.description", "忽略大小写")}
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isIgnoreCase}
                onChange={onToggleIgnoreCase}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">
                {t("advancedSettings.ignoreCase.status", "忽略大小写", {
                  status: isIgnoreCase
                    ? t("advancedSettings.ignoreCase.enabled", "已启用")
                    : t("advancedSettings.ignoreCase.disabled", "已禁用"),
                })}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              {t("advancedSettings.textSelectable.label", "文本可选择")}
            </span>
            <span className={styles.sectionDescription}>
              {t("advancedSettings.textSelectable.description", "文本可选择")}
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isTextSelectable}
                onChange={onToggleTextSelectable}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">
                {t("advancedSettings.textSelectable.status", "文本可选择", {
                  status: isTextSelectable
                    ? t("advancedSettings.textSelectable.enabled", "已启用")
                    : t("advancedSettings.textSelectable.disabled", "已禁用"),
                })}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              {t("advancedSettings.showHint.label", "显示提示")}
            </span>
            <span className={styles.sectionDescription}>
              {t("advancedSettings.showHint.description", "显示提示")}
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isShowAnswerOnHover}
                onChange={onToggleShowAnswerOnHover}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">
                {t("advancedSettings.showHint.status", "显示提示", {
                  status: isShowAnswerOnHover
                    ? t("advancedSettings.showHint.enabled", "已启用")
                    : t("advancedSettings.showHint.disabled", "已禁用"),
                })}
              </span>
            </div>
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
