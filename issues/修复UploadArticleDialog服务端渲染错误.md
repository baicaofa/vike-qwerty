# 修复 UploadArticleDialog 服务端渲染错误

## 问题描述
在服务端渲染时出现 `ReferenceError: enableSound is not defined` 错误，导致页面无法正常渲染。

## 错误位置
- 文件：`src/pages/CustomArticle/components/UploadArticleDialog.tsx`
- 行号：347 和 546

## 问题原因
代码中使用了 `enableSound` 变量和 `handleEnableSoundToggle` 函数，但这些都没有定义，导致服务端渲染时出现引用错误。

## 修复方案
1. 添加 `enableSound` 状态变量
2. 添加 `handleEnableSoundToggle` 事件处理函数

## 修复内容

### 1. 添加状态变量
```tsx
const [enableSound, setEnableSound] = useState(false);
```

### 2. 添加事件处理函数
```tsx
// 启用声音开关
const handleEnableSoundToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEnableSound(e.target.checked);
};
```

## 验证结果
- ✅ 状态变量已正确定义
- ✅ 事件处理函数已正确实现
- ✅ `resetForm` 函数中已正确重置状态
- ✅ `handleStartPractice` 函数中已正确使用状态
- ✅ 所有使用 `enableSound` 的地方都能正常工作

## 技术要点
- 遵循 Vike 服务端渲染规范
- 确保所有变量在服务端渲染前已定义
- 保持与现有代码风格一致
- 参考 `EditArticleDialog.tsx` 的实现方式

## 修复时间
2024年12月19日

## 状态
✅ 已完成 