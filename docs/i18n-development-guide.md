# Keybr 项目国际化开发规范

## 概述

本文档规范了 Keybr 项目中组件国际化的标准流程和最佳实践，确保所有开发者能够统一、高效地实现多语言支持。

## 技术栈

- **i18n 库**: react-i18next + i18next
- **支持语言**: 中文(zh)、英文(en)
- **翻译文件位置**: `public/locales/{lang}/{namespace}.json`
- **命名空间**: common、typing、article、gallery、errors

## 组件国际化标准流程

### 1. 导入必要依赖

```tsx
import { useTranslation } from "react-i18next";
import { Link } from "@/components/Link"; // 替换原生 a 标签
```

### 2. 初始化翻译函数

```tsx
export default function MyComponent() {
  const { t } = useTranslation("namespace"); // 选择合适的命名空间
  // ...
}
```

### 3. 命名空间选择规则

- **common**: 通用按钮、状态、操作等
- **typing**: 打字练习相关功能
- **article**: 文章练习相关功能  
- **gallery**: 词典展示相关功能
- **errors**: 错误信息和提示

### 4. 替换硬编码文本

#### 简单文本替换
```tsx
// 原代码
<span>是否跳过熟词</span>

// 国际化后
<span>{t("advancedSettings.skipFamiliarWord.label")}</span>
```

#### 带插值的动态文本
```tsx
// 原代码
<span>{`跳过熟词已${isEnabled ? "开启" : "关闭"}`}</span>

// 国际化后
<span>
  {t("advancedSettings.skipFamiliarWord.status", {
    status: isEnabled ? t("advancedSettings.skipFamiliarWord.enabled") : t("advancedSettings.skipFamiliarWord.disabled")
  })}
</span>
```

#### 链接组件替换
```tsx
// 原代码
<a href="/familiar" title="查看熟词">查看熟词</a>

// 国际化后
<Link href="/familiar" title={t("advancedSettings.viewFamiliarWords")}>
  {t("advancedSettings.viewFamiliarWords")}
</Link>
```

## 翻译文件组织规范

### 1. 键名命名规则

- 使用 **camelCase** 命名
- 按功能模块分组
- 层级不超过 3 层
- 语义化命名，见名知意

### 2. 标准结构模板

```json
{
  "功能模块名": {
    "设置项名": {
      "label": "标签文本",
      "description": "描述文本", 
      "enabled": "开启",
      "disabled": "关闭",
      "status": "状态模板{{status}}"
    },
    "按钮文本": "按钮名称",
    "提示信息": "提示内容"
  }
}
```

### 3. 实际示例

#### 中文翻译 (zh/typing.json)
```json
{
  "advancedSettings": {
    "skipFamiliarWord": {
      "label": "是否跳过熟词",
      "description": "开启后，练习时会自动跳过已被标记为熟词的单词",
      "enabled": "开启",
      "disabled": "关闭", 
      "status": "跳过熟词已{{status}}"
    },
    "viewFamiliarWords": "查看熟词"
  }
}
```

#### 英文翻译 (en/typing.json)
```json
{
  "advancedSettings": {
    "skipFamiliarWord": {
      "label": "Skip Familiar Words",
      "description": "When enabled, familiar words marked by you will be automatically skipped during practice",
      "enabled": "On",
      "disabled": "Off",
      "status": "Skip familiar words {{status}}"
    },
    "viewFamiliarWords": "View Familiar Words"
  }
}
```

## 开发检查清单

### 组件修改
- [ ] 导入 useTranslation hook
- [ ] 选择正确的命名空间
- [ ] 替换所有硬编码文本
- [ ] 使用 Link 组件替换 a 标签
- [ ] 处理动态文本的插值语法
- [ ] 确保 title、aria-label 等属性也国际化

### 翻译文件
- [ ] 在对应语言的 JSON 文件中添加翻译键
- [ ] 中英文翻译内容准确对应
- [ ] JSON 格式正确，无语法错误
- [ ] 键名遵循命名规范
- [ ] 插值变量名保持一致

### 质量验证
- [ ] 组件在中英文环境下显示正常
- [ ] 动态文本插值工作正确
- [ ] 链接跳转功能正常
- [ ] 无控制台错误或警告
- [ ] 翻译内容语义准确

## 常见问题与解决方案

### 1. 翻译键找不到
**问题**: 控制台显示翻译键未找到
**解决**: 检查键名拼写、命名空间是否正确、JSON 文件格式

### 2. 插值不生效
**问题**: 动态文本显示为模板字符串
**解决**: 确认插值语法正确，变量名在中英文文件中一致

### 3. 链接跳转异常
**问题**: 使用 Link 组件后跳转不正常
**解决**: 检查 href 属性格式，确保符合项目路由规范

## 最佳实践

1. **批量处理**: 一次性完成组件的所有国际化工作
2. **保持一致**: 相同功能的文本使用相同的翻译键
3. **语义化**: 翻译键名要能清晰表达内容含义
4. **测试验证**: 完成后在两种语言环境下测试功能
5. **文档更新**: 重要的国际化改动要更新相关文档

## 工具推荐

- **VS Code 插件**: i18n Ally (可视化管理翻译文件)
- **在线工具**: JSON 格式验证器
- **测试方法**: 浏览器语言切换测试

---

遵循本规范可以确保项目国际化的一致性和可维护性，提升用户的多语言体验。
