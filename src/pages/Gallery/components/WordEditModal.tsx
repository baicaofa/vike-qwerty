import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import { updateWord, addWords } from "@/services/customDictionaryService";
import type { ICustomWord } from "@/utils/db/customDictionary";
import { createCustomWord } from "@/utils/db/customDictionary";
import { useState, useEffect } from "react";
import IconCheck from "~icons/tabler/check";
import IconX from "~icons/tabler/x";

interface WordEditModalProps {
  word: (ICustomWord & { id?: string }) | null; // 支持带有 id 字段的 Word 类型
  dictId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface WordFormData {
  name?: string; // 添加单词名称字段，用于添加模式
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

export function WordEditModal({
  word,
  dictId,
  isOpen,
  onClose,
  onSuccess,
}: WordEditModalProps) {
  const { success, error: showError } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<WordFormData>({
    name: "",
    usphone: "",
    ukphone: "",
    sentences: [],
    detailed_translations: [],
  });

  // 判断是否为添加模式
  const isAddMode = !word;

  // 初始化表单数据
  useEffect(() => {
    if (isOpen) {
      if (word && word.userData) {
        // 编辑模式：使用现有数据
        setFormData({
          name: word.name,
          ...word.userData,
        });
      } else if (word) {
        // 编辑模式：但没有用户数据，初始化为空
        setFormData({
          name: word.name,
          usphone: "",
          ukphone: "",
          sentences: [],
          detailed_translations: [],
        });
      } else {
        // 添加模式：重置表单
        setFormData({
          name: "",
          usphone: "",
          ukphone: "",
          sentences: [],
          detailed_translations: [],
        });
      }
    }
  }, [word, isOpen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isAddMode) {
        // 添加模式
        if (!formData.name?.trim()) {
          showError("请输入单词名称");
          return;
        }

        const newWord = createCustomWord({
          dictId,
          name: formData.name.trim(),
          sourceType: "user_custom",
          userData: {
            usphone: formData.usphone,
            ukphone: formData.ukphone,
            sentences: formData.sentences,
            detailed_translations: formData.detailed_translations,
          },
          isUserModified: true,
          isEmpty: false,
        });

        const result = await addWords(dictId, [newWord]);
        if (result.success) {
          success("单词添加成功");
          onSuccess();
          onClose();
        } else {
          showError(result.error || "添加失败");
        }
      } else {
        // 编辑模式
        if (!word) return;

        // 确保有有效的 id 字段
        const wordId = word.id || (word as any)._id || (word as any).uuid;
        if (!wordId) {
          showError("单词ID缺失，无法更新");
          return;
        }

        const result = await updateWord(dictId, wordId, {
          userData: {
            usphone: formData.usphone,
            ukphone: formData.ukphone,
            sentences: formData.sentences,
            detailed_translations: formData.detailed_translations,
          },
          isUserModified: true,
          isEmpty: false,
        });

        if (result.success) {
          success("单词更新成功");
          onSuccess();
          onClose();
        } else {
          showError(result.error || "更新失败");
        }
      }
    } catch (error) {
      showError(isAddMode ? "添加单词失败" : "更新单词失败");
    } finally {
      setSaving(false);
    }
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

  if (!word) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isAddMode ? "添加单词" : `编辑单词：${word.name}`}
          </DialogTitle>
          {!isAddMode && (
            <div className="flex gap-2 mt-2">
              {word.sourceType === "official" && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs dark:bg-blue-900/30 dark:text-blue-300">
                  官方数据
                </span>
              )}
              {word.sourceType === "empty" && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs dark:bg-yellow-900/30 dark:text-yellow-300">
                  填写
                </span>
              )}
              {word.isUserModified && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs dark:bg-green-900/30 dark:text-green-300">
                  已修改
                </span>
              )}
            </div>
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 单词名称编辑（仅添加模式） */}
          {isAddMode && (
            <div>
              <h4 className="text-lg font-medium mb-3">单词</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  单词名称
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="请输入单词"
                  required
                />
              </div>
            </div>
          )}

          {/* 音标编辑 */}
          <div>
            <h4 className="text-lg font-medium mb-3">音标</h4>
            <div className="grid grid-cols-2 gap-4">
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
                  placeholder="请输入美式音标"
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
                  placeholder="请输入英式音标"
                />
              </div>
            </div>
          </div>

          {/* 例句编辑 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium">例句</h4>
              <Button onClick={addSentence} variant="outline" size="sm">
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
                      <option value="n">名词</option>
                      <option value="v">动词</option>
                      <option value="adj">形容词</option>
                      <option value="adv">副词</option>
                      <option value="prep">介词</option>
                      <option value="conj">连词</option>
                      <option value="pron">代词</option>
                      <option value="int">感叹词</option>
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
                      placeholder="英文释义"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button onClick={onClose} variant="outline" disabled={saving}>
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            ) : (
              <IconCheck className="h-4 w-4" />
            )}
            <span>{saving ? "保存中..." : "保存"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
