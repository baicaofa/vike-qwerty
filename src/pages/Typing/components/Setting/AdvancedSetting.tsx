import styles from "./index.module.css";
import {
  detailedTranslationsConfigAtom,
  isIgnoreCaseAtom,
  isShowAnswerOnHoverAtom,
  isShowPrevAndNextWordAtom,
  isSkipFamiliarWordAtom,
  isTextSelectableAtom,
  randomConfigAtom,
  sentencesConfigAtom,
  useDetailedTransInBasicAtom,
} from "@/store";
import { Switch } from "@headlessui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useAtom } from "jotai";
import { useCallback } from "react";

export default function AdvancedSetting() {
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
  const [sentencesConfig, setSentencesConfig] = useAtom(sentencesConfigAtom);
  const [detailedTranslationsConfig, setDetailedTranslationsConfig] = useAtom(
    detailedTranslationsConfigAtom
  );
  const [useDetailedTransInBasic, setUseDetailedTransInBasic] = useAtom(
    useDetailedTransInBasicAtom
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

  const onToggleSentences = useCallback(
    (checked: boolean) => {
      setSentencesConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }));
    },
    [setSentencesConfig]
  );

  const onToggleDetailedTranslations = useCallback(
    (checked: boolean) => {
      setDetailedTranslationsConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }));
    },
    [setDetailedTranslationsConfig]
  );

  const onToggleUseDetailedTransInBasic = useCallback(
    (checked: boolean) => {
      setUseDetailedTransInBasic(checked);
    },
    [setUseDetailedTransInBasic]
  );

  return (
    <ScrollArea.Root className="flex-1 select-none overflow-y-auto ">
      <ScrollArea.Viewport className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>是否跳过熟词</span>
            <span className={styles.sectionDescription}>
              开启后，练习时会自动跳过已被标记为熟词的单词
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isSkipFamiliarWord}
                onChange={onToggleSkipFamiliarWord}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`跳过熟词已${
                isSkipFamiliarWord ? "开启" : "关闭"
              }`}</span>
            </div>
            <a
              className="my-btn-primary ml-4 disabled:bg-gray-300"
              href="/familiar"
              target="_blank"
              title="查看熟词"
            >
              查看熟词
            </a>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>是否显示例句</span>
            <span className={styles.sectionDescription}>
              开启后，如果词典中包含例句，会在单词下方显示例句
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={sentencesConfig.isOpen}
                onChange={onToggleSentences}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`例句显示已${
                sentencesConfig.isOpen ? "开启" : "关闭"
              }`}</span>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>是否显示详细翻译</span>
            <span className={styles.sectionDescription}>
              开启后，如果词典中包含详细翻译信息，会显示词性和多个释义
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={detailedTranslationsConfig.isOpen}
                onChange={onToggleDetailedTranslations}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`详细翻译已${
                detailedTranslationsConfig.isOpen ? "开启" : "关闭"
              }`}</span>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              在基本翻译中使用详细翻译
            </span>
            <span className={styles.sectionDescription}>
              开启后，如果词典中包含详细翻译，会在基本翻译中显示详细翻译的内容
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={useDetailedTransInBasic}
                onChange={onToggleUseDetailedTransInBasic}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`优先使用详细翻译已${
                useDetailedTransInBasic ? "开启" : "关闭"
              }`}</span>
            </div>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>章节乱序</span>
            <span className={styles.sectionDescription}>
              开启后，每次练习章节中单词会随机排序。下一章节生效
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={randomConfig.isOpen}
                onChange={onToggleRandom}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`随机已${
                randomConfig.isOpen ? "开启" : "关闭"
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              练习时展示上一个/下一个单词
            </span>
            <span className={styles.sectionDescription}>
              开启后，练习中会在上方展示上一个/下一个单词
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isShowPrevAndNextWord}
                onChange={onToggleLastAndNextWord}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`展示单词已${
                isShowPrevAndNextWord ? "开启" : "关闭"
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>是否忽略大小写</span>
            <span className={styles.sectionDescription}>
              开启后，输入时不区分大小写，如输入&quot;hello&quot;和&quot;Hello&quot;都会被认为是正确的
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isIgnoreCase}
                onChange={onToggleIgnoreCase}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`忽略大小写已${
                isIgnoreCase ? "开启" : "关闭"
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>是否允许选择文本</span>
            <span className={styles.sectionDescription}>
              开启后，可以通过鼠标选择文本{" "}
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isTextSelectable}
                onChange={onToggleTextSelectable}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`选择文本已${
                isTextSelectable ? "开启" : "关闭"
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>
              是否允许默写模式下显示提示
            </span>
            <span className={styles.sectionDescription}>
              开启后，可以通过鼠标 hover 单词显示正确答案{" "}
            </span>
            <div className={styles.switchBlock}>
              <Switch
                checked={isShowAnswerOnHover}
                onChange={onToggleShowAnswerOnHover}
                className="switch-root"
              >
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`显示提示已${
                isShowAnswerOnHover ? "开启" : "关闭"
              }`}</span>
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
