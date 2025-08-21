import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ICustomWord } from "@/utils/db/customDictionary";
import { useEffect, useState } from "react";
import IconCheck from "~icons/tabler/check";
import IconPlus from "~icons/tabler/plus";
import IconX from "~icons/tabler/x";

interface UploadWordEditModalProps {
  word: ICustomWord | null;
  wordIndex: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (index: number, updatedWord: Partial<ICustomWord>) => void;
}

interface WordFormData {
  name: string;
  usphone: string;
  ukphone: string;
  sentences: Array<{
    english: string;
    chinese: string;
  }>;
  detailed_translations: Array<{
    pos: string;
    chinese: string;
    english: string;
  }>;
}

export function UploadWordEditModal({
  word,
  wordIndex,
  isOpen,
  onClose,
  onSave,
}: UploadWordEditModalProps) {
  const [formData, setFormData] = useState<WordFormData>({
    name: "",
    usphone: "",
    ukphone: "",
    sentences: [],
    detailed_translations: [],
  });

  // 初始化表单数据
  useEffect(() => {
    if (isOpen && word) {
      setFormData({
        name: word.name,
        usphone: word.userData?.usphone || "",
        ukphone: word.userData?.ukphone || "",
        sentences: word.userData?.sentences || [],
        detailed_translations: word.userData?.detailed_translations || [],
      });
    }
  }, [word, isOpen]);

  const handleSave = () => {
    if (wordIndex === null) return;

    const updatedWord: Partial<ICustomWord> = {
      name: formData.name,
      userData: {
        usphone: formData.usphone,
        ukphone: formData.ukphone,
        sentences: formData.sentences,
        detailed_translations: formData.detailed_translations,
      },
      sourceType: "user_custom",
      isUserModified: true,
      isEmpty: false,
    };

    onSave(wordIndex, updatedWord);
    onClose();
  };

  const addSentence = () => {
    setFormData((prev) => ({
      ...prev,
      sentences: [...prev.sentences, { english: "", chinese: "" }],
    }));
  };

  const removeSentence = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sentences: prev.sentences.filter((_, i) => i !== index),
    }));
  };

  const updateSentence = (
    index: number,
    field: "english" | "chinese",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      sentences: prev.sentences.map((sentence, i) =>
        i === index ? { ...sentence, [field]: value } : sentence
      ),
    }));
  };

  const addTranslation = () => {
    setFormData((prev) => ({
      ...prev,
      detailed_translations: [
        ...prev.detailed_translations,
        { pos: "n", chinese: "", english: "" },
      ],
    }));
  };

  const removeTranslation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detailed_translations: prev.detailed_translations.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateTranslation = (
    index: number,
    field: "pos" | "chinese" | "english",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      detailed_translations: prev.detailed_translations.map((translation, i) =>
        i === index ? { ...translation, [field]: value } : translation
      ),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑单词：{word?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 单词名称编辑 */}
          <div>
            <h4 className="text-lg font-medium mb-3">单词</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                单词名称
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="请输入单词"
                required
              />
            </div>
          </div>

          {/* 音标编辑 */}
          <div>
            <h4 className="text-lg font-medium mb-3">音标</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  美式音标
                </label>
                <input
                  type="text"
                  value={formData.usphone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      usphone: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="美式音标"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  英式音标
                </label>
                <input
                  type="text"
                  value={formData.ukphone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      ukphone: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="英式音标"
                />
              </div>
            </div>
          </div>

          {/* 例句编辑 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium">例句</h4>
              <Button onClick={addSentence} variant="outline" size="sm">
                <IconPlus className="h-4 w-4 mr-1" />
                添加例句
              </Button>
            </div>
            <div className="space-y-3">
              {formData.sentences.map((sentence, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 dark:border-gray-600"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      例句 {index + 1}
                    </span>
                    <Button
                      onClick={() => removeSentence(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <IconX className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={sentence.english}
                      onChange={(e) =>
                        updateSentence(index, "english", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="英文例句"
                    />
                    <input
                      type="text"
                      value={sentence.chinese}
                      onChange={(e) =>
                        updateSentence(index, "chinese", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="中文翻译"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 详细翻译编辑 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium">详细翻译</h4>
              <Button onClick={addTranslation} variant="outline" size="sm">
                <IconPlus className="h-4 w-4 mr-1" />
                添加翻译
              </Button>
            </div>
            <div className="space-y-3">
              {formData.detailed_translations.map((translation, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 dark:border-gray-600"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      翻译 {index + 1}
                    </span>
                    <Button
                      onClick={() => removeTranslation(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <IconX className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      aria-label="词性选择"
                      value={translation.pos}
                      onChange={(e) =>
                        updateTranslation(index, "pos", e.target.value)
                      }
                      className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="n">名词 (n.)</option>
                      <option value="v">动词 (v.)</option>
                      <option value="adj">形容词 (adj.)</option>
                      <option value="adv">副词 (adv.)</option>
                      <option value="prep">介词 (prep.)</option>
                      <option value="conj">连词 (conj.)</option>
                      <option value="pron">代词 (pron.)</option>
                      <option value="int">感叹词 (int.)</option>
                      <option value="art">冠词 (art.)</option>
                      <option value="num">数词 (num.)</option>
                      <option value="abbr">缩写 (abbr.)</option>
                      <option value="other">其他</option>
                    </select>
                    <input
                      type="text"
                      value={translation.chinese}
                      onChange={(e) =>
                        updateTranslation(index, "chinese", e.target.value)
                      }
                      className="rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="中文释义"
                    />
                    <input
                      type="text"
                      value={translation.english}
                      onChange={(e) =>
                        updateTranslation(index, "english", e.target.value)
                      }
                      className="rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      placeholder="英文释义（可选）"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            取消
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-1">
            <IconCheck className="h-4 w-4" />
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
