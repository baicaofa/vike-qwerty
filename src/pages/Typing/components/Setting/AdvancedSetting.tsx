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

export default function AdvancedSetting() {
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
              {t("advancedSettings.skipFamiliarWord.label")}
            </span>
            <span className={styles.sectionDescription}>
              {t("advancedSettings.skipFamiliarWord.description")}
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
                {t("advancedSettings.skipFamiliarWord.status", {
                  status: isSkipFamiliarWord
                    ? t("advancedSettings.skipFamiliarWord.enabled")
                    : t("advancedSettings.skipFamiliarWord.disabled"),
                })}
              </span>
            </div>
            <Link
              className="my-btn-primary ml-4 disabled:bg-gray-300"
              href="/familiar"
              target="_blank"
              title={t("advancedSettings.viewFamiliarWords")}
            >
              {t("advancedSettings.viewFamiliarWords")}
            </Link>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              {t("advancedSettings.randomOrder.label")}
            </span>
            <span className={styles.sectionDescription}>
              {t("advancedSettings.randomOrder.description")}
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
                {t("advancedSettings.randomOrder.status", {
                  status: randomConfig.isOpen
                    ? t("advancedSettings.randomOrder.enabled")
                    : t("advancedSettings.randomOrder.disabled"),
                })}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              {t("advancedSettings.showPrevNext.label")}
            </span>
            <span className={styles.sectionDescription}>
              {t("advancedSettings.showPrevNext.description")}
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
                {t("advancedSettings.showPrevNext.status", {
                  status: isShowPrevAndNextWord
                    ? t("advancedSettings.showPrevNext.enabled")
                    : t("advancedSettings.showPrevNext.disabled"),
                })}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              {t("advancedSettings.ignoreCase.label")}
            </span>
            <span className={styles.sectionDescription}>
              {t("advancedSettings.ignoreCase.description")}
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
                {t("advancedSettings.ignoreCase.status", {
                  status: isIgnoreCase
                    ? t("advancedSettings.ignoreCase.enabled")
                    : t("advancedSettings.ignoreCase.disabled"),
                })}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              {t("advancedSettings.textSelectable.label")}
            </span>
            <span className={styles.sectionDescription}>
              {t("advancedSettings.textSelectable.description")}
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
                {t("advancedSettings.textSelectable.status", {
                  status: isTextSelectable
                    ? t("advancedSettings.textSelectable.enabled")
                    : t("advancedSettings.textSelectable.disabled"),
                })}
              </span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              {t("advancedSettings.showHint.label")}
            </span>
            <span className={styles.sectionDescription}>
              {t("advancedSettings.showHint.description")}
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
                {t("advancedSettings.showHint.status", {
                  status: isShowAnswerOnHover
                    ? t("advancedSettings.showHint.enabled")
                    : t("advancedSettings.showHint.disabled"),
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
