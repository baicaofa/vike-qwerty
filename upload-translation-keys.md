# 上传功能翻译键

为了支持简化后的上传功能，需要在翻译文件中添加以下键值：

## 中文翻译 (zh-CN)

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

## 英文翻译 (en-US)

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

## 功能说明

### 主要变化
1. **简化流程**: 从两步流程简化为单步流程
2. **移除标点设置**: 标点符号控制移到练习页面
3. **增加提示**: 告知用户可以在练习页面调整标点符号

### 用户体验改进
- 更快的上传流程
- 更清晰的功能分工
- 更灵活的使用方式