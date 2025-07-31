# 自定义文章功能实现文档

## 📋 目录

- [1. 标点符号控制功能](#1-标点符号控制功能)
  - [1.1 功能概述](#11-功能概述)
  - [1.2 技术实现](#12-技术实现)
  - [1.3 用户体验](#13-用户体验)
  - [1.4 翻译键](#14-翻译键)
- [2. 上传功能简化](#2-上传功能简化)
  - [2.1 功能概述](#21-功能概述)
  - [2.2 技术实现](#22-技术实现)
  - [2.3 界面布局](#23-界面布局)
  - [2.4 翻译键](#24-翻译键)
- [3. 用户指南翻译](#3-用户指南翻译)
  - [3.1 中文翻译](#31-中文翻译)
  - [3.2 英文翻译](#32-英文翻译)

---

## 1. 标点符号控制功能

### 1.1 功能概述

在自定义文章练习页面添加了标点符号控制按钮，允许用户在练习过程中实时切换是否显示标点符号。

#### ✨ 功能特点

1. **双重按钮位置**

   - **顶部操作栏**: 在页面顶部的操作按钮区域添加了标点符号控制按钮
   - **底部控制栏**: 在练习控制按钮区域也添加了相同的功能按钮

2. **实时切换**

   - 用户可以在练习过程中随时切换标点符号显示状态
   - 切换时会自动暂停练习，处理文本后恢复练习状态
   - 无需重新开始练习

3. **视觉反馈**

   - **隐藏标点模式**: 按钮显示橙色，图标为编辑笔，文本为"显示标点"
   - **显示标点模式**: 按钮显示灰色，图标为 X，文本为"隐藏标点"
   - 按钮状态实时反映当前的标点符号设置

4. **智能处理**
   - 切换时会自动重新处理文本内容
   - 保持当前的练习进度和统计信息
   - 平滑的状态转换，不影响用户体验

### 1.2 技术实现

#### 核心函数

```typescript
const handleTogglePunctuation = () => {
  // 如果正在练习，先暂停
  if (state.isTyping && !state.isPaused) {
    safeDispatch({ type: ArticleActionType.PAUSE_TYPING });
  }

  // 更新预处理设置
  dispatch({
    type: ArticleActionType.UPDATE_PREPROCESS_SETTINGS,
    payload: {
      removePunctuation: !state.preprocessSettings.removePunctuation,
    },
  });

  // 重新处理文本
  dispatch({ type: ArticleActionType.PROCESS_TEXT });

  // 如果之前正在练习，恢复练习
  if (state.isTyping && !state.isPaused) {
    safeDispatch({ type: ArticleActionType.RESUME_TYPING });
  }
};
```

#### 状态管理

- 使用现有的 `preprocessSettings.removePunctuation` 状态
- 通过 `UPDATE_PREPROCESS_SETTINGS` action 更新设置
- 通过 `PROCESS_TEXT` action 重新处理文本

#### UI 组件

- 按钮使用条件样式，根据当前状态显示不同颜色
- 图标和文本根据状态动态变化
- 提供 tooltip 提示功能

#### 按钮位置

**顶部操作栏**

```tsx
{
  /* 标点符号控制按钮 */
}
<button
  type="button"
  onClick={handleTogglePunctuation}
  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
    state.preprocessSettings.removePunctuation
      ? "bg-orange-600 hover:bg-orange-700 text-white"
      : "bg-gray-600 hover:bg-gray-700 text-white"
  }`}
>
  {/* 动态图标和文本 */}
</button>;
```

**底部控制栏**

```tsx
{
  /* 标点符号切换按钮 */
}
<button
  type="button"
  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
    state.preprocessSettings.removePunctuation
      ? "bg-orange-600 hover:bg-orange-700 text-white"
      : "bg-gray-600 hover:bg-gray-700 text-white"
  }`}
  onClick={handleTogglePunctuation}
>
  {/* 动态图标和文本 */}
</button>;
```

### 1.3 用户体验

#### 使用场景

1. **练习前设置**: 用户可以在开始练习前选择是否显示标点符号
2. **练习中调整**: 用户可以在练习过程中根据需要进行调整
3. **不同难度**: 隐藏标点符号可以增加练习难度，显示标点符号更适合初学者

#### 交互流程

1. 用户点击标点符号控制按钮
2. 系统自动暂停当前练习（如果正在练习）
3. 更新预处理设置并重新处理文本
4. 恢复练习状态（如果之前正在练习）
5. 用户看到更新后的文本内容

#### 与其他功能的集成

- ✅ 完全兼容现有的状态管理系统
- ✅ 与文章上传、编辑功能无缝集成
- ✅ 保持练习统计数据的准确性
- ✅ 支持多语言翻译

### 1.4 翻译键

#### 中文翻译 (zh-CN)

```json
{
  "practice": {
    "showPunctuation": "显示标点",
    "hidePunctuation": "隐藏标点"
  }
}
```

#### 英文翻译 (en-US)

```json
{
  "practice": {
    "showPunctuation": "Show Punctuation",
    "hidePunctuation": "Hide Punctuation"
  }
}
```

#### 功能说明

- **showPunctuation**: 当标点符号被隐藏时，按钮显示此文本
- **hidePunctuation**: 当标点符号显示时，按钮显示此文本

#### 按钮状态

- **隐藏标点模式** (removePunctuation: true): 按钮显示橙色，文本为"显示标点"
- **显示标点模式** (removePunctuation: false): 按钮显示灰色，文本为"隐藏标点"

#### 图标说明

- **显示标点**: 使用编辑/修复图标 (pencil)
- **隐藏标点**: 使用关闭/删除图标 (X)

---

## 2. 上传功能简化

### 2.1 功能概述

将上传过程中的移除标点符号功能移到练习文章页面，简化上传流程，提升用户体验。

#### ✨ 主要变化

1. **流程简化**

   - **之前**: 两步流程（输入文章 → 设置选项）
   - **现在**: 单步流程（输入文章 + 设置选项）

2. **功能重新分配**

   - **上传页面**: 专注于文章内容输入和基本设置
   - **练习页面**: 负责标点符号控制和实时调整

3. **用户体验优化**
   - 减少操作步骤，提高效率
   - 更清晰的功能分工
   - 更灵活的使用方式

### 2.2 技术实现

#### 移除的功能

1. **步骤管理**: 删除 `currentStep` 状态和相关逻辑
2. **标点符号设置**: 移除 `preprocessSettings` 状态和 UI
3. **步骤指示器**: 删除步骤指示器组件
4. **步骤切换**: 删除 `handleNextStep` 和 `handlePrevStep` 函数

#### 保留的功能

1. **文件上传**: Word 文档上传和解析
2. **文章输入**: 标题和内容输入
3. **声音设置**: 练习时的声音开关
4. **预览功能**: 实时预览文章内容

#### 新增的提示

```tsx
{
  /* 标点符号设置提示 */
}
<div className="bg-blue-50 border border-blue-200 rounded-md p-3">
  <div className="flex items-start">
    <svg
      className="w-5 h-5 text-blue-600 mt-0.5 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div className="text-sm">
      <p className="font-medium text-blue-800">{t("upload.punctuationNote")}</p>
      <p className="text-blue-700 mt-1">{t("upload.punctuationNoteDesc")}</p>
    </div>
  </div>
</div>;
```

#### 与现有系统的集成

- 保持与现有 `ArticleContext` 的兼容性
- 使用现有的 `useSaveArticle` 钩子
- 保持练习状态的完整性

### 2.4 翻译键

#### 中文翻译 (zh-CN)

```json
{
  "upload": {
    "title": "上传自定义文章",
    "description": "上传Word文档或手动输入文章内容",
    "uploadFile": "上传文件",
    "selectWordFile": "选择Word文件",
    "uploading": "上传中...",
    "supportedFormats": "支持格式",
    "invalidFileType": "不支持的文件格式，请上传.docx文件",
    "parseError": "解析文档失败，请检查文件格式是否正确",
    "uploadError": "文件上传失败，请重试",
    "saveError": "保存文章失败，请重试",
    "saveErrorLog": "保存文章失败日志",
    "startPractice": "开始练习",
    "punctuationNote": "标点符号设置",
    "punctuationNoteDesc": "您可以在练习页面随时调整是否显示标点符号"
  }
}
```

#### 英文翻译 (en-US)

```json
{
  "upload": {
    "title": "Upload Custom Article",
    "description": "Upload Word document or manually input article content",
    "uploadFile": "Upload File",
    "selectWordFile": "Select Word File",
    "uploading": "Uploading...",
    "supportedFormats": "Supported formats",
    "invalidFileType": "Unsupported file format, please upload .docx file",
    "parseError": "Failed to parse document, please check file format",
    "uploadError": "File upload failed, please try again",
    "saveError": "Failed to save article, please try again",
    "saveErrorLog": "Save article error log",
    "startPractice": "Start Practice",
    "punctuationNote": "Punctuation Settings",
    "punctuationNoteDesc": "You can adjust punctuation display anytime during practice"
  }
}
```

---

## 3. 用户指南翻译

### 3.1 中文翻译

```json
{
  "guide": {
    "customArticleTitle": "自定义文章使用指南",
    "introduction": "功能介绍",
    "introText": "自定义文章功能让您能够上传自己的文档或手动输入文章内容进行打字练习。支持Word文档上传、实时编辑、标点符号控制等高级功能，为您提供个性化的打字练习体验。",
    "mainFeatures": "主要功能",
    "wordUpload": "Word文档上传",
    "wordUploadDesc": "支持.docx和.doc格式文件上传，自动解析文档内容，最大支持10MB文件",
    "articleEdit": "文章编辑",
    "articleEditDesc": "支持编辑已保存的文章，可选择覆盖原文件或创建新版本",
    "punctuationControl": "标点符号控制",
    "punctuationControlDesc": "在练习过程中实时切换是否显示标点符号，灵活调整练习难度",
    "realTimePractice": "实时练习",
    "realTimePracticeDesc": "提供实时的打字练习体验，包含速度、准确率等详细统计",
    "howToUse": "使用步骤",
    "step1Title": "上传或输入文章",
    "step1Desc": "点击"上传文章"按钮，选择Word文档或手动输入文章内容。支持.docx格式（推荐）和.doc格式（部分支持）。",
    "step1Tip": "建议使用.docx格式以获得最佳兼容性",
    "step2Title": "开始练习",
    "step2Desc": "设置完成后点击"开始练习"，系统会自动保存文章并进入练习界面。",
    "step2Tip": "练习过程中可以随时暂停和恢复",
    "step3Title": "调整设置",
    "step3Desc": "在练习界面使用标点符号控制按钮，实时调整是否显示标点符号。",
    "step3Tip": "隐藏标点符号可以增加练习难度",
    "advancedFeatures": "高级功能",
    "advanced1": "历史记录管理",
    "advanced1Desc": "查看和管理所有已保存的文章，支持按创建时间或最后练习时间排序",
    "advanced2": "详细统计",
    "advanced2Desc": "实时显示打字速度、准确率、错误次数等详细统计数据",
    "advanced3": "声音反馈",
    "advanced3Desc": "可选的键盘音效和错误提示音，提升练习体验",
    "advanced4": "自动保存",
    "advanced4Desc": "练习完成后自动保存到个人文章库，方便重复练习",
    "faq": "常见问题",
    "faq1": "支持哪些文件格式？",
    "faq1Answer": "主要支持.docx格式（推荐），部分支持.doc格式。建议使用.docx格式以获得最佳兼容性和解析效果。",
    "faq2": "如何调整标点符号显示？",
    "faq2Answer": "在练习界面顶部或底部的控制按钮区域，点击标点符号控制按钮即可实时切换是否显示标点符号。",
    "faq3": "可以编辑已保存的文章吗？",
    "faq3Answer": "可以。在历史记录中找到要编辑的文章，点击编辑按钮，可以选择覆盖原文件或创建新版本。",
    "faq4": "练习数据会保存吗？",
    "faq4Answer": "是的。所有练习数据都会自动保存，包括速度、准确率、错误次数等统计信息。",
    "proTips": "使用技巧",
    "proTip1": "使用.docx格式上传文档，确保最佳兼容性",
    "proTip2": "练习时先显示标点符号熟悉内容，再隐藏标点符号提高难度",
    "proTip3": "定期查看历史记录，重复练习已保存的文章",
    "proTip4": "利用声音反馈功能，提升打字节奏感",
    "supportedFormats": "支持格式",
    "manualInput": "手动输入",
    "formatNote": "注意：.doc格式支持有限，建议使用.docx格式",
    "tip": "提示"
  }
}
```

### 3.2 英文翻译

```json
{
  "guide": {
    "customArticleTitle": "Custom Article User Guide",
    "introduction": "Feature Overview",
    "introText": "The custom article feature allows you to upload your own documents or manually input article content for typing practice. It supports Word document upload, real-time editing, punctuation control, and other advanced features to provide you with a personalized typing practice experience.",
    "mainFeatures": "Main Features",
    "wordUpload": "Word Document Upload",
    "wordUploadDesc": "Supports .docx and .doc format file uploads with automatic document content parsing, maximum 10MB file size",
    "articleEdit": "Article Editing",
    "articleEditDesc": "Edit saved articles with options to overwrite original files or create new versions",
    "punctuationControl": "Punctuation Control",
    "punctuationControlDesc": "Real-time toggle for punctuation display during practice, flexibly adjust practice difficulty",
    "realTimePractice": "Real-time Practice",
    "realTimePracticeDesc": "Provides real-time typing practice experience with detailed statistics including speed and accuracy",
    "howToUse": "How to Use",
    "step1Title": "Upload or Input Article",
    "step1Desc": "Click the 'Upload Article' button to select a Word document or manually input article content. Supports .docx format (recommended) and .doc format (partial support).",
    "step1Tip": "Use .docx format for best compatibility",
    "step2Title": "Start Practice",
    "step2Desc": "After setup, click 'Start Practice' to automatically save the article and enter the practice interface.",
    "step2Tip": "You can pause and resume practice at any time",
    "step3Title": "Adjust Settings",
    "step3Desc": "Use the punctuation control button in the practice interface to toggle punctuation display in real-time.",
    "step3Tip": "Hiding punctuation can increase practice difficulty",
    "advancedFeatures": "Advanced Features",
    "advanced1": "History Management",
    "advanced1Desc": "View and manage all saved articles with sorting by creation time or last practice time",
    "advanced2": "Detailed Statistics",
    "advanced2Desc": "Real-time display of typing speed, accuracy, error count, and other detailed statistics",
    "advanced3": "Sound Feedback",
    "advanced3Desc": "Optional keyboard sounds and error alerts to enhance practice experience",
    "advanced4": "Auto Save",
    "advanced4Desc": "Automatically save to personal article library after practice for easy repetition",
    "faq": "Frequently Asked Questions",
    "faq1": "What file formats are supported?",
    "faq1Answer": "Primarily supports .docx format (recommended) with partial support for .doc format. We recommend using .docx format for best compatibility and parsing results.",
    "faq2": "How do I adjust punctuation display?",
    "faq2Answer": "In the practice interface, click the punctuation control button in the top or bottom control area to toggle punctuation display in real-time.",
    "faq3": "Can I edit saved articles?",
    "faq3Answer": "Yes. Find the article you want to edit in the history, click the edit button, and choose to overwrite the original file or create a new version.",
    "faq4": "Are practice data saved?",
    "faq4Answer": "Yes. All practice data is automatically saved, including speed, accuracy, error count, and other statistics.",
    "proTips": "Pro Tips",
    "proTip1": "Use .docx format for document uploads to ensure best compatibility",
    "proTip2": "Start practice with punctuation visible to familiarize with content, then hide punctuation to increase difficulty",
    "proTip3": "Regularly check history to repeat practice with saved articles",
    "proTip4": "Use sound feedback features to improve typing rhythm",
    "supportedFormats": "Supported Formats",
    "manualInput": "Manual Input",
    "formatNote": "Note: .doc format has limited support, recommend using .docx format",
    "tip": "Tip"
  }
}
```
