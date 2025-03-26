# Typing 页面组件说明

## 简介

Typing 模块是一个英语打字练习应用的核心模块，提供了单词打字练习、发音学习、成绩统计等功能。该模块采用 React + TypeScript + Vike 技术栈开发，支持服务端渲染和客户端水合。

## 目录结构

Typing/
├── +Page.tsx # 主页面组件
├── +config.js # Vike 路由和页面配置
├── +onBeforeRender.js # 服务端渲染前的处理逻辑
├── components/ # 组件目录
│ ├── AnalysisButton/ # 分析按钮组件
│ ├── DictChapterButton/ # 字典章节选择组件
│ ├── ErrorBookButton.tsx # 错词本按钮组件
│ ├── HandPosition/ # 手位图示组件
│ ├── LoopWordSwitcher/ # 单词循环开关组件
│ ├── PrevAndNextWord/ # 上下词切换组件
│ ├── Progress/ # 进度显示组件
│ ├── PronunciationSwitcher/ # 发音设置组件
│ ├── ResultScreen/ # 结果展示组件
│ ├── Setting/ # 设置面板组件
│ ├── ShareButton/ # 分享按钮组件
│ ├── SoundSwitcher/ # 声音开关组件
│ ├── Speed/ # 速度显示组件
│ ├── StartButton/ # 开始按钮组件
│ ├── Switcher/ # 功能开关组件
│ ├── WordDictation/ # 单词默写组件
│ ├── WordList/ # 单词列表组件
│ └── WordPanel/ # 单词面板组件
├── hooks/ # 自定义 Hooks
│ ├── useConfetti.ts # 完成效果 Hook
│ └── useWordList.ts # 单词列表 Hook
└── store/ # 状态管理
├── index.ts # 状态管理主文件
└── type.ts # 类型定义文件

## 核心功能

### 1. 打字练习

- 实时单词显示和输入
- 打字速度和准确率统计
- 错误统计和分析
- 进度保存和恢复

### 2. 学习辅助

- 单词发音（多种口音支持）
- 音标显示
- 手位提示
- 默写模式

### 3. 数据分析

- 练习数据统计
- 错词分析
- 进度追踪
- 成绩分享

### 4. 个性化设置

- 发音设置
- 显示设置
- 键盘声音
- 循环练习

## 技术特性

### 状态管理

- 使用 Jotai 进行全局状态管理
- 使用 Context API 进行组件状态管理
- 使用 Immer 进行不可变状态更新

### 性能优化

- 组件懒加载
- 状态本地化
- 缓存优化
- 按需渲染

### 数据持久化

- IndexedDB 存储练习记录
- LocalStorage 存储用户设置
- 云端数据同步（可选）

### 用户体验

- 键盘快捷键支持
- 动画过渡效果
- 响应式设计
- 深色模式支持

## 开发指南

### 环境要求

- Node.js >= 14
- npm >= 6
- React >= 18
- TypeScript >= 4

### 安装依赖

```bash
npm install
```

### 开发命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check
```

### 开发规范

1. 组件开发

   - 使用函数组件和 Hooks
   - 遵循 TypeScript 类型定义
   - 保持组件单一职责

2. 状态管理

   - 使用 Jotai 管理全局状态
   - 使用 Context 管理组件树状态
   - 避免状态提升和 prop drilling

3. 样式管理

   - 使用 Tailwind CSS
   - 遵循 BEM 命名规范
   - 支持主题定制

4. 测试要求
   - 单元测试覆盖核心逻辑
   - E2E 测试覆盖主要流程
   - 性能测试达标
