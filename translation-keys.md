# 需要添加的翻译键

为了支持标点符号控制功能，需要在翻译文件中添加以下键值：

## 中文翻译 (zh-CN)

```json
{
  "practice": {
    "showPunctuation": "显示标点",
    "hidePunctuation": "隐藏标点"
  }
}
```

## 英文翻译 (en-US)

```json
{
  "practice": {
    "showPunctuation": "Show Punctuation",
    "hidePunctuation": "Hide Punctuation"
  }
}
```

## 功能说明

- **showPunctuation**: 当标点符号被隐藏时，按钮显示此文本
- **hidePunctuation**: 当标点符号显示时，按钮显示此文本

## 按钮状态

- **隐藏标点模式** (removePunctuation: true): 按钮显示橙色，文本为"显示标点"
- **显示标点模式** (removePunctuation: false): 按钮显示灰色，文本为"隐藏标点"

## 图标说明

- **显示标点**: 使用编辑/修复图标 (pencil)
- **隐藏标点**: 使用关闭/删除图标 (X)