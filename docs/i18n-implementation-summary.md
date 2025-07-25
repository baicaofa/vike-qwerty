# Keybr 项目国际化路由实施总结

## 实施概述

本文档总结了 Keybr 项目国际化路由系统的实施情况。我们成功实现了基于路径的多语言支持，支持中文（默认）、英文和法语三种语言。

## 已完成的工作

### 1. 核心路由系统 ✅

#### 1.1 全局路由钩子

- **文件**: `src/pages/+onBeforeRoute.ts`
- **功能**: 从 URL 中提取语言信息，移除语言前缀，将语言信息存储在 pageContext 中
- **支持**: `/zh/path`、`/en/path`、`/fr/path` 格式的路由

#### 1.2 语言状态管理更新

- **文件**: `src/store/languageAtom.ts`
- **更新**:
  - 添加法语支持
  - 新增 `detectLanguageFromUrl()` 函数
  - 更新 `detectBrowserLanguage()` 优先从 URL 检测语言
  - 支持三种语言的 HTML lang 属性映射

### 2. 组件系统 ✅

#### 2.1 多语言链接组件

- **文件**: `src/components/Link.tsx`
- **功能**: 自动根据当前语言添加语言前缀到链接
- **特性**: 支持手动指定语言、提供工具函数

#### 2.2 网站语言切换组件

- **文件**: `src/components/WebsiteLanguageSwitcher.tsx`

- **功能**: 专门用于网站语言切换，支持下拉菜单和紧凑版本
- **集成**: 已在 Typing 页面的 Header 中集成

### 3. 预渲染和 SEO ✅

#### 3.1 预渲染配置

- **文件**: `src/pages/+onPrerenderStart.ts`
- **功能**: 为每种语言生成对应的预渲染页面

#### 3.2 Sitemap 更新

- **文件**: `vite.config.ts`
- **更新**: 自动为每种语言生成对应的 sitemap 条目

#### 3.3 水合钩子更新

- **文件**: `src/pages/+onHydrationEnd.ts`
- **更新**: 优先从 URL 检测语言，正确设置 HTML lang 属性

### 4. 翻译资源 ✅

#### 4.1 客户端翻译资源

- **文件**: `src/i18n/client.ts`
- **更新**: 添加法语翻译资源，完善多语言支持

### 5. 测试和工具 ✅

#### 5.1 测试页面

- **文件**: `src/pages/i18n-test/+Page.tsx`
- **功能**: 提供完整的国际化功能测试界面

#### 5.2 工具函数

- **文件**: `src/utils/i18nRedirect.ts`
- **功能**: 提供国际化重定向和路径处理工具函数

## 技术架构

### 路由处理流程

1. **用户访问**: 用户访问 `/en/gallery`
2. **onBeforeRoute**: 提取语言 `en`，移除前缀得到 `/gallery`
3. **pageContext**: 设置 `locale: 'en'`，`urlLogical: '/gallery'`
4. **页面渲染**: 页面组件接收到干净的路径和语言信息
5. **链接生成**: Link 组件自动为链接添加语言前缀

### 语言检测优先级

1. **URL 路径**: 优先从 URL 路径检测语言（如 `/en/path`）
2. **浏览器语言**: 如果 URL 没有语言信息，使用浏览器语言设置
3. **默认语言**: 最终回退到中文（zh）

### 组件职责分离

- **WebsiteLanguageSwitcher**: 专门用于网站语言切换
- **Link**: 自动处理多语言链接生成

## 支持的语言

| 语言代码 | 语言名称 | URL 示例 | HTML Lang |
| -------- | -------- | -------- | --------- |
| zh       | 中文     | `/`      | zh-CN     |
| en       | English  | `/en/`   | en        |
| fr       | Français | `/fr/`   | fr        |

## 使用方法

### 1. 创建多语言链接

```tsx
import { Link } from '@/components/Link'

// 自动根据当前语言添加前缀
<Link href="/gallery">词典展示</Link>

// 手动指定语言
<Link href="/gallery" locale="en">Gallery</Link>
```

### 2. 获取当前语言信息

```tsx
import { usePageContext } from "vike-react/usePageContext";

function MyComponent() {
  const pageContext = usePageContext();
  const currentLocale = (pageContext as any).locale || "zh";

  return <div>当前语言: {currentLocale}</div>;
}
```

### 3. 添加语言切换器

```tsx
import { WebsiteLanguageSwitcher } from '@/components/WebsiteLanguageSwitcher'

// 完整版（带标签）
<WebsiteLanguageSwitcher />

// 紧凑版（仅图标）
<WebsiteLanguageSwitcher showLabel={false} />
```

## 测试验证

### 访问测试页面

访问 `/i18n-test` 页面可以测试以下功能：

- 语言切换功能
- 多语言链接生成
- 翻译资源加载
- URL 路径处理

### 多语言 URL 测试

- 中文（默认）: `https://example.com/`
- 英文: `https://example.com/en/`
- 法文: `https://example.com/fr/`

## 性能影响

- **预渲染时间**: 增加约 3 倍（每种语言生成一套页面）
- **包大小**: 增加翻译资源，影响较小
- **运行时性能**: 几乎无影响，路由处理在服务端完成

## 向后兼容性

- **现有链接**: 中文链接保持不变（如 `/gallery`）
- **SEO**: 通过 sitemap 确保搜索引擎正确索引
- **用户体验**: 语言切换无刷新，体验流畅

## 后续优化建议

### 短期优化（1-2 周）

1. 添加语言自动检测和重定向
2. 完善错误处理和边界情况
3. 添加更多翻译内容

### 长期优化（1-2 个月）

1. 实现智能语言推荐
2. 添加地区化内容支持
3. 性能监控和优化

## 总结

我们成功实现了完整的国际化路由系统，支持：

- ✅ 基于路径的多语言路由（/en、/fr）
- ✅ SEO 友好的多语言页面
- ✅ 自动语言检测和切换
- ✅ 预渲染支持
- ✅ 向后兼容性

系统架构清晰，组件职责分离，为后续扩展更多语言和功能奠定了良好基础。

---
