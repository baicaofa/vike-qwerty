import { Button } from "@/components/ui/button";
import { useCustomDictionaryAPI } from "@/hooks/useCustomDictionary";
import { useToast } from "@/hooks/useToast";
import type { ICustomDictionary } from "@/utils/db/customDictionary";
import React, { useState, useEffect } from "react";

interface DictionaryEditFormProps {
  dictionary: ICustomDictionary;
  onSaved?: () => void;
}

export function DictionaryEditForm({
  dictionary,
  onSaved,
}: DictionaryEditFormProps) {
  const { updateDictionary } = useCustomDictionaryAPI();
  const { success, error: showError } = useToast();

  const [formData, setFormData] = useState<Partial<ICustomDictionary>>({
    name: "",
    description: "",
    category: "",
    tags: [],
    language: "en",
    languageCategory: "en",
    isPublic: false,
  });

  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 初始化表单数据
  useEffect(() => {
    if (dictionary) {
      setFormData({
        name: dictionary.name || "",
        description: dictionary.description || "",
        category: dictionary.category || "",
        tags: dictionary.tags || [],
        language: dictionary.language || "en",
        languageCategory: dictionary.languageCategory || "en",
        isPublic: dictionary.isPublic || false,
      });
      setTagsInput(dictionary.tags?.join(", ") || "");
    }
  }, [dictionary]);

  // 处理输入变化
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 处理复选框变化
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // 处理标签输入
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    const tagsArray = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  // 处理保存
  const handleSave = async () => {
    // 验证表单
    if (!formData.name?.trim()) {
      setError("词典名称不能为空");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await updateDictionary(dictionary.id, {
        ...formData,
        updatedAt: Date.now(),
      });

      if (result.success) {
        success("词典信息更新成功");
        if (onSaved) onSaved();
      } else {
        setError(result.error || "更新失败");
        showError(result.error || "更新失败");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "更新失败";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">编辑词典信息</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            词典名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            词典描述
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            分类
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            标签（用逗号分隔）
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={tagsInput}
            onChange={handleTagsChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="例如: 英语, 四级, 核心词汇"
          />
        </div>

        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            语言
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="en">英语</option>
            <option value="fr">法语</option>
            <option value="de">德语</option>
            <option value="es">西班牙语</option>
            <option value="ja">日语</option>
            <option value="ko">韩语</option>
            <option value="zh">中文</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="isPublic"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            公开词典（允许其他用户查看）
          </label>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "保存中..." : "保存词典信息"}
          </Button>
        </div>
      </div>
    </div>
  );
}
