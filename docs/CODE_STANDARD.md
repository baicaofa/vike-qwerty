# Keybr 项目代码规范

## 1. 基本原则

- 保持代码简洁、清晰和一致性
- 遵循 TypeScript 和 React 最佳实践
- 所有代码必须通过 ESLint 和 Prettier 检查
- 优先使用函数式组件和 Hooks

## 2. 文件组织

### 2.1 目录结构
```
src/
├── pages/           # 页面组件，基于文件的路由
├── components/      # 通用组件
├── renderer/        # Vike SSR 渲染配置
├── store/          # 全局状态管理(Jotai)
├── utils/          # 工具函数
├── resources/      # 静态资源和配置
└── typings/        # TypeScript 类型定义
```

### 2.2 命名规范

- 文件夹使用小写字母，单词间用连字符(-)分隔
- 组件文件使用 PascalCase 命名，如 `WordPanel.tsx`
- 工具函数文件使用 camelCase 命名，如 `wordListFetcher.ts`
- 类型定义文件使用 camelCase，如 `resource.ts`
- 配置文件使用小写，如 `vite.config.ts`

## 3. 代码风格

### 3.1 TypeScript 规范

- 始终定义类型而不是使用 any
- 使用 interface 定义对象类型，type 定义联合类型或工具类型
- 使用 type import 语法导入类型： `import type { SomeType } from './types'`
- 导出类型时使用 export type
- 避免使用 namespace

### 3.2 React 规范

- 使用函数组件和 Hooks
- Props 类型必须显式定义
- 组件必须是纯函数，避免副作用
- 有状态逻辑的组件使用 hooks 分离关注点
- 使用 memo、useCallback、useMemo 优化性能
- 组件文件结构:
  ```typescript
  import { /* ... */ } from 'react'
  
  interface Props {
    // props 类型定义
  }
  
  export default function ComponentName({ prop1, prop2 }: Props) {
    // hooks 调用
    
    // 事件处理函数
    
    // 渲染
    return (
      // JSX
    )
  }
  ```

### 3.3 样式规范

- 使用 Tailwind CSS 进行样式管理
- 复杂组件可以抽取常用类名到变量
- Dark Mode 使用 Tailwind 的 dark: 变体
- 自定义样式使用 CSS Modules
- 避免内联样式

### 3.4 状态管理

- 使用 Jotai 进行状态管理
- atom 命名规范: xxxAtom，如 `currentChapterAtom`
- 相关的 atom 放在同一个文件中
- 复杂状态逻辑使用 atom family 或 atomWithStorage

## 4. 工程规范

### 4.1 Git 规范

- 提交信息格式:
  ```
  <type>(<scope>): <subject>

  <body>
  ```
- type 分类:
  - feat: 新功能
  - fix: 修复bug
  - docs: 文档更新
  - style: 代码格式调整
  - refactor: 重构
  - test: 测试相关
  - chore: 构建/工具链相关

### 4.2 注释规范

- 组件必须包含基本的 JSDoc 注释
- 复杂逻辑必须添加注释说明
- TODO 注释格式: `// TODO: 说明`
- FIXME 注释格式: `// FIXME: 说明`
- 避免注释掉的代码残留在文件中

### 4.3 测试规范

- 新功能需要包含单元测试
- 使用 React Testing Library 编写组件测试
- 测试文件命名: `*.test.tsx` 或 `*.spec.tsx`
- 测试覆盖关键业务逻辑和边界条件

## 5. 安全规范

- 敏感信息（如 API key）必须通过环境变量配置
- 用户输入必须经过验证和转义
- 避免在客户端存储敏感数据
- 使用 HTTPS 进行 API 通信

## 6. 性能规范

- 图片资源必须优化（压缩、合适的格式）
- 使用 React.lazy 进行代码分割
- 大文件（如词典）采用按需加载
- 合理使用缓存策略
- 避免不必要的重渲染

## 7. 无障碍规范

- 必要的 ARIA 属性
- 合适的语义化标签
- 键盘操作支持
- 适当的颜色对比度

## 8. 国际化规范

- 文案硬编码放在独立的配置文件中
- 支持多语言切换
- 时间日期格式本地化
- 数字格式本地化

## 9. 持续改进

本规范随项目发展持续更新，团队成员可以提出建议和修改意见。规范的目的是提高代码质量和开发效率，而不是限制开发创造力。

## 10. ESLint 配置

```javascript
{
  "root": true,
  "env": {
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "sort-imports": ["error", { "ignoreDeclarationSort": true }],
    "@typescript-eslint/consistent-type-imports": 1,
    "react/prop-types": "off"
  }
}
```

## 11. Prettier 配置

```javascript
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "printWidth": 80,
  "trailingComma": "es5"
}
```