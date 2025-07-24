# 国际化 (i18n) 使用指南

## 概述

本项目使用 react-i18next 实现国际化功能，支持中文和英文两种语言。

## 文件结构

```
src/
├── i18n/
│   ├── index.ts          # i18n配置文件
│   └── README.md         # 使用说明
├── store/
│   └── languageAtom.ts   # 语言状态管理
├── hooks/
│   └── useI18n.ts        # i18n相关Hook
├── components/
│   └── LanguageSwitcher.tsx  # 语言切换组件
└── pages/
    └── +onHydrationEnd.ts    # 全局初始化

public/
└── locales/              # 翻译文件
    ├── zh/               # 中文翻译
    │   ├── common.json
    │   ├── typing.json
    │   ├── article.json
    │   ├── gallery.json
    │   └── errors.json
    └── en/               # 英文翻译
        ├── common.json
        ├── typing.json
        ├── article.json
        ├── gallery.json
        └── errors.json
```

## 基本使用

### 1. 在组件中使用翻译

```tsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation("common");

  return (
    <div>
      <h1>{t("navigation.home")}</h1>
      <button>{t("buttons.start")}</button>
    </div>
  );
}
```

### 2. 使用自定义 Hook

```tsx
import { useI18n } from "@/hooks/useI18n";

function MyComponent() {
  const { t, currentLanguage, switchLanguage } = useI18n();

  return (
    <div>
      <p>{t("common:status.loading")}</p>
      <button onClick={() => switchLanguage("en")}>Switch to English</button>
    </div>
  );
}
```

### 3. 使用命名空间特定的翻译

```tsx
import { useNamespaceTranslation } from "@/hooks/useI18n";

function TypingComponent() {
  const { t } = useNamespaceTranslation("typing");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
    </div>
  );
}
```

## 翻译文件管理

### 命名空间说明

- `common`: 通用文本（导航、按钮、状态等）
- `typing`: 打字练习页面
- `article`: 文章练习页面
- `gallery`: 词典展示页面
- `errors`: 错误信息

### 添加新翻译

1. 在对应的 JSON 文件中添加键值对
2. 保持中英文文件结构一致
3. 使用嵌套对象组织相关翻译

```json
{
  "section": {
    "subsection": {
      "key": "翻译文本"
    }
  }
}
```

## 语言切换

### 使用语言切换组件

```tsx
import { LanguageSwitcher, LanguageSwitcherCompact } from '@/components/LanguageSwitcher';

// 完整版语言切换器
<LanguageSwitcher showLabel={true} />

// 紧凑版语言切换器（只显示图标）
<LanguageSwitcherCompact />
```

### 编程方式切换语言

```tsx
import { useI18n } from "@/hooks/useI18n";

function MyComponent() {
  const { switchLanguage, toggleLanguage } = useI18n();

  const handleSwitchToEnglish = () => {
    switchLanguage("en");
  };

  const handleToggle = () => {
    toggleLanguage(); // 在中英文之间切换
  };
}
```

## 最佳实践

### 1. 翻译键命名规范

- 使用小写字母和点号分隔
- 按功能模块组织
- 保持键名简洁明了

```json
{
  "navigation": {
    "home": "首页",
    "about": "关于"
  },
  "buttons": {
    "save": "保存",
    "cancel": "取消"
  }
}
```

### 2. 插值使用

```json
{
  "welcome": "欢迎, {{name}}!",
  "itemCount": "共 {{count}} 个项目"
}
```

```tsx
const { t } = useTranslation();

// 使用插值
<p>{t('welcome', { name: 'John' })}</p>
<p>{t('itemCount', { count: 5 })}</p>
```

### 3. 复数形式

```json
{
  "item": "项目",
  "item_plural": "项目"
}
```

### 4. 错误处理

```tsx
const { t } = useTranslation("errors");

try {
  // 一些操作
} catch (error) {
  showError(t("network.connectionFailed"));
}
```

## 注意事项

1. **SSR 兼容性**: 配置已确保服务端和客户端语言状态同步
2. **性能优化**: 翻译文件按需加载，避免一次性加载所有语言
3. **类型安全**: 建议为翻译键创建 TypeScript 类型定义
4. **缓存策略**: 翻译文件会被浏览器缓存，更新时注意缓存清理

## 添加新语言

1. 在 `supportedLanguages` 中添加新语言代码
2. 创建对应的翻译文件目录
3. 更新 `languageNames` 映射
4. 测试所有功能正常工作
