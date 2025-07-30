# 依赖包更新建议

为了支持 Word 文档上传功能，需要在 `package.json` 中添加以下依赖：

```json
{
  "dependencies": {
    "mammoth": "^1.6.0"
  }
}
```

## 安装命令

```bash
yarn add mammoth
```

## 功能说明

- **mammoth**: 用于解析 .docx 文件并提取纯文本内容
- 支持现代浏览器环境
- 文件大小约 200KB (gzipped)
- 支持复杂的 Word 文档格式

## 注意事项

1. mammoth 主要用于解析 .docx 格式，对旧版 .doc 格式支持有限
2. 建议限制上传文件大小为 10MB 以内
3. 解析过程在客户端进行，不会上传文件到服务器
4. 需要处理解析失败的情况并提供友好的错误提示