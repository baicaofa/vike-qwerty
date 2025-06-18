# 开发指南

## 项目概述

- 项目名称：Keybr（vike-qwerty）
- 项目用途：单词记忆与英语肌肉记忆锻炼软件
- 核心功能：打字练习、单词学习、熟词标记、用户系统
- 技术栈：Vike、React、TypeScript、Tailwind CSS、Jotai/Zustand

## 项目架构

### 目录结构与用途

- `src/pages/`: 页面组件，每个目录对应一个路由
- `src/components/`: 共享组件，可被多个页面复用
- `src/store/`: 全局状态管理，使用 Jotai 和 Zustand
- `src/utils/`: 工具函数和帮助方法
- `src/utils/db/`: 数据库相关操作
- `src/renderer/`: Vike 渲染器配置和客户端/服务端渲染逻辑
- `src/typings/`: 全局类型定义
- `src/constants/`: 常量定义
- `src/hooks/`: 共享钩子函数
- `src/assets/`: 静态资源文件
- `src/resources/`: 应用资源（如词典数据）
- `src/services/`: 服务层代码，处理 API 调用
- `src/server/`: 服务端代码

### 关键文件协调规则

- 修改页面组件时，检查对应的子组件、hooks 和 store
- 修改全局状态时，检查所有使用该状态的组件
- 添加新页面时，必须添加对应的 Vike 配置文件
- 修改组件样式时，检查相关的 CSS 文件和 Tailwind 类

## 文件命名与组织规范

### Vike 框架特定文件

- `+Page.tsx`: 页面主组件
- `+config.ts`: 页面配置
- `+onRenderClient.tsx`: 客户端渲染逻辑
- `+onRenderHtml.tsx`: 服务端渲染逻辑
- `+onBeforeRender.ts`: 渲染前逻辑

### 命名约定

- **组件文件**: 使用 PascalCase（如`WordPanel.tsx`）
- **工具函数文件**: 使用 camelCase（如`wordListFetcher.ts`）
- **常量文件**: 使用 camelCase（如`dictionary.ts`）
- **CSS 文件**: 与组件同名（如`WordPanel.css`）

### 页面内部组织

- `/components`: 页面专用组件
- `/hooks`: 页面专用钩子函数
- `/store`: 页面专用状态管理

## 状态管理规范

### 全局状态

- **必须使用 Jotai**: 对于需要在多个组件间共享的状态
- **使用 atomWithStorage**: 对于需要持久化的状态
- **位置**: 所有全局 atom 必须放在`src/store/`目录下

```tsx
// 示例：创建全局状态
export const someConfigAtom = atomWithStorage("someConfig", {
  isOpen: true,
  value: "default",
});
```

### 页面状态

- **使用 useImmerReducer**: 对于复杂的页面状态管理
- **使用 Context API**: 在页面组件树中共享状态
- **位置**: 页面级状态应放在`pages/[PageName]/store/`目录下

```tsx
// 示例：页面级状态管理
const [state, dispatch] = useImmerReducer(reducer, initialState);
```

### 组件状态

- **使用 useState**: 对于简单的组件内部状态
- **使用 useRef**: 对于不触发重渲染的值

## 组件开发规范

### 组件分类

- **页面组件**: 对应路由的主要组件，放在`pages/`目录
- **共享组件**: 可被多个页面使用的组件，放在`components/`目录
- **页面专用组件**: 只被特定页面使用的组件，放在`pages/[PageName]/components/`目录

### 组件组织

- 每个组件应有自己的目录（对于复杂组件）或单文件（对于简单组件）
- 复杂组件目录结构：`ComponentName/index.tsx`和子组件文件

### 组件 Props

- 使用 TypeScript 接口定义 Props
- 接口命名为`[ComponentName]Props`
- 使用可选属性标记非必需 Props

```tsx
// 示例：组件Props定义
interface WordPanelProps {
  word: string;
  translation?: string;
  onComplete?: () => void;
}
```

## 页面开发规范

### 创建新页面

1. 在`src/pages/`下创建新目录
2. 添加`+Page.tsx`作为主组件
3. 添加`+config.ts`配置路由
4. 如需服务端逻辑，添加`+onBeforeRender.ts`

```tsx
// 示例：+Page.tsx
export function Page() {
  return <div>New Page</div>;
}
```

```tsx
// 示例：+config.ts
export default {
  route: "/new-page",
};
```

### 页面路由

- 路由结构应与目录结构一致
- 动态路由使用`[param]`格式命名目录

## 数据流规范

### API 调用

- 使用 service 层封装 API 调用
- 将 API 调用逻辑放在`services/`目录
- 使用 SWR 进行数据获取和缓存

### 数据库交互

- 使用`utils/db/`中的函数进行数据库操作
- 数据库操作应包装在 hooks 中提供给组件使用

## 样式规范

### Tailwind CSS

- 优先使用 Tailwind 类进行样式设置
- 遵循项目现有的设计风格和颜色方案
- 复杂组件可使用独立的 CSS 文件

### 主题与暗黑模式

- 使用`isOpenDarkModeAtom`控制暗黑模式
- 使用 Tailwind 的暗黑模式类`dark:`设置暗黑模式样式

## 类型定义规范

### 类型位置

- 通用类型：`src/typings/`目录
- 组件专用类型：组件文件内部
- API 响应类型：`services/`目录或使用处

### 类型命名

- 接口使用名词，如`UserProfile`
- 类型别名使用后缀`Type`，如`StateType`
- 枚举使用名词，如`UserRole`

## 禁止事项

- **禁止修改**：核心框架配置（如 Vike 配置）
- **禁止在全局作用域**：添加可变状态
- **禁止混用**：不同的状态管理库（在同一组件树中）
- **禁止直接引用**：跨页面的组件 state
- **禁止重构**：现有的目录结构和命名约定

## AI 决策标准

### 修改优先级（从低到高）

1. 组件样式修改
2. 组件行为修改
3. 数据流修改
4. 应用状态修改

### 模糊情况处理

- 查看类似组件的实现方式
- 遵循项目中的现有模式
- 在代码注释中说明决策理由

### 多文件协调

- 修改状态时检查所有使用该状态的组件
- 添加新类型时检查是否有类似的现有类型
- 添加新组件时检查是否可复用现有组件

## 具体示例

### 应该做的

- 在页面专用目录下添加组件：`src/pages/Typing/components/NewComponent.tsx`
- 使用 Jotai 管理全局状态：`src/store/newFeatureAtom.ts`
- 在新页面中遵循 Vike 约定：添加`+Page.tsx`和`+config.ts`

### 不应该做的

- 直接在现有组件中添加全局状态
- 修改核心框架文件（如`renderer/+config.ts`）
- 不遵循现有命名约定创建文件
