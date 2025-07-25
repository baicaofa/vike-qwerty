# Keybr 项目国际化路由实施计划

## 1. 项目概述

### 1.1 目标
实现基于路径的国际化路由系统，支持：
- 多语言子目录路由（/en、/fr、/zh 等）
- 根目录根据默认语言显示对应内容
- SEO 友好的多语言页面
- 语言切换按钮（仅在 Typing 页面显示）

### 1.2 技术方案
采用 Vike 官方推荐的 i18n 实现方案：
- 使用 `onBeforeRoute()` 钩子处理语言路径提取
- 更新 `<Link>` 组件支持多语言路由
- 配置预渲染支持多语言页面生成

## 2. 现状分析

### 2.1 现有架构优势
- ✅ 完整的 i18n 基础设施（react-i18next + i18next）
- ✅ 完善的翻译文件结构（public/locales/zh/, public/locales/en/）
- ✅ Jotai 全局语言状态管理
- ✅ 已使用 Vike 钩子系统

### 2.2 现有问题
- ❌ 单语言路由结构，不支持路径级语言区分
- ❌ 语言切换不改变 URL，SEO 不友好
- ❌ 缺少基于 URL 的语言自动检测

### 2.3 调整难度评估
**难度等级：中等（7/10）**

**复杂度分析：**
- 路由系统重构：高复杂度
- 组件更新：中等复杂度  
- 预渲染配置：中等复杂度
- 向后兼容：中等复杂度

## 3. 详细实施方案

### 3.1 阶段一：核心路由系统重构

#### 3.1.1 添加全局 onBeforeRoute 钩子
**文件：** `src/pages/+onBeforeRoute.ts`

```typescript
import { modifyUrl } from 'vike/modifyUrl'
import type { Url } from 'vike/types'

export function onBeforeRoute(pageContext) {
  const { urlWithoutLocale, locale } = extractLocale(pageContext.urlParsed)
  return {
    pageContext: {
      locale,
      urlLogical: urlWithoutLocale
    }
  }
}

function extractLocale(url: Url) {
  const { pathname } = url
  
  // 支持的语言列表
  const supportedLocales = ['zh', 'en', 'fr']
  const defaultLocale = 'zh'
  
  // 提取语言代码
  const pathSegments = pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]
  
  let locale = defaultLocale
  let pathnameWithoutLocale = pathname
  
  if (supportedLocales.includes(firstSegment)) {
    locale = firstSegment
    pathnameWithoutLocale = '/' + pathSegments.slice(1).join('/')
  }
  
  // 重构完整 URL
  const urlWithoutLocale = modifyUrl(url.href, { 
    pathname: pathnameWithoutLocale 
  })
  
  return { locale, urlWithoutLocale }
}
```

#### 3.1.2 更新语言状态管理
**文件：** `src/store/languageAtom.ts`

需要添加从 URL 检测语言的逻辑：

```typescript
// 添加 URL 语言检测函数
export function detectLanguageFromUrl(): SupportedLanguage {
  if (typeof window === 'undefined') return 'zh'
  
  const pathname = window.location.pathname
  const pathSegments = pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]
  
  if (['zh', 'en', 'fr'].includes(firstSegment)) {
    return firstSegment as SupportedLanguage
  }
  
  return 'zh' // 默认语言
}
```

### 3.2 阶段二：页面路由配置更新

#### 3.2.1 更新所有页面配置文件

**需要修改的文件列表：**
1. `src/pages/Typing/+config.ts` - 从 `route: "/"` 改为 `route: "/"`
2. `src/pages/Gallery/+config.ts` - 保持 `route: "/gallery"`
3. `src/pages/Analysis/+config.ts` - 保持 `route: "/analysis"`
4. `src/pages/Mobile/+config.ts` - 保持 `route: "/mobile"`
5. 其他所有页面配置文件

**注意：** 由于 `onBeforeRoute` 会处理语言前缀，页面配置无需修改路由路径。

#### 3.2.2 动态路由处理
**文件：** `src/pages/Gallery/@id/+config.ts`

动态路由无需特殊处理，`onBeforeRoute` 会自动处理语言前缀。

### 3.3 阶段三：组件和导航更新

#### 3.3.1 更新 Link 组件
**文件：** `src/components/Link.tsx`（新建）

```typescript
import { usePageContext } from 'vike-react/usePageContext'
import type { SupportedLanguage } from '@/store/languageAtom'

interface LinkProps {
  href: string
  locale?: SupportedLanguage
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export function Link({ href, locale, children, ...props }: LinkProps) {
  const pageContext = usePageContext()
  const currentLocale = locale ?? pageContext.locale ?? 'zh'
  
  // 如果不是默认语言，添加语言前缀
  let finalHref = href
  if (currentLocale !== 'zh') {
    finalHref = `/${currentLocale}${href}`
  }
  
  return <a href={finalHref} {...props}>{children}</a>
}
```

#### 3.3.2 更新现有导航组件
需要更新以下组件中的链接：
1. `src/components/Header.tsx`
2. `src/components/Layout.tsx`  
3. `src/components/BottomControlPanel.tsx`
4. 其他包含导航链接的组件

### 3.4 阶段四：语言切换功能 ✅

#### 3.4.1 创建 WebsiteLanguageSwitcher 组件
**文件：** `src/components/WebsiteLanguageSwitcher.tsx`



```typescript
import { usePageContext } from 'vike-react/usePageContext'
import { languageNames, type SupportedLanguage, supportedLanguages } from "@/store/languageAtom"

export function WebsiteLanguageSwitcher() {
  const pageContext = usePageContext()
  const currentLocale = (pageContext as any).locale || 'zh'
  const currentPath = (pageContext as any).urlParsed?.pathname || '/'

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    let newPath = currentPath
    if (newLanguage !== 'zh') {
      newPath = `/${newLanguage}${currentPath}`
    }
    window.location.href = newPath
  }

  return (
    <div className="website-language-switcher">
      {supportedLanguages.map((language) => (
        <button
          key={language}
          onClick={() => handleLanguageChange(language)}
          className={currentLocale === language ? 'active' : ''}
        >
          {languageNames[language]}
        </button>
      ))}
    </div>
  )
}
```

#### 3.4.2 在 Typing 页面集成语言切换 ✅
**文件：** `src/pages/Typing/+Page.tsx`

已在 Typing 页面的 Header 中添加 WebsiteLanguageSwitcher 组件。

## 4. 预渲染和 SEO 配置

### 4.1 添加 onPrerenderStart 钩子
**文件：** `src/pages/+onPrerenderStart.ts`

```typescript
export function onPrerenderStart(prerenderContext) {
  const locales = ['zh', 'en', 'fr']
  const defaultLocale = 'zh'
  
  const pageContexts = []
  
  prerenderContext.pageContexts.forEach((pageContext) => {
    locales.forEach((locale) => {
      let { urlOriginal } = pageContext
      
      // 为非默认语言添加语言前缀
      if (locale !== defaultLocale) {
        urlOriginal = `/${locale}${pageContext.urlOriginal}`
      }
      
      pageContexts.push({
        ...pageContext,
        urlOriginal,
        locale
      })
    })
  })
  
  return {
    prerenderContext: {
      pageContexts
    }
  }
}
```

### 4.2 更新 sitemap 配置
**文件：** `vite-plugin-sitemap.ts`

需要更新 sitemap 生成逻辑，为每种语言生成对应的 URL。

### 4.3 更新 SEO 配置
**文件：** `src/resources/tdk.ts`

添加多语言的 TDK（Title, Description, Keywords）配置。

## 5. 实施时间表

### 第一周：核心路由系统 ✅
- [x] 实现 onBeforeRoute 钩子
- [x] 更新语言状态管理（添加 URL 语言检测）
- [x] 添加法语支持
- [x] 测试基本路由功能

### 第二周：组件和导航 ✅
- [x] 创建新的 Link 组件
- [x] 创建 WebsiteLanguageSwitcher 组件（区别于内部资源切换的 LanguageSwitcher）
- [x] 在 Typing 页面集成语言切换功能
- [x] 更新翻译资源

### 第三周：预渲染和 SEO ✅
- [x] 配置 onPrerenderStart 钩子
- [x] 更新 sitemap 生成（支持多语言路由）
- [x] 更新 onHydrationEnd 钩子

### 第四周：测试和优化
- [ ] 全面测试多语言路由
- [ ] 性能优化
- [ ] 文档更新
- [ ] 添加重定向规则处理旧链接

## 6. 风险评估和缓解策略

### 6.1 主要风险
1. **向后兼容性问题**
   - 风险：现有链接失效
   - 缓解：添加重定向规则

2. **SEO 影响**
   - 风险：搜索引擎索引混乱
   - 缓解：正确配置 canonical 链接和 hreflang

3. **性能影响**
   - 风险：预渲染时间增加
   - 缓解：优化预渲染配置

### 6.2 回滚计划
如果实施过程中遇到严重问题，可以：
1. 回滚到当前的单语言路由系统
2. 保留翻译文件和状态管理
3. 后续重新规划实施方案

## 7. 成功标准

### 7.1 功能标准
- [ ] 支持 /zh、/en、/fr 路由访问
- [ ] 根目录显示默认语言内容
- [ ] 语言切换功能正常
- [ ] 所有页面支持多语言

### 7.2 性能标准
- [ ] 页面加载时间不超过当前 +20%
- [ ] 预渲染时间在可接受范围内
- [ ] SEO 评分保持或提升

### 7.3 用户体验标准
- [ ] 语言切换流畅无闪烁
- [ ] URL 结构清晰易懂
- [ ] 向后兼容现有链接

## 8. 后续优化计划

### 8.1 短期优化（1-2个月）
- 添加更多语言支持
- 优化语言检测逻辑
- 完善错误处理

### 8.2 长期优化（3-6个月）
- 实现智能语言推荐
- 添加地区化内容
- 性能进一步优化

---

