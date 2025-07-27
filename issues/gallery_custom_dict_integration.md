# Gallery页面集成自定义词典功能方案

## 背景

目前，自定义词典功能已集成在Gallery页面中，通过LanguageTabSwitcher中的"我的词典"选项卡实现。用户可以在Gallery页面直接上传、查看和管理自己的自定义词典。

## 已实现的功能

### 1. 扩展类型定义

在`src/typings/index.ts`中扩展`LanguageCategoryType`类型，添加"my-dict"选项：

```typescript
export type LanguageCategoryType = "en" | "ja" | "de" | "code" | "kk" | "id" | "my-dict";
```

### 2. LanguageTabSwitcher组件

在`src/pages/gallery/LanguageTabSwitcher.tsx`中已添加"我的词典"选项：

```typescript
// 使用code图标作为我的词典图标
import myDictFlag from "@/assets/flags/code.png";

const options: LanguageTabOption[] = [
  { id: "en", name: "英语", flag: enFlag },
  { id: "ja", name: "日语", flag: jpFlag },
  { id: "de", name: "德语", flag: deFlag },
  { id: "kk", name: "哈萨克语", flag: kkFlag },
  { id: "id", name: "印尼语", flag: idFlag },
  { id: "code", name: "Code", flag: codeFlag },
  { id: "my-dict", name: "我的词典", flag: myDictFlag },
];
```

### 3. Gallery页面组件

在`src/pages/gallery/+Page.tsx`中已实现词典过滤逻辑，处理"my-dict"标签的特殊情况：

```typescript
const { groupedByCategoryAndTag } = useMemo(() => {
  // 特殊处理"my-dict"标签
  if (galleryState.currentLanguageTab === "my-dict") {
    // 将自定义词典转换为应用内Dictionary格式
    const adaptedDicts = adaptCustomDictionariesToDictionaries(customDicts);
    // 按照category和tag分组
    const groupedByCategory = Object.entries(
      groupBy(adaptedDicts, (dict) => dict.category)
    );
    const groupedByCategoryAndTag = groupedByCategory.map(
      ([category, dicts]) =>
        [category, groupByDictTags(dicts)] as [
          string,
          Record<string, Dictionary[]>
        ]
    );
    return { groupedByCategoryAndTag };
  }

  // 原有的语言标签逻辑
  const currentLanguageCategoryDicts = dictionaries.filter(
    (dict) => dict.languageCategory === galleryState.currentLanguageTab
  );
  const groupedByCategory = Object.entries(
    groupBy(currentLanguageCategoryDicts, (dict) => dict.category)
  );
  const groupedByCategoryAndTag = groupedByCategory.map(
    ([category, dicts]) =>
      [category, groupByDictTags(dicts)] as [
        string,
        Record<string, Dictionary[]>
      ]
  );

  return { groupedByCategoryAndTag };
}, [galleryState.currentLanguageTab, customDicts]);
```

### 4. 自定义词典组件

已创建专用的自定义词典列表组件`CustomDictionaryList.tsx`和上传弹窗组件`UploadDictionaryModal.tsx`：

```tsx
// 在Gallery页面中条件渲染
{galleryState.currentLanguageTab === "my-dict" ? (
  <CustomDictionaryList onOpenUploadModal={handleOpenUploadModal} />
) : (
  // 原有的词典展示逻辑
)}

// 添加上传弹窗组件
<UploadDictionaryModal 
  isOpen={galleryState.isUploadModalOpen}
  onClose={handleCloseUploadModal}
  onSuccess={() => {}}
/>
```

`CustomDictionaryList.tsx`组件负责从API获取和展示自定义词典列表，并提供管理功能：

```typescript
// 加载自定义词库列表
useEffect(() => {
  const fetchDictionaries = async () => {
    try {
      const result = await getDictionaries();
      if (result.success && result.dictionaries) {
        setCustomDictionaries(result.dictionaries);
      } else {
        showError(result.error || '获取词库列表失败');
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : '获取词库列表失败');
    }
  };

  fetchDictionaries();
}, [getDictionaries, setCustomDictionaries, showError]);
```

### 5. 弹窗状态

在`src/pages/gallery/context.ts`中已添加弹窗状态：

```typescript
export type GalleryState = {
  currentLanguageTab: LanguageCategoryType;
  isUploadModalOpen: boolean;
};

export const initialGalleryState: GalleryState = {
  currentLanguageTab: "en",
  isUploadModalOpen: false,
};
```

### 6. 空状态处理

在`CustomDictionaryList.tsx`中已实现空状态UI：

```tsx
if (customDictionaries.length === 0) {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
      <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">您还没有创建任何自定义词库</p>
      <Button onClick={onOpenUploadModal}>上传第一个词库</Button>
    </div>
  );
}
```

### 7. 上传按钮

在`CustomDictionaryList.tsx`中已添加上传按钮：

```tsx
<div className="mb-4 flex items-center justify-between">
  <h2 className="text-xl font-bold">我的词库</h2>
  <Button onClick={onOpenUploadModal} className="flex items-center gap-2">
    <IconPlus className="h-4 w-4" />
    <span>上传新词库</span>
  </Button>
</div>
```

## 实际实现的其他功能

### 1. 词典适配器

在`src/store/customDictionary.ts`中实现了自定义词典适配器，将自定义词典转换为应用内Dictionary格式：

```typescript
export function adaptCustomDictionaryToDictionary(customDict: ICustomDictionary): Dictionary {
  return {
    id: `custom_${customDict.id}`,  // 添加前缀区分自定义词库
    name: customDict.name,
    description: customDict.description,
    category: customDict.category || "我的词库",  // 默认分类
    tags: customDict.tags,
    url: `api://custom-dictionaries/${customDict.id}`,
    length: customDict.length,
    language: customDict.language || "en",
    languageCategory: customDict.languageCategory || "en",
    chapterCount: Math.ceil(customDict.length / 20), // 每章20个单词
  };
}
```

### 2. Excel解析功能

在`src/utils/excelParser.ts`中实现了Excel文件解析功能：

```typescript
export async function parseExcelFile(file: File): Promise<ExcelParseResult> {
  // 实现Excel文件解析逻辑
}
```

### 3. 自定义词典API

在`src/hooks/useCustomDictionary.ts`和`src/services/customDictionaryService.ts`中实现了自定义词典的API调用：

```typescript
export function useCustomDictionaryAPI() {
  // 实现获取、创建、更新、删除词典的API调用
}
```

### 4. 词典管理功能

在`CustomDictionaryList.tsx`中实现了词典管理功能，包括编辑、练习和删除：

```tsx
<div className="flex justify-end border-t border-gray-200 p-2 dark:border-gray-800">
  <Button
    variant="outline"
    size="sm"
    className="mr-2"
    onClick={() => navigate(`/gallery/custom_${dictionary.id}/edit`)}
  >
    编辑
  </Button>
  <Button
    variant="outline"
    size="sm"
    className="mr-2"
    onClick={() => handlePracticeClick(dictionary.id)}
  >
    练习
  </Button>
  <Button
    variant="outline"
    size="sm"
    className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
    onClick={() => handleDeleteDictionary(dictionary)}
  >
    删除
  </Button>
</div>
```

## DRY原则应用

本实现严格遵循DRY原则：

1. **代码复用**：
   - 复用现有的词典展示逻辑和分组机制
   - 通过适配器模式将自定义词典转换为通用Dictionary格式
   - 使用统一的API调用模式

2. **功能复用**：
   - 利用现有的分组逻辑对自定义词典进行分类展示
   - 复用现有的练习流程，通过设置currentDictId和currentChapter实现

3. **数据复用**：
   - 使用customDictionariesAtom管理自定义词典状态
   - 通过适配器函数将自定义词典转换为通用格式，避免数据冗余