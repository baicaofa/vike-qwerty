# UploadArticleDialog 组件优化说明

## 优化概述

本次优化对 `src/pages/CustomArticle/components/UploadArticleDialog.tsx` 组件进行了全面重构，采用现代化的 UI 设计和更好的用户体验。

## 主要改进

### 1. 采用 Tabs 布局

- **分离上传方式**：使用 Tabs 将"上传文档"和"粘贴文本"两种方式完全分离
- **清晰的导航**：每个 Tab 都有对应的图标和标签，用户一目了然
- **状态保持**：Tab 切换时保持表单数据状态

### 2. 文件上传体验优化

- **拖拽上传**：支持拖拽文件到指定区域进行上传
- **视觉反馈**：拖拽时显示高亮状态，上传时显示进度
- **文件信息显示**：上传成功后显示文件名和大小
- **格式验证**：明确显示支持的格式(.docx/.doc)和大小限制(10MB)
- **错误处理**：友好的错误提示，包括格式错误、大小超限等

### 3. 文本输入体验优化

- **实时字符统计**：显示当前字符数和限制
- **智能提示**：接近限制时橙色警告，超出限制时红色错误
- **清空功能**：一键清空文本内容
- **实时预览**：输入时实时显示内容预览

### 4. 通用功能增强

- **字符限制**：3000 字符限制，实时验证
- **标题编辑**：从文件名自动提取，支持手动修改
- **响应式设计**：适配不同屏幕尺寸
- **表单验证**：完整的表单验证和错误提示

## 技术实现

### 组件结构

```
UploadArticleDialog (主组件)
├── CharCounter (字符统计组件)
├── FileUploadSection (文件上传Tab)
└── TextInputSection (文本输入Tab)
```

### 设计原则遵循

- **KISS**: 每个 Tab 只负责一种上传方式，简化用户操作
- **YAGNI**: 只实现当前需要的功能，避免过度设计
- **SOLID**: 组件职责单一，易于扩展和维护
- **DRY**: 提取公共组件，复用验证逻辑

### 状态管理

- `title`: 文章标题
- `content`: 文章内容
- `isUploading`: 上传状态
- `uploadError`: 上传错误信息
- `activeTab`: 当前激活的 Tab

## 新增翻译键值

在 `public/locales/zh/article.json` 中新增了以下翻译键值：

```json
{
  "upload": {
    "fileUploadTab": "上传文档",
    "textInputTab": "粘贴文本",
    "selectFile": "选择文件",
    "dragDropText": "或拖拽文件到此处",
    "supportedFormatsText": "支持格式：.docx, .doc",
    "fileSizeLimit": "文件大小：最大 {{size}}",
    "articleTitle": "文章标题",
    "articleTitlePlaceholder": "请输入文章标题",
    "articleContent": "文章内容",
    "articleContentPlaceholder": "请输入或粘贴文章内容...",
    "contentPreview": "文章内容预览",
    "clearText": "清空",
    "charLimitExceeded": "超出字符限制 ({{count}}/{{maxChars}})",
    "nearLimit": "接近限制",
    "overLimit": "超出限制",
    "contentPreviewLabel": "内容预览"
  }
}
```

## 使用方式

组件使用方式保持不变：

```tsx
import UploadArticleDialog from "./UploadArticleDialog";

function App() {
  const [open, setOpen] = useState(false);

  return <UploadArticleDialog open={open} onOpenChange={setOpen} />;
}
```

## 测试要点

1. **Tabs 切换功能**：验证两个 Tab 的切换和状态保持
2. **文件上传功能**：测试拖拽上传、格式验证、错误处理
3. **文本输入功能**：测试字符统计、限制提示、清空功能
4. **表单验证**：测试必填项验证和字符限制
5. **响应式布局**：测试不同屏幕尺寸下的显示效果

## 注意事项

1. 确保 Word 文档解析工具正常工作
2. 文件大小限制为 10MB
3. 字符限制为 3000 字符
4. 需要正确配置国际化文本
5. 需要正确配置数据库保存功能
