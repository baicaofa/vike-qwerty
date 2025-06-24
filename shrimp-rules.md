# Development Guidelines

## 1. 目录与文件操作规则

### 1.1 递归检查
- 必须递归检查所有目录和文件，确保规则覆盖所有开发对象
- 新增、删除、重命名目录或文件时，必须同步更新相关引用和文档

### 1.2 多文件联动
- 修改`README.md`时，必须同步更新`docs/README_EN.md`、`docs/README_JP.md`等多语言文档
- 修改`tailwind.config.mjs`、`postcss.config.mjs`等配置文件时，必须检查相关依赖文件是否需同步调整
- 修改`components.json`、`feature-tracking.mdc`等元数据文件时，必须同步更新相关文档和引用
- 修改`LICENSE`时，必须检查所有合规性相关文件
- 修改`TESTING_PLAN.md`时，必须同步检查测试相关脚本和文档

### 1.3 敏感目录与文件
- 严禁直接修改`build/`目录及其子目录
- 严禁直接修改`public/dicts/`、`public/sounds/`等静态资源目录下的文件，除非有明确需求
- 严禁直接修改`assets.json`等自动生成文件

## 2. 命名与组织规范

### 2.1 命名规范
- 组件文件：PascalCase（如`WordPanel.tsx`）
- 工具函数、常量文件：camelCase（如`wordListFetcher.ts`、`dictionary.ts`）
- CSS 文件：与组件同名
- 资源文件：统一小写、短横线分隔（如`icon-user.png`）
- 页面目录：小写、短横线分隔
- 配置文件：统一小写、无空格

### 2.2 目录组织
- 页面组件：`src/pages/`，每个目录对应一个路由
- 共享组件：`src/components/`
- 全局状态：`src/store/`
- 工具函数：`src/utils/`
- 资源文件：`src/assets/`、`src/resources/`、`public/`
- 服务层：`src/services/`
- 类型定义：`src/typings/`
- 配置文件：项目根目录
- 文档：`docs/`、`doc/`、`issues/`

## 3. 功能实现与数据流

### 3.1 状态管理
- 全局状态必须用Jotai，持久化用atomWithStorage，统一放在`src/store/`
- 页面级复杂状态用useImmerReducer+Context API，放在页面目录下
- 组件内部简单状态用useState/useRef

### 3.2 API与数据库
- API调用统一封装在`src/services/`，禁止在组件中直接请求
- 数据库操作统一封装在`src/utils/db/`，通过hooks暴露

### 3.3 资源文件
- 新增/删除资源文件时，必须同步检查引用和依赖
- 资源文件命名必须唯一、规范

## 4. 框架与依赖

- 禁止随意升级或替换核心依赖（如Vike、React、Tailwind等）
- 新增依赖必须在`package.json`、`README.md`、`docs/`中同步登记
- 配置变更需同步更新相关文档

## 5. 工作流与多文件协调

### 5.1 操作流程
- 任何涉及多文件的操作，必须列出所有受影响文件，逐一修改并记录
- 修改全局状态、类型、常量时，必须递归检查所有引用点
- 新增页面、组件、类型时，必须检查是否可复用现有内容

### 5.2 多文件同步示例
| 操作对象           | 必须同步的文件/目录                  |
|--------------------|--------------------------------------|
| README.md          | docs/README_EN.md, docs/README_JP.md |
| tailwind.config.mjs| postcss.config.mjs, 相关CSS文件      |
| store/atom         | 所有引用该atom的组件                 |
| 资源文件           | 所有引用、导入该资源的文件           |
| 配置文件           | 相关依赖、文档                       |

## 6. AI决策标准

### 6.1 优先级决策树
1. 组件样式修改
2. 组件行为修改
3. 数据流修改
4. 应用状态修改
5. 多文件联动与同步
6. 配置与依赖变更

### 6.2 模糊请求处理
- 必须递归检查所有目录和文件，独立分析后再执行
- 优先参考类似实现、现有模式
- 必须在代码注释中说明决策理由

## 7. 禁止事项

- 禁止修改核心框架配置（如Vike配置、renderer/+config.ts）
- 禁止在全局作用域添加可变状态
- 禁止混用不同状态管理库
- 禁止直接引用跨页面组件state
- 禁止重构现有目录结构和命名约定
- 禁止直接修改build/、public/dicts/、assets.json等敏感目录和文件
- 禁止删除或覆盖合规性、元数据、配置文件（如LICENSE、components.json、feature-tracking.mdc）

## 8. 示例

### 应该做的
- 新增页面时，递归检查并同步更新所有相关配置、文档
- 新增依赖时，登记于package.json、README.md、docs/
- 新增资源文件时，检查所有引用点并规范命名

### 不应该做的
- 直接在现有组件中添加全局状态
- 修改核心框架文件
- 不遵循命名规范创建文件
- 直接修改build/、public/dicts/等敏感目录

## 9. 变更与维护
- 所有规则以最小变更原则更新，及时剔除失效内容，补充新内容
- 规则变更后，必须同步更新所有相关文档和引用
- 发现规则遗漏或失效，必须立即补充或修正

## 10. 结构化与高亮
- 所有规则必须以列表、表格等结构化方式呈现，便于AI解析
- 所有禁止事项、警告必须高亮显示
