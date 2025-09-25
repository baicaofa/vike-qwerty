# AGENTS.md

本文件面向参与本仓库开发的 AI 编程代理。规则来源于 `shrimp-rules.md`、`.cursor/rules/` 和 `.augment/rules/imported/`，并整理为适合本项目长期维护的统一规范。

## 交流与工作方式

- 默认使用简体中文与用户沟通，表达简洁、专业。
- 先阅读相关代码和相邻实现，再做修改；优先遵循项目现有模式。
- 修改前明确影响范围；涉及多文件联动时，检查所有引用点。
- 遵循 KISS、YAGNI、DRY 和 SOLID 原则，避免无必要的抽象、重构和依赖引入。
- 不为模糊需求臆造大范围改动；优先做最小、可验证的变更。

## 项目概况

- 项目名称：Keybr（vike-qwerty）。
- 项目用途：单词记忆与英语键盘肌肉记忆训练软件。
- 核心功能：打字练习、单词学习、熟词标记、复习系统、用户系统、词库管理。
- 技术栈：Vike、vike-react、React、TypeScript、Tailwind CSS、Jotai、Zustand。
- 图标相关：项目使用 `unplugin-icons`，也存在 Heroicons、Lucide 等依赖；新增图标时优先贴合现有页面用法。

## 目录结构

- `src/pages/`：页面组件，每个目录对应一个 Vike 路由。
- `src/components/`：跨页面共享组件。
- `src/store/`：全局状态管理。
- `src/utils/`：工具函数和辅助方法。
- `src/utils/db/`：数据库相关操作。
- `src/services/`：服务层代码，封装 API 调用。
- `src/hooks/`：共享 hooks。
- `src/constants/`：常量定义。
- `src/typings/`：全局类型定义。
- `src/assets/`：静态资源。
- `src/resources/`：应用资源，例如词典数据。
- `src/renderer/`：Vike 渲染器配置和渲染逻辑。
- `src/server/`：服务端代码。
- `doc/`、`docs/`、`issues/`：文档和任务记录，修改相关功能时同步检查。

## 文件命名与组织

- 组件文件使用 PascalCase，例如 `WordPanel.tsx`。
- 工具函数和常量文件使用 camelCase，例如 `wordListFetcher.ts`、`dictionary.ts`。
- CSS 文件与组件同名；复杂组件可使用 `ComponentName/index.tsx` 结构。
- 资源文件使用小写和短横线分隔，例如 `icon-user.png`。
- 页面目录优先使用小写和短横线分隔；现有目录命名不做无关重命名。
- 配置文件使用小写、无空格命名。

页面内部组织约定：

- `components/`：页面专用组件。
- `hooks/`：页面专用 hooks。
- `store/`：页面专用状态。

## Vike 规范

- `+Page.tsx`：页面主组件。
- `+config.ts`：页面配置。
- `+onBeforeRender.ts`：渲染前逻辑。
- `+onRenderClient.tsx`：客户端渲染逻辑。
- `+onRenderHtml.tsx`：服务端渲染逻辑。
- `+onHydrationEnd.ts`：水合完成后的客户端逻辑。

新增页面时：

1. 在 `src/pages/` 下创建页面目录。
2. 添加 `+Page.tsx`。
3. 添加必要的 `+config.ts` 或遵循已有路由约定。
4. 如需渲染前数据或服务端逻辑，再添加 `+onBeforeRender.ts`。

生命周期选择规则：

- `onRenderClient` 仅用于必须在页面渲染前完成的核心逻辑，因为它会阻塞页面显示。
- `onHydrationEnd` 用于应用首次加载时执行一次、且不影响 First Paint 的非核心客户端逻辑。
- 持久化布局中的 `useEffect` 或 `onPageTransitionStart` 用于每次页面切换都要执行的逻辑，例如埋点、标题更新、状态重置。
- 编写 `+onHydrationEnd.ts` 时，从 `vike/types` 导入 `OnHydrationEndAsync`，并为函数添加 `ReturnType<OnHydrationEndAsync>` 返回类型。

水合与浏览器 API：

- 依赖 `window`、`localStorage` 等浏览器 API 的组件，应使用 `useEffect` 配合状态延迟到客户端水合后渲染，避免 SSR/CSR 不匹配。
- 严格限制 `suppressHydrationWarning={true}`。只有不可避免的第三方库等少数场景可使用，并必须添加注释说明原因。

## 状态管理

- 跨组件、跨模块共享的全局状态优先使用 Jotai。
- 需要持久化的全局状态使用 `atomWithStorage`。
- 全局 atom 放在 `src/store/`。
- 页面级复杂状态使用 `useImmerReducer` + Context API，并放在对应页面目录下。
- 简单组件内部状态使用 `useState`；不触发重渲染的值使用 `useRef`。
- 不要在同一组件树中随意混用不同状态管理方案。
- 禁止直接引用跨页面组件的内部 state。

## 数据流与服务层

- API 调用必须封装在 `src/services/`，不要在组件中直接发请求。
- 数据获取和缓存优先沿用项目现有 SWR 使用方式。
- 数据库操作统一封装在 `src/utils/db/`，通过 hooks 暴露给组件。
- 修改全局状态、类型、常量或数据库封装时，递归检查所有引用点。

## 路由与导航

- 导航优先使用标准 `<a>` 链接或 Vike 的 `navigate` 函数。
- 禁止新增 `window.location.href` 跳转；遇到旧实现时，可在相关改动中逐步替换。
- 路由结构应尽量与 `src/pages/` 目录结构一致。

## 类型系统

- 对象结构优先使用 `interface`。
- 联合类型、交叉类型、映射类型使用 `type`。
- 避免 `any`；未知数据优先使用 `unknown` 并做收窄。
- 充分使用 TypeScript 工具类型和泛型，保持类型可复用。
- 通用类型放在 `src/typings/`；组件专用类型可放在组件文件内；API 响应类型放在 `src/services/` 或使用处附近。
- Props 接口命名为 `[ComponentName]Props`。

## 样式规范

- 优先使用 Tailwind CSS 类。
- 遵循现有页面的设计风格、间距、颜色和暗黑模式写法。
- 暗黑模式使用 `isOpenDarkModeAtom` 控制，并通过 Tailwind `dark:` 类适配。
- 复杂组件可以使用独立 CSS 文件，但不要无关迁移既有样式。

## 敏感目录与禁止事项

禁止在没有明确需求时直接修改：

- `build/` 及其子目录。
- `public/dicts/`、`public/sounds/` 等静态资源数据目录。
- `assets.json` 等自动生成文件。
- 核心框架配置，例如 Vike 渲染器配置、`src/renderer/+config.ts` 等。
- 合规性、元数据和基础配置文件，例如 `LICENSE`、`components.json`，除非任务明确要求。

其他禁止事项：

- 禁止在全局作用域添加可变状态。
- 禁止为小改动重构现有目录结构或命名体系。
- 禁止随意升级或替换核心依赖，例如 Vike、React、Tailwind。
- 禁止新增依赖而不同步检查 `package.json`、锁文件、README 或相关文档。

## 多文件联动检查

修改以下对象时，同步检查相关文件：

| 修改对象 | 必须检查 |
| --- | --- |
| 页面组件 | 对应子组件、页面 hooks、页面 store、路由配置 |
| 全局状态 atom | 所有使用该 atom 的组件、hooks 和工具函数 |
| 类型定义 | 是否已有类似类型、所有导入点 |
| 资源文件 | 所有导入、引用和构建路径 |
| `README.md` | 相关文档和引用链接 |
| `tailwind.config.mjs` | `postcss.config.mjs`、相关 CSS 和 Tailwind 类 |
| 配置文件 | 相关依赖、文档、构建脚本 |

## 验证建议

- 按改动风险选择验证方式：类型检查、lint、构建、相关页面手动检查或针对性脚本。
- 旧工具规范中提到“无需编写测试/无需运行 npm 命令”，在本仓库中理解为：不要为低风险文档或样式改动强行新增测试或运行重型命令；涉及行为、状态、数据流或构建配置时，应选择必要的验证。
- 如果因为环境限制无法验证，在最终说明中明确指出。

## 注释原则

- 新增功能文件或复杂逻辑时，添加简短注释说明职责或关键决策。
- 不要为显而易见的代码添加空泛注释。
- 如果使用例外方案，例如 `suppressHydrationWarning`，必须写明原因和可接受边界。
