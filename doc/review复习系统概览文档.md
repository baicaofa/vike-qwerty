# Keybr（vike-qwerty）项目概览文档

## 1. 复习项目整体功能简介

结合了间隔重复记忆法（Spaced Repetition System，SRS）和打字练习，帮助用户高效地记忆单词并提升打字速度。通过科学的复习计划和实时反馈，用户可以系统性地学习和巩固英语单词，同时锻炼打字技能，提高英语学习效率。

## 2. 项目主要模块及功能说明

项目主要包含以下几个核心模块：

### 2.1 今日复习（Today）

负责展示用户当天需要复习的单词列表，按照练习次数分组显示，提供复习进度和统计信息。

### 2.2 复习练习（Practice）

提供单词打字练习功能，用户可以通过打字来复习单词，系统会记录练习状态和成绩。

### 2.3 复习历史（History）

展示用户的复习历史记录和学习进度，包括各种统计数据和图表分析。

### 2.4 复习设置（Settings）

允许用户自定义复习计划和学习参数，如每日目标、复习间隔等。

### 2.5 复习仪表板（Dashboard）

提供整体学习情况的可视化展示，包括复习进度、统计数据和学习计划。

## 3. 各模块具体功能

### 3.1 今日复习（Today）

- 显示今日需要复习的单词列表
- 按练习次数分组展示单词（未练习、已练习一次等）
- 提供复习进度统计（总单词数、已练习数、完成率）
- 支持单词过滤（全部、未练习、已练习）
- 直接跳转到练习页面的快捷入口
- 显示复习计划概览

### 3.2 复习练习（Practice）

- 复用打字页面的核心组件，提供一致的打字体验
- 支持按已练习/未练习状态筛选单词进行练习
- 实时显示打字速度、准确率和进度
- 记录单词练习状态，更新复习记录
- 提供打字设置选项（如字体大小、颜色主题等）
- 练习完成后显示统计结果

### 3.3 复习历史（History）

- 展示复习记录和学习进度
- 提供多种时间范围筛选（最近 7 天、30 天、3 个月等）
- 按不同条件排序单词（最近复习、频率、记忆强度等）
- 显示单词复习状态卡片（等级、复习次数、连续正确等）
- 提供复习统计图表（如每日复习量、准确率等）

### 3.4 复习设置（Settings）

- 提供多种预设配置（初学者、标准、高强度、轻松）
- 自定义核心学习参数（每日目标、最大复习数等）
- 设置复习提醒和通知
- 自定义间隔序列（复习间隔天数）
- 配置高级选项（如难度系数、记忆衰减模型等）

### 3.5 复习仪表板（Dashboard）

- 显示关键学习指标（今日复习、待复习单词、总复习次数等）
- 展示最近 7 天复习进度图表
- 提供复习统计数据（总单词数、已复习单词、平均准确率等）
- 显示今日复习计划（紧急复习、正常复习、复习单词等）
- 预估复习时间和难度等级

## 4. 用户流程

### 主要用户流程：

1. **初始设置**

   - 用户首次使用时，设置复习参数或选择预设配置
   - 系统初始化复习计划

2. **日常复习循环**

   - 用户访问仪表板查看整体学习情况
   - 进入今日复习页面，查看待复习单词列表
   - 选择开始练习，进入复习练习页面
   - 通过打字完成单词复习，系统记录练习状态
   - 练习完成后，查看统计结果
   - 返回今日复习页面，继续下一组单词或结束当天复习

3. **学习进度跟踪**

   - 用户定期访问复习历史页面，查看学习进度
   - 分析复习统计数据，了解自己的学习效果
   - 根据需要调整复习设置，优化学习计划

4. **复习计划调整**
   - 用户可随时访问复习设置页面
   - 根据个人情况调整复习参数
   - 系统根据新设置更新复习计划

## 5. 核心技术栈

项目使用以下核心技术：

- **前端框架**：Vike + React + TypeScript
- **样式系统**：Tailwind CSS
- **状态管理**：Jotai/Zustand
- **数据存储**：IndexedDB（通过 Dexie.js 操作）
- **间隔重复算法**：自定义 SRS（Spaced Repetition System）算法
- **UI 组件**：自定义 UI 组件库（如 Button、Badge、Link 等）
- **路由系统**：Vike 内置路由
- **数据可视化**：自定义图表组件

项目采用组件化开发方式，各功能模块高度解耦，使用自定义 hooks（如 useSpacedRepetition）管理复杂的业务逻辑，确保代码可维护性和可扩展性。间隔重复系统的核心算法通过精心设计的配置参数，可以灵活适应不同用户的学习习惯和需求。

## 6. 模块详细说明

### 6.1 复习练习模块 (src/pages/review/practice)

#### 模块名称及路径

- **模块名称**：复习练习模块
- **主路径**：`src/pages/review/practice/+Page.tsx`
- **组件路径**：`src/pages/review/practice/components/`

#### 功能说明

该模块实现了对当天需要复习的单词进行打字练习的功能。通过复用 Typing 页面的打字组件，为用户提供一致的打字体验。根据用户的练习状态（已练习/未练习）显示不同的单词列表，支持 URL 参数控制显示模式，记录单词的练习状态，并在完成后更新单词的复习记录。

#### 主要组件及职责

1. **ReviewPracticePage**

   - 主页面组件，负责整体逻辑和状态管理
   - 处理用户界面状态、数据加载和错误处理
   - 管理练习模式切换（已练习/未练习单词）
   - 处理单词完成和练习完成事件

2. **TypingPractice**

   - 包装 TypingProvider 并处理打字相关逻辑
   - 每次单词列表变化时重新渲染打字组件
   - 向子组件传递单词完成和打字完成的回调函数

3. **TypingContent**

   - 使用 useContext 获取打字状态
   - 显示打字界面和进度条
   - 处理键盘事件和单词完成事件

4. **ReviewStats (src/pages/review/practice/components/ReviewStats.tsx)**
   - 显示复习统计数据，如准确率、平均用时、连击数等
   - 使用不同颜色和图标表示不同的表现等级
   - 提供进度条显示整体完成进度

#### 模块通信方式

1. **Props 传递**：

   - 从父组件向子组件传递数据和回调函数
   - 例如：`TypingPractice` 接收 `typingWords`、`onWordComplete` 和 `onTypingComplete` 作为 props

2. **Context API**：

   - 使用 `TypingContext` 在组件树中共享打字状态
   - `TypingContent` 组件通过 `useContext(TypingContext)` 获取状态

3. **自定义 Hooks**：

   - 使用 `useTodayReviews` 获取今日需要复习的单词
   - 提供 `refreshTodayReviews` 函数刷新数据

4. **回调函数**：
   - `handleWordComplete` 处理单词完成事件
   - `handleTypingComplete` 处理整个打字练习完成事件

#### 外部依赖和接口

1. **内部工具函数**：

   - `adaptReviewWordsToTypingWords`：将复习单词转换为打字组件格式
   - `extractWordNameFromTypingWord`：从打字单词中提取单词名称
   - `getUnpracticedWords`/`getPracticedWords`：获取未练习/已练习的单词
   - `updateWordPracticeCount`：更新单词练习次数
   - `completeWordReview`：完成单词复习，更新复习记录

2. **UI 组件**：

   - 复用 `Typing` 页面的 `WordPanel` 组件
   - 使用 `Button`、`Badge`、`Link` 等 UI 组件
   - `Loader2` 用于加载状态显示

3. **数据存储**：
   - 通过 `completeWordReview` 更新 IndexedDB 中的复习记录
   - 通过 `updateWordPracticeCount` 更新单词的练习计数

### 6.2 今日复习模块 (src/pages/review/today)

#### 模块名称及路径

- **模块名称**：今日复习模块
- **主路径**：`src/pages/review/today/+Page.tsx`
- **组件路径**：`src/pages/review/today/components/`

#### 功能说明

该模块展示当天需要复习的单词列表，按照练习次数分组显示，提供复习进度和统计信息。用户可以查看全部单词、未练习单词或已练习单词，并直接跳转到练习页面开始复习。

#### 主要组件及职责

1. **ReviewTodayPage**

   - 主页面组件，显示今日复习单词列表和统计信息
   - 管理标签页切换（全部/未练习/已练习）
   - 提供刷新功能和练习入口

2. **WordCard (src/pages/review/today/components/WordCard.tsx)**

   - 显示单个单词的复习信息
   - 根据练习次数、优先级和进度显示不同的视觉效果
   - 显示单词的复习进度、优先级和下次复习时间

3. **ReviewProgressBar (src/pages/review/today/components/ReviewProgressBar.tsx)**

   - 显示复习进度条
   - 根据完成百分比显示不同颜色

4. **ReviewSummary (src/pages/review/today/components/ReviewSummary.tsx)**

   - 显示复习计划概览
   - 包括计划目标、当前进度和预计完成时间

5. **RoundProgress (src/pages/review/today/components/RoundProgress.tsx)**
   - 显示圆形进度指示器
   - 用于可视化复习轮次进度

#### 模块通信方式

1. **自定义 Hooks**：

   - `useTodayReviews`：获取今日复习单词列表和统计数据
   - `useDailyReviewPlan`：获取每日复习计划

2. **Props 传递**：

   - 将单词数据传递给 `WordCard` 组件
   - 将进度数据传递给 `ReviewProgressBar` 组件
   - 将计划数据传递给 `ReviewSummary` 组件

3. **状态管理**：
   - 使用 React 的 `useState` 和 `useMemo` 管理组件状态
   - 通过 `groupWordsByPracticeCount` 函数按练习次数分组

#### 外部依赖和接口

1. **数据处理函数**：

   - `getUnpracticedWords`/`getPracticedWords`：获取未练习/已练习的单词
   - `groupWordsByPracticeCount`：按练习次数分组单词
   - `areAllWordsPracticed`：检查是否所有单词都已练习
   - `getPracticeStats`：获取练习统计数据

2. **UI 组件**：

   - 使用 `Button`、`Badge`、`Link` 等 UI 组件
   - 自定义组件如 `ReviewNav` 用于导航

3. **路由链接**：
   - 提供到 `/review/practice` 的链接开始练习
   - 根据是否所有单词都已练习，添加不同的 URL 参数

### 6.3 复习历史模块 (src/pages/review/history)

#### 模块名称及路径

- **模块名称**：复习历史模块
- **主路径**：`src/pages/review/history/+Page.tsx`

#### 功能说明

该模块展示用户的复习历史记录和学习进度，包括各种统计数据和图表分析。用户可以按不同时间范围查看历史数据，并按不同条件排序单词。

#### 主要组件及职责

1. **ReviewHistory**

   - 主页面组件，显示复习历史和统计数据
   - 管理时间范围和排序方式
   - 显示历史图表和单词列表

2. **TimeRangeSelector**

   - 时间范围选择器组件
   - 提供不同的时间范围选项（最近 7 天、30 天、3 个月、全部）

3. **HistoryChart**

   - 显示历史复习数据的图表
   - 可视化每日复习量和准确率

4. **WordHistoryCard**

   - 显示单个单词的历史复习记录
   - 包括复习次数、当前等级、连续正确次数等信息

5. **StatCard**
   - 统计数据卡片组件
   - 显示各种统计指标，如总单词数、已复习单词等

#### 模块通信方式

1. **自定义 Hooks**：

   - `useReviewHistory`：获取复习历史记录和统计数据

2. **Props 传递**：

   - 将时间范围传递给 `TimeRangeSelector` 组件
   - 将历史数据传递给 `HistoryChart` 组件
   - 将单词数据传递给 `WordHistoryCard` 组件

3. **状态管理**：
   - 使用 React 的 `useState` 管理组件状态
   - 通过排序函数对单词列表进行排序

#### 外部依赖和接口

1. **数据转换函数**：

   - `toWordRecord`：将 `IWordReviewRecord` 转换为 `WordReviewRecord` 实例

2. **UI 组件**：

   - 使用 `Link` 组件进行导航
   - 自定义组件如 `ReviewNav` 用于导航

3. **数据计算**：
   - 计算记忆强度和等级颜色
   - 生成图表数据

### 6.4 复习设置模块 (src/pages/review/settings)

#### 模块名称及路径

- **模块名称**：复习设置模块
- **主路径**：`src/pages/review/settings/+Page.tsx`

#### 功能说明

该模块允许用户自定义复习计划和学习参数，如每日目标、复习间隔等。用户可以选择预设配置或自定义各项参数，系统会根据设置更新复习计划。

#### 主要组件及职责

1. **ReviewSettings**

   - 主页面组件，显示和管理复习设置
   - 处理设置的保存和重置
   - 管理表单状态和变更检测

2. **ConfigCard**

   - 配置卡片组件，用于分组显示设置项
   - 支持折叠/展开功能

3. **PresetSelector**
   - 预设配置选择器
   - 显示不同的预设配置选项（初学者、标准、高强度、轻松）

#### 模块通信方式

1. **自定义 Hooks**：

   - `useReviewConfig`：获取和更新复习配置

2. **Props 传递**：

   - 将配置应用函数传递给 `PresetSelector` 组件
   - 将标题和子组件传递给 `ConfigCard` 组件

3. **状态管理**：
   - 使用 React 的 `useState` 和 `useEffect` 管理组件状态
   - 跟踪配置变更状态

#### 外部依赖和接口

1. **预设配置**：

   - `PRESET_CONFIGS`：预定义的复习配置集合

2. **配置操作函数**：

   - `updateConfig`：更新复习配置
   - `resetConfig`：重置为默认配置

3. **UI 组件**：
   - 使用 `Link` 组件进行导航
   - 使用表单元素如 `input`、`select` 等

### 6.5 复习仪表板模块 (src/pages/review/dashboard)

#### 模块名称及路径

- **模块名称**：复习仪表板模块
- **主路径**：`src/pages/review/dashboard/+Page.tsx`

#### 功能说明

该模块提供整体学习情况的可视化展示，包括复习进度、统计数据和学习计划。用户可以查看关键学习指标、最近复习进度和今日复习计划。

#### 主要组件及职责

1. **ReviewDashboard**

   - 主页面组件，显示仪表板内容
   - 整合各种统计数据和图表
   - 显示今日复习计划

2. **ProgressChart**

   - 进度图表组件
   - 可视化最近 7 天的复习进度和准确率

3. **StatCard**
   - 统计数据卡片组件
   - 显示各种统计指标，如今日复习、待复习单词等

#### 模块通信方式

1. **自定义 Hooks**：

   - `useReviewStatistics`：获取复习统计数据
   - `useReviewConfig`：获取复习配置
   - `useDailyReviewPlan`：获取每日复习计划

2. **Props 传递**：

   - 将图表数据传递给 `ProgressChart` 组件
   - 将统计数据传递给 `StatCard` 组件

3. **状态管理**：
   - 使用 React 的 `useState` 管理组件状态
   - 处理加载状态和数据展示

#### 外部依赖和接口

1. **统计数据处理**：

   - 处理和格式化统计数据用于展示
   - 计算进度百分比和颜色

2. **UI 组件**：

   - 使用 `ReviewNav` 组件进行导航
   - 使用自定义的图表和卡片组件

3. **日期处理**：
   - 格式化日期用于显示
   - 计算最近 7 天的日期范围

### 6.6 间隔重复系统核心 (src/hooks/useSpacedRepetition.ts)

#### 模块名称及路径

- **模块名称**：间隔重复系统核心
- **主路径**：`src/hooks/useSpacedRepetition.ts`
- **相关路径**：`src/utils/spaced-repetition/`

#### 功能说明

该模块提供间隔重复学习系统的核心功能，包括复习计划生成、单词状态管理、统计数据计算等。它通过自定义 Hooks 向各个页面组件提供数据和功能。

#### 主要 Hooks 及职责

1. **useReviewSchedule**

   - 获取复习计划，包括今日复习、即将到期和逾期的单词
   - 提供刷新计划的功能

2. **useTodayReviews**

   - 获取今日需要复习的单词列表
   - 计算完成进度和统计数据
   - 提供刷新功能

3. **useWordReviewStatus**

   - 获取单个单词的复习状态
   - 计算间隔进度和下次复习时间
   - 提供更新状态的功能

4. **useReviewStatistics**

   - 获取复习统计数据
   - 提供不同日期范围的统计信息

5. **useReviewConfig**

   - 获取和更新复习配置
   - 提供重置配置的功能

6. **useReviewHistory**

   - 获取复习历史记录
   - 按时间范围筛选历史数据

7. **useDailyReviewPlan**
   - 获取每日复习计划
   - 包括紧急复习、正常复习和复习单词等分类

#### 模块通信方式

1. **数据库操作**：

   - 使用 `db` 对象操作 IndexedDB 数据库
   - 查询和更新单词复习记录

2. **工具函数调用**：

   - 调用 `getReviewConfig`、`updateReviewConfig` 等函数
   - 调用 `generateDailyReviewPlan`、`getDueWordsForReview` 等函数

3. **状态管理**：
   - 使用 React 的 `useState`、`useEffect` 和 `useCallback` 管理状态
   - 提供状态更新和刷新功能

#### 外部依赖和接口

1. **数据库模型**：

   - `IReviewConfig`：复习配置接口
   - `IWordReviewRecord`：单词复习记录接口
   - `WordReviewRecord`：单词复习记录类

2. **工具函数**：

   - `initializeTodayReviews`：初始化今日复习数据
   - `areAllWordsPracticed`：检查是否所有单词都已练习
   - `getPracticeStats`：获取练习统计数据

3. **算法函数**：
   - `generateDailyReviewPlan`：生成每日复习计划
   - `getDueWordsForReview`：获取需要复习的单词
   - `getReviewStatistics`：获取复习统计数据

## 7. 核心函数说明

本章节列出项目中的核心函数，包括它们的作用、参数、返回值和执行逻辑。

### 7.1 间隔重复系统核心函数

#### getReviewConfig

- **文件路径**：`src/utils/spaced-repetition/config.ts`
- **函数作用**：获取复习配置，支持缓存以提高性能
- **参数**：
  - `userId?: string` - 用户 ID（可选）
  - `forceRefresh: boolean = false` - 是否强制刷新缓存
- **返回值**：`Promise<IReviewConfig>` - 复习配置对象
- **执行逻辑**：
  1. 检查缓存是否有效，有效则直接返回缓存
  2. 尝试从数据库获取用户特定配置
  3. 如果没有用户特定配置，获取全局默认配置
  4. 如果数据库中没有配置，创建默认配置
  5. 更新缓存并返回配置
- **示例调用**：`const config = await getReviewConfig('user123');`

#### updateReviewConfig

- **文件路径**：`src/utils/spaced-repetition/config.ts`
- **函数作用**：更新复习配置
- **参数**：
  - `updates: Partial<IReviewConfig>` - 配置更新内容
  - `userId?: string` - 用户 ID（可选）
- **返回值**：`Promise<IReviewConfig>` - 更新后的配置对象
- **执行逻辑**：
  1. 获取当前配置
  2. 合并更新内容
  3. 验证配置有效性
  4. 更新同步状态
  5. 保存到数据库
  6. 清除缓存
- **示例调用**：`const updatedConfig = await updateReviewConfig({ dailyReviewTarget: 60 }, 'user123');`

#### generateDailyReviewPlan

- **文件路径**：`src/utils/spaced-repetition/scheduleGenerator.ts`
- **函数作用**：生成每日复习计划，包括需要复习的单词、预估时间和难度等级
- **参数**：
  - `date: Date = new Date()` - 目标日期（默认为当天）
  - `config?: IReviewConfig` - 复习配置（可选）
- **返回值**：`Promise<DailyReviewPlan>` - 每日复习计划对象
- **执行逻辑**：
  1. 获取复习配置
  2. 获取所有单词复习记录
  3. 筛选需要复习的单词和紧急单词
  4. 按逾期时间排序
  5. 分离紧急和普通单词
  6. 计算负载和预估时间
  7. 确定难度等级
- **示例调用**：`const plan = await generateDailyReviewPlan();`

#### getDueWordsForReview

- **文件路径**：`src/utils/spaced-repetition/scheduleGenerator.ts`
- **函数作用**：获取需要复习的单词列表，支持不同的优先级排序方式
- **参数**：
  - `limit?: number` - 限制返回的单词数量（可选）
  - `priorityOrder: ReviewPriorityType = 'urgency'` - 优先级排序方式
- **返回值**：`Promise<IWordReviewRecord[]>` - 需要复习的单词列表
- **执行逻辑**：
  1. 获取复习配置
  2. 查询数据库获取所有单词复习记录
  3. 筛选需要复习的单词（到期或逾期）
  4. 根据指定的优先级方式排序
  5. 如果指定了限制数量，则截取相应数量的单词
- **示例调用**：`const dueWords = await getDueWordsForReview(20, 'urgency');`

#### completeWordReview

- **文件路径**：`src/utils/spaced-repetition/scheduleGenerator.ts`
- **函数作用**：完成单词复习，更新复习记录和下次复习时间
- **参数**：
  - `word: string` - 单词名称
  - `timestamp: number = Date.now()` - 复习时间戳（默认为当前时间）
  - `isFirstReviewOfRound: boolean = true` - 是否为当前轮次的首次复习
- **返回值**：`Promise<void>` - 无返回值
- **执行逻辑**：
  1. 从数据库获取单词复习记录
  2. 如果找不到记录，则抛出错误
  3. 更新复习统计数据（总复习次数、今日复习次数等）
  4. 更新最后复习时间
  5. 如果是首次复习，更新间隔索引和下次复习时间
  6. 保存复习历史记录
  7. 保存更新后的单词复习记录
- **示例调用**：`await completeWordReview('example', Date.now(), true);`

### 7.2 复习练习管理函数

#### initializeTodayReviews

- **文件路径**：`src/utils/reviewRounds.ts`
- **函数作用**：初始化今日复习数据，在每天首次加载时重置所有单词的练习计数
- **参数**：无
- **返回值**：`Promise<IWordReviewRecord[]>` - 今日需要复习的单词列表
- **执行逻辑**：
  1. 获取今日需要复习的单词（未毕业且到期的单词）
  2. 检查是否为新的一天（与上次重置日期比较）
  3. 如果是新的一天，重置所有单词的练习计数
  4. 批量更新数据库
  5. 更新本地存储中的最后重置日期
- **示例调用**：`const todayWords = await initializeTodayReviews();`

#### updateWordPracticeCount

- **文件路径**：`src/utils/reviewRounds.ts`
- **函数作用**：更新单词练习次数
- **参数**：
  - `wordId: string | number` - 单词 ID 或单词名称
  - `incrementCount: boolean = true` - 是否增加计数（默认为 true）
- **返回值**：`Promise<IWordReviewRecord | undefined>` - 更新后的单词记录
- **执行逻辑**：
  1. 根据 ID 类型查询单词记录
  2. 如果找不到记录，则返回 undefined
  3. 确保练习次数字段存在
  4. 如果需要增加计数，则将练习次数加 1
  5. 更新最后练习时间
  6. 保存到数据库
- **示例调用**：`const updatedWord = await updateWordPracticeCount('example', true);`

#### getUnpracticedWords

- **文件路径**：`src/utils/reviewRounds.ts`
- **函数作用**：获取未练习单词列表
- **参数**：
  - `todayWords: IWordReviewRecord[]` - 今日复习单词列表
- **返回值**：`IWordReviewRecord[]` - 未练习的单词列表
- **执行逻辑**：
  1. 调用 `getWordsByPracticeCount` 函数，传入练习次数为 0
  2. 返回筛选后的单词列表
- **示例调用**：`const unpracticedWords = getUnpracticedWords(todayWords);`

#### getPracticedWords

- **文件路径**：`src/utils/reviewRounds.ts`
- **函数作用**：获取已练习单词列表
- **参数**：
  - `todayWords: IWordReviewRecord[]` - 今日复习单词列表
- **返回值**：`IWordReviewRecord[]` - 已练习的单词列表
- **执行逻辑**：
  1. 检查输入参数是否有效
  2. 筛选练习次数大于 0 的单词
  3. 返回筛选后的单词列表
- **示例调用**：`const practicedWords = getPracticedWords(todayWords);`

#### groupWordsByPracticeCount

- **文件路径**：`src/utils/reviewRounds.ts`
- **函数作用**：按练习次数对单词进行分组
- **参数**：
  - `todayWords: IWordReviewRecord[]` - 今日复习单词列表
- **返回值**：`Record<number, IWordReviewRecord[]>` - 按练习次数分组的单词对象
- **执行逻辑**：
  1. 检查输入参数是否有效
  2. 创建空的分组对象
  3. 遍历单词列表，根据练习次数将单词添加到相应的分组
  4. 返回分组对象
- **示例调用**：`const groupedWords = groupWordsByPracticeCount(todayWords);`

#### getPracticeStats

- **文件路径**：`src/utils/reviewRounds.ts`
- **函数作用**：获取今日练习统计
- **参数**：
  - `todayWords: IWordReviewRecord[]` - 今日复习单词列表
- **返回值**：包含统计信息的对象，包括总单词数、未练习单词数、已练习单词数和完成率
- **执行逻辑**：
  1. 检查输入参数是否有效
  2. 获取未练习单词数和已练习单词数
  3. 计算总单词数
  4. 计算完成率（已练习单词数 / 总单词数 \* 100）
  5. 返回统计信息对象
- **示例调用**：`const stats = getPracticeStats(todayWords);`

### 7.3 工具函数

#### AlgorithmUtils.getTodayStart

- **文件路径**：`src/utils/spaced-repetition/index.ts`
- **函数作用**：获取今天的开始时间戳
- **参数**：无
- **返回值**：`number` - 今天开始的时间戳
- **执行逻辑**：
  1. 创建今天的日期对象
  2. 设置时间为 00:00:00.000
  3. 返回时间戳
- **示例调用**：`const todayStart = AlgorithmUtils.getTodayStart();`

#### AlgorithmUtils.getTodayEnd

- **文件路径**：`src/utils/spaced-repetition/index.ts`
- **函数作用**：获取今天的结束时间戳
- **参数**：无
- **返回值**：`number` - 今天结束的时间戳
- **执行逻辑**：
  1. 创建今天的日期对象
  2. 设置时间为 23:59:59.999
  3. 返回时间戳
- **示例调用**：`const todayEnd = AlgorithmUtils.getTodayEnd();`

#### AlgorithmUtils.isToday

- **文件路径**：`src/utils/spaced-repetition/index.ts`
- **函数作用**：检查时间戳是否为今天
- **参数**：
  - `timestamp: number` - 要检查的时间戳
- **返回值**：`boolean` - 是否为今天
- **执行逻辑**：
  1. 创建今天的日期对象
  2. 将时间戳转换为日期对象
  3. 比较两个日期的日期字符串是否相同
- **示例调用**：`const isToday = AlgorithmUtils.isToday(timestamp);`

#### adaptReviewWordsToTypingWords

- **文件路径**：`src/utils/reviewToTypingAdapter.ts`
- **函数作用**：将复习单词转换为打字组件格式
- **参数**：
  - `reviewWords: IWordReviewRecord[]` - 复习单词列表
- **返回值**：`string[]` - 转换后的打字单词列表
- **执行逻辑**：
  1. 遍历复习单词列表
  2. 为每个单词添加元数据标记
  3. 返回转换后的单词列表
- **示例调用**：`const typingWords = adaptReviewWordsToTypingWords(reviewWords);`

#### extractWordNameFromTypingWord

- **文件路径**：`src/utils/reviewToTypingAdapter.ts`
- **函数作用**：从打字单词中提取单词名称
- **参数**：
  - `typingWord: string` - 打字单词（包含元数据）
- **返回值**：`string` - 提取的单词名称
- **执行逻辑**：
  1. 解析打字单词中的元数据
  2. 提取原始单词名称
  3. 返回单词名称
- **示例调用**：`const wordName = extractWordNameFromTypingWord(typingWord);`

## 8. 状态管理逻辑

### 8.1 状态管理方式

项目采用多种状态管理方式相结合的策略，主要包括：

1. **React Hooks (useState/useEffect/useCallback)** - 用于组件局部状态

   - 在各个页面组件中广泛使用，如 `ReviewTodayPage`、`ReviewPracticePage` 等
   - 使用 `useState` 管理组件内部状态，如标签页选择、加载状态、表单数据等
   - 使用 `useEffect` 处理副作用，如数据加载、URL 参数解析等
   - 使用 `useCallback` 优化性能，避免不必要的函数重新创建

2. **自定义 Hooks** - 用于业务逻辑封装和数据获取

   - `useSpacedRepetition.ts` 中定义了多个核心 hooks：
     - `useTodayReviews` - 获取今日需要复习的单词
     - `useReviewConfig` - 获取和更新复习配置
     - `useReviewStatistics` - 获取复习统计数据
     - `useReviewHistory` - 获取复习历史记录
     - `useDailyReviewPlan` - 获取每日复习计划
   - 这些 hooks 封装了数据获取、状态管理和业务逻辑，提供统一接口

3. **Jotai** - 用于全局状态管理

   - 使用 `atom` 和 `atomWithStorage` 创建全局状态原子
   - 通过 `atomForConfig` 自定义函数处理配置类状态，支持默认值和本地存储
   - 使用 `useAtomValue` 和 `useSetAtom` 在组件中读取和更新状态

4. **Context API** - 用于特定功能模块的状态共享

   - 如 `TypingContext` 提供打字相关状态和功能
   - 通过 `useContext` 在组件树中访问共享状态

5. **useReducer + Immer** - 用于复杂状态逻辑
   - 使用 `useImmerReducer` 简化状态更新逻辑
   - 通过 action 类型和 reducer 函数处理状态变更
   - 主要用于打字练习等复杂交互功能

### 8.2 全局状态

项目中的主要全局状态包括：

1. **配置相关状态**

   - `currentDictIdAtom` - 当前词典 ID
   - `currentDictInfoAtom` - 当前词典信息
   - `currentChapterAtom` - 当前章节
   - `loopWordConfigAtom` - 单词循环配置
   - `keySoundsConfigAtom` - 按键音效配置
   - `hintSoundsConfigAtom` - 提示音效配置
   - `pronunciationConfigAtom` - 发音配置
   - `fontSizeConfigAtom` - 字体大小配置
   - `randomConfigAtom` - 随机配置
   - `isOpenDarkModeAtom` - 暗黑模式开关

2. **复习系统状态**

   - `reviewModeInfoAtom` - 复习模式信息
   - `isReviewModeAtom` - 是否处于复习模式
   - `wordDictationConfigAtom` - 单词听写配置

3. **用户界面状态**
   - `isShowPrevAndNextWordAtom` - 是否显示前后单词
   - `isIgnoreCaseAtom` - 是否忽略大小写
   - `isShowAnswerOnHoverAtom` - 是否悬停显示答案
   - `isTextSelectableAtom` - 文本是否可选择
   - `isShowSkipAtom` - 是否显示跳过按钮
   - `infoPanelStateAtom` - 信息面板状态
   - `dismissStartCardDateAtom` - 关闭开始卡片的日期
   - `isSkipFamiliarWordAtom` - 是否跳过熟悉的单词

### 8.3 状态传递方式

项目中状态传递主要通过以下方式：

1. **自定义 Hooks**

   - 封装状态逻辑和数据获取，是主要的状态传递方式
   - 提供统一的接口访问状态和功能
   - 例如：`const { reviews, refreshTodayReviews } = useTodayReviews();`
   - 在复习相关页面中，各组件通过这些 hooks 获取数据和状态

2. **Props 传递**

   - 父组件向子组件传递数据和回调函数
   - 例如：`<WordCard word={word} practiceCount={word.todayPracticeCount} />`
   - 在 `ReviewTodayPage` 中，将单词数据传递给 `WordCard` 组件

3. **Jotai 全局状态**

   - 使用 `useAtomValue` 读取状态：`const currentDict = useAtomValue(currentDictIdAtom);`
   - 使用 `useSetAtom` 更新状态：`const setCurrentDict = useSetAtom(currentDictIdAtom);`
   - 通过 `atomWithStorage` 自动与本地存储同步

4. **Context API 上下文传递**
   - 通过 Provider 组件提供状态：`<TypingContext.Provider value={...}>{children}</TypingContext.Provider>`
   - 使用 `useContext` 消费状态：`const typingContext = useContext(TypingContext);`
   - 支持跨组件层级访问共享状态，避免 props 深度传递
   - 在 `TypingPractice` 组件中使用 `TypingContext` 共享打字状态

### 8.4 数据获取流程

项目中的数据获取主要通过以下流程：

1. **IndexedDB 数据获取**

   - 使用 Dexie.js 操作 IndexedDB 数据库
   - 通过自定义 hooks 封装数据库操作
   - 数据流程：调用 hook → 查询数据库 → 更新状态 → 组件渲染
   - 例如：`useTodayReviews` 内部调用 `initializeTodayReviews` 函数，从数据库获取今日复习单词

2. **复习数据获取流程**

   - 组件挂载时，调用 `useTodayReviews` hook
   - `useTodayReviews` 内部调用 `initializeTodayReviews` 函数
   - `initializeTodayReviews` 查询数据库获取需要复习的单词
   - 检查是否为新的一天，如果是则重置所有单词的练习计数
   - 使用 `getUnpracticedWords`/`getPracticedWords` 筛选单词
   - 更新组件状态，触发重新渲染
   - 组件中使用 `groupWordsByPracticeCount` 对单词进行分组显示

3. **复习设置数据流程**

   - `ReviewSettings` 组件挂载时，调用 `useReviewConfig` hook
   - `useReviewConfig` 内部调用 `getReviewConfig` 函数
   - `getReviewConfig` 首先检查缓存，如果缓存有效则直接返回
   - 否则查询数据库获取用户配置或全局默认配置
   - 如果数据库中没有配置，创建默认配置并保存
   - 更新组件状态，触发重新渲染
   - 用户修改配置后，调用 `updateConfig` 函数保存到数据库

4. **打字练习数据流程**
   - 初始化：设置单词列表 → 创建 TypingProvider → 初始化状态
   - 练习过程：用户输入 → 派发 action → reducer 更新状态 → 组件重新渲染
   - 完成后：更新复习记录 → 保存到数据库 → 显示结果
   - 例如：在 `ReviewPracticePage` 中，用户完成单词后调用 `handleWordComplete`，更新单词练习状态

### 8.5 本地存储使用情况

项目中广泛使用本地存储来持久化用户数据和配置：

1. **IndexedDB 存储**

   - 使用 Dexie.js 库操作 IndexedDB
   - 主要表结构：
     - `wordRecords` - 单词记录
     - `chapterRecords` - 章节记录
     - `reviewRecords` - 复习记录
     - `familiarWords` - 熟悉的单词
     - `wordReviewRecords` - 单词复习记录
     - `reviewHistories` - 复习历史
     - `reviewConfigs` - 复习配置

2. **localStorage 存储**

   - 通过 `atomWithStorage` 自动与 localStorage 同步
   - 存储用户配置和偏好设置
   - 主要项目：
     - `currentDict` - 当前词典
     - `currentChapter` - 当前章节
     - `loopWordConfig` - 单词循环配置
     - `keySoundsConfig` - 按键音效配置
     - `fontsize` - 字体大小配置
     - `isOpenDarkModeAtom` - 暗黑模式设置
     - `LAST_RESET_DATE_KEY` - 上次重置日期（用于每日练习次数重置）

3. **复习相关存储**

   - `lastResetDate` - 存储上次重置练习计数的日期
   - 在 `initializeTodayReviews` 函数中检查是否为新的一天，如果是则重置所有单词的练习计数

4. **配置存储特性**

   - 使用自定义的 `atomForConfig` 函数处理配置存储
   - 支持默认值、类型检查和缺失属性补全
   - 自动与 localStorage 同步
   - 示例：`const fontSizeConfigAtom = atomForConfig("fontsize", defaultFontSizeConfig);`

5. **缓存机制**
   - 复习配置使用内存缓存提高性能
   - `getReviewConfig` 函数实现了缓存逻辑，缓存有效期为 5 分钟
   - 避免频繁查询数据库，提高应用性能

### 8.6 Review 目录下各页面状态管理分析

1. **今日复习页面 (review/today)**

   - 主要使用 `useTodayReviews` 和 `useDailyReviewPlan` hooks 获取数据
   - 使用 `useState` 管理标签页选择状态 (`activeTab`)
   - 使用 `useMemo` 优化数据处理，如分组单词、计算统计信息
   - 通过 props 将单词数据传递给 `WordCard` 组件
   - 通过 URL 参数控制跳转到练习页面时的模式

2. **复习练习页面 (review/practice)**

   - 使用 `useTodayReviews` hook 获取复习数据
   - 使用多个 `useState` 管理界面状态，如选中标签、加载状态、完成弹窗等
   - 使用 `TypingProvider` 和 `TypingContext` 共享打字状态
   - 通过 URL 参数控制显示模式（已练习/未练习单词）
   - 使用回调函数处理单词完成和练习完成事件

3. **复习历史页面 (review/history)**

   - 使用 `useReviewHistory` hook 获取历史数据
   - 使用 `useState` 管理时间范围和排序方式
   - 使用 `useMemo` 计算图表数据和排序单词列表
   - 通过 props 将数据传递给统计卡片和图表组件

4. **复习设置页面 (review/settings)**

   - 使用 `useReviewConfig` hook 获取和更新配置
   - 使用 `useState` 管理本地配置状态和变更检测
   - 实现了配置的保存、重置和预设应用功能
   - 使用表单元素控制各项配置参数

5. **复习仪表板页面 (review/dashboard)**
   - 使用 `useReviewStatistics`、`useReviewConfig` 和 `useDailyReviewPlan` hooks 获取数据
   - 使用加载状态显示骨架屏
   - 生成最近 7 天的复习数据用于图表显示
   - 通过 props 将数据传递给统计卡片和图表组件

## 9. 复习功能用户体验流程

从普通用户的视角，使用复习功能的完整体验流程如下：

### 9.1 复习仪表板页面体验流程

**初始访问体验：**

1. 用户首次访问复习功能，系统默认进入复习仪表板页面 (`/review/dashboard`)
2. 用户看到的界面包括：
   - 顶部导航栏，显示"复习仪表板"、"今日复习"、"复习历史"、"复习设置"等选项
   - 关键指标卡片，包括"今日复习"、"待复习单词"、"总复习次数"、"连续复习天数"
   - 最近 7 天复习进度图表，显示每日复习量和目标数量
   - 复习统计数据，包括总单词数、已复习单词、平均准确率等
   - 今日复习计划，包括紧急复习、正常复习和复习单词等分类

**交互流程：**

1. 用户查看仪表板数据，了解自己的复习情况和今日计划
2. 用户可以点击"开始今日复习"按钮，系统跳转到今日复习页面
3. 用户也可以点击导航栏中的其他选项，如"今日复习"、"复习历史"或"复习设置"

**系统处理：**

1. 页面加载时，系统调用多个 hooks 获取数据：
   - `useReviewStatistics` 获取复习统计数据
   - `useReviewConfig` 获取复习配置
   - `useDailyReviewPlan` 获取每日复习计划
2. 系统从 IndexedDB 数据库读取相关数据，计算统计信息
3. 生成最近 7 天的复习数据用于图表显示
4. 在数据加载过程中显示骨架屏，提升用户体验

**用户反馈：**

1. 用户可以直观地看到自己的复习进度和统计数据
2. 通过图表了解自己最近 7 天的复习情况
3. 了解今日需要复习的单词数量和预估时间
4. 根据仪表板信息决定是否开始今日复习

### 9.2 今日复习页面体验流程

**初始访问体验：**

1. 用户点击导航栏中的"今日复习"或仪表板中的"开始今日复习"按钮，进入今日复习页面 (`/review/today`)
2. 用户看到的界面包括：
   - 顶部导航栏和页面标题
   - 今日进度卡片，显示复习进度、总单词数、未练习单词数、已练习单词数和完成率
   - 复习计划概览，包括计划目标和预计完成时间
   - 单词分类标签页：全部单词、未练习、已练习
   - 按练习次数分组的单词列表

**交互流程：**

1. 用户查看今日需要复习的单词列表
2. 用户可以切换标签页查看不同状态的单词（全部/未练习/已练习）
3. 用户点击"开始练习"或"继续练习"按钮，开始复习练习
4. 如果所有单词都已完成至少一次练习，系统会显示提示信息，用户可以选择继续练习以加深记忆

**系统处理：**

1. 页面加载时，系统调用 `useTodayReviews` 和 `useDailyReviewPlan` hooks 获取数据
2. `useTodayReviews` 内部调用 `initializeTodayReviews` 函数，从数据库获取今日需要复习的单词
3. 系统检查是否为新的一天，如果是则重置所有单词的练习计数
4. 使用 `getUnpracticedWords`/`getPracticedWords` 筛选单词
5. 使用 `groupWordsByPracticeCount` 对单词进行分组
6. 计算练习统计信息，如完成率、未练习单词数等

**用户反馈：**

1. 用户可以看到今日复习的进度和统计信息
2. 单词按练习次数分组显示，便于用户了解复习情况
3. 系统会提示用户是否已完成所有单词的第一次练习
4. 用户可以通过点击按钮直接进入练习页面

**状态更新：**

1. 切换标签页时，页面内容更新显示对应的单词列表
2. 点击"开始练习"按钮时，系统根据当前状态（是否所有单词已练习）添加不同的 URL 参数，跳转到练习页面

### 9.3 复习练习页面体验流程

**初始访问体验：**

1. 用户从今日复习页面点击"开始练习"按钮，进入复习练习页面 (`/review/practice`)
2. 用户看到的界面包括：
   - 进度条，显示整体完成进度
   - 当前练习状态信息，包括进度、正确率和速度
   - 单词显示面板，显示当前需要打字的单词
   - 侧边栏，包括设置面板和练习进度信息

**交互流程：**

1. 用户按任意键开始打字练习
2. 系统显示单词，用户输入对应的单词
3. 输入正确后，系统自动进入下一个单词
4. 完成所有单词后，系统显示完成弹窗，包括练习统计数据
5. 用户可以选择重新开始或返回今日复习页面

**系统处理：**

1. 页面加载时，系统解析 URL 参数，确定显示模式（已练习/未练习单词）
2. 调用 `useTodayReviews` hook 获取复习数据
3. 根据选择的模式筛选单词，并转换为打字组件格式
4. 创建 `TypingProvider` 提供打字状态和功能
5. 监听键盘事件，处理用户输入
6. 单词完成时，调用 `handleWordComplete` 函数，更新单词练习状态
7. 练习完成时，调用 `handleTypingComplete` 函数，显示完成弹窗

**用户反馈：**

1. 用户可以实时看到打字速度、准确率和进度
2. 输入正确的字符会显示绿色，错误的字符显示红色
3. 完成单词后，系统自动进入下一个单词
4. 完成所有单词后，显示练习统计结果，包括准确率、平均用时、连击数等

**状态更新：**

1. 打字过程中，进度条和统计数据实时更新
2. 单词完成时，系统更新单词的练习状态，并移动到下一个单词
3. 练习完成时，系统更新复习记录，保存到数据库
4. 用户可以选择切换练习模式（已练习/未练习），系统会重新加载单词列表

### 9.4 复习历史页面体验流程

**初始访问体验：**

1. 用户点击导航栏中的"复习历史"，进入复习历史页面 (`/review/history`)
2. 用户看到的界面包括：
   - 时间范围选择器（最近 7 天、30 天、3 个月、全部）
   - 排序方式选择（按最近复习、按复习频次、按记忆强度、按复习等级）
   - 统计概览卡片，包括总复习次数、平均准确率、学习天数和掌握单词数
   - 复习趋势图表，显示每日复习数量和准确率
   - 单词历史列表，显示每个单词的复习记录

**交互流程：**

1. 用户选择时间范围查看不同时期的历史数据
2. 用户选择排序方式对单词列表进行排序
3. 用户查看统计概览和趋势图表，了解自己的学习情况
4. 用户查看单词历史列表，了解每个单词的复习情况

**系统处理：**

1. 页面加载时，系统调用 `useReviewHistory` hook 获取历史数据
2. 根据选择的时间范围筛选历史数据
3. 计算统计数据，如总复习次数、平均准确率等
4. 生成趋势图表数据
5. 根据选择的排序方式对单词列表进行排序

**用户反馈：**

1. 用户可以看到不同时间范围的复习统计数据
2. 通过趋势图表了解自己的复习情况变化
3. 查看单词列表，了解每个单词的复习情况和记忆强度

**状态更新：**

1. 切换时间范围时，系统重新加载历史数据，更新统计信息和图表
2. 切换排序方式时，单词列表重新排序
3. 点击单词卡片可以查看该单词的详细复习记录

### 9.5 复习设置页面体验流程

**初始访问体验：**

1. 用户点击导航栏中的"复习设置"，进入复习设置页面 (`/review/settings`)
2. 用户看到的界面包括：
   - 快速配置区域，显示预设配置选项（初学者、标准、高强度、轻松）
   - 核心设置区域，包括每日目标、最大复习数、复习提醒等
   - 间隔设置区域，用于配置复习间隔序列
   - 高级选项区域，包括难度系数、记忆衰减模型等

**交互流程：**

1. 用户可以选择预设配置，快速应用一组配置参数
2. 用户可以手动调整各项设置参数，如每日目标、复习间隔等
3. 修改设置后，系统显示保存提示，用户可以选择保存或取消
4. 用户可以点击重置按钮，恢复默认设置

**系统处理：**

1. 页面加载时，系统调用 `useReviewConfig` hook 获取复习配置
2. 将配置数据显示在表单中
3. 用户修改设置后，系统检测变更并显示保存提示
4. 用户保存设置时，系统调用 `updateConfig` 函数，将配置保存到数据库
5. 用户重置设置时，系统调用 `resetConfig` 函数，恢复默认配置

**用户反馈：**

1. 用户可以看到当前的复习配置参数
2. 修改设置后，系统显示"您有未保存的更改"提示
3. 保存成功后，提示消失，表示设置已应用
4. 重置设置时，系统会显示确认对话框，防止误操作

**状态更新：**

1. 选择预设配置时，表单中的设置参数立即更新
2. 手动修改设置时，系统跟踪变更状态，显示保存提示
3. 保存设置后，配置立即生效，影响复习计划生成
4. 重置设置后，表单恢复为默认值

### 9.6 整体用户流程

**典型的日常复习流程：**

1. **开始复习**

   - 用户访问复习仪表板，查看今日复习计划和统计数据
   - 点击"开始今日复习"按钮，进入今日复习页面

2. **查看复习任务**

   - 在今日复习页面，用户查看需要复习的单词列表
   - 了解复习进度和统计信息
   - 点击"开始练习"按钮，进入复习练习页面

3. **进行复习练习**

   - 在复习练习页面，用户通过打字练习复习单词
   - 系统记录练习状态和成绩
   - 完成所有单词后，显示练习统计结果

4. **查看复习历史**

   - 用户可以访问复习历史页面，查看学习进度
   - 了解复习统计数据和趋势
   - 查看单词的复习情况和记忆强度

5. **调整复习设置**
   - 用户可以访问复习设置页面，根据个人情况调整复习参数
   - 系统根据新设置更新复习计划

这个循环流程帮助用户系统性地学习和巩固英语单词，通过科学的间隔重复复习计划，提高记忆效果和学习效率。

## 10. 复习功能代码质量分析与优化建议

通过对 review 目录下代码的分析，以下是关于代码质量与结构的评估和优化建议：

### 10.1 代码优化建议

#### 10.1.1 冗余与重复逻辑

1. **数据加载状态处理重复**

   - 问题：各页面组件（`ReviewDashboard`、`ReviewTodayPage`、`ReviewPracticePage`等）中的加载状态处理逻辑高度相似
   - 建议：创建一个通用的 `LoadingWrapper` 组件，接收 `loading` 状态和骨架屏配置，减少重复代码

2. **单词过滤逻辑重复**

   - 问题：`getUnpracticedWords`、`getPracticedWords` 等函数在多处被调用，且逻辑相似
   - 建议：将这些函数整合为一个更灵活的函数，如 `filterWordsByCondition`，通过参数控制过滤条件

3. **统计计算逻辑分散**
   - 问题：统计数据计算逻辑分散在 `getPracticeStats`、`getReviewStatistics` 等多个函数中
   - 建议：创建一个统一的统计服务，集中管理所有统计计算逻辑

#### 10.1.2 命名优化

1. **函数命名不一致**

   - 问题：如 `refreshTodayReviews`、`refresh`、`refreshStatus` 等函数名称不统一
   - 建议：统一使用 `refresh{Entity}` 或 `update{Entity}` 的命名模式

2. **变量命名不够明确**

   - 问题：如 `reviews`、`words`、`todayWords` 等变量在不同上下文中表示相似概念
   - 建议：使用更明确的名称，如 `todayReviewWords`、`practicableWords` 等

3. **布尔变量命名**
   - 问题：如 `isLoading`、`loading` 等布尔变量命名不一致
   - 建议：统一使用 `is{State}` 或 `has{Feature}` 的命名模式

#### 10.1.3 代码结构优化

1. **组件拆分**

   - 问题：部分页面组件（如 `ReviewPracticePage`）过于庞大，包含过多状态和逻辑
   - 建议：进一步拆分为更小的子组件，如 `PracticeHeader`、`PracticeControls` 等

2. **逻辑与 UI 分离**

   - 问题：业务逻辑与 UI 渲染混合在组件中
   - 建议：将复杂业务逻辑提取到自定义 hooks 中，保持组件专注于 UI 渲染

3. **配置与常量集中管理**
   - 问题：配置项和常量散布在各个文件中
   - 建议：创建集中的配置文件，如 `reviewConstants.ts`，统一管理所有复习相关常量

### 10.2 注释与文档完善

1. **函数文档注释不完整**

   - 问题：部分核心函数（如 `completeWordReview`、`updateWordReviewSchedule` 等）缺乏详细的参数和返回值说明
   - 建议：为所有核心函数添加完整的 JSDoc 注释，包括参数类型、返回值和示例用法

2. **复杂逻辑缺乏注释**

   - 问题：间隔重复算法的核心逻辑（如 `completeReview` 方法）缺乏详细的实现说明
   - 建议：添加算法原理和实现步骤的详细注释，便于理解和维护

3. **组件职责说明不足**
   - 问题：部分组件（如 `WordCard`、`ReviewProgressBar` 等）缺乏明确的职责说明
   - 建议：在组件顶部添加注释，说明组件的职责、接收的 props 和使用场景

### 10.3 模块解耦分析

1. **数据获取与 UI 耦合**

   - 问题：页面组件直接调用数据库操作函数，增加了组件与数据层的耦合
   - 建议：创建数据服务层，封装所有数据操作，组件通过服务层获取数据

2. **状态管理混合使用**

   - 问题：同时使用多种状态管理方式（React Hooks、Jotai、Context API），增加了理解和维护成本
   - 建议：统一状态管理策略，对全局状态使用 Jotai，局部状态使用 React Hooks

3. **打字功能与复习功能耦合**
   - 问题：复习练习页面直接依赖于 Typing 页面的组件和状态，增加了跨模块依赖
   - 建议：提取共享的打字功能为独立模块，复习和打字页面共同依赖该模块

### 10.4 潜在问题与易混淆逻辑

1. **异步状态管理不完善**

   - 问题：部分异步操作（如数据库更新）缺乏完整的错误处理和状态管理
   - 建议：使用 `try-catch-finally` 模式处理所有异步操作，确保 UI 状态一致性

2. **日期处理逻辑分散**

   - 问题：日期处理逻辑散布在多个文件中，使用不同的方法（如 `Date.now()`、`new Date().toISOString()` 等）
   - 建议：创建统一的日期工具函数，集中处理所有日期相关操作

3. **缓存失效处理不完善**

   - 问题：配置缓存（如 `configCache`）的失效机制过于简单，可能导致数据不一致
   - 建议：实现更完善的缓存管理，包括基于事件的缓存失效和手动刷新机制

4. **练习完成逻辑可能存在竞态条件**
   - 问题：`handleWordComplete` 和 `handleTypingComplete` 函数中的异步操作可能导致竞态条件
   - 建议：使用状态锁或取消令牌确保异步操作的顺序执行

### 10.5 具体优化示例

#### 示例 1：提取通用加载组件

```tsx
// 优化前：每个页面重复的加载状态处理
if (loading) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    </div>
  );
}

// 优化后：通用加载组件
function LoadingWrapper({ loading, children, message = "加载中..." }) {
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    );
  }
  return children;
}

// 使用示例
<LoadingWrapper loading={loading}>
  <ReviewContent />
</LoadingWrapper>
```

#### 示例 2：优化单词过滤逻辑

```typescript
// 优化前：多个相似函数
export function getUnpracticedWords(
  todayWords: IWordReviewRecord[]
): IWordReviewRecord[] {
  if (!todayWords || todayWords.length === 0) return [];
  return todayWords.filter(
    (word) => !word.todayPracticeCount || word.todayPracticeCount === 0
  );
}

export function getPracticedWords(
  todayWords: IWordReviewRecord[]
): IWordReviewRecord[] {
  if (!todayWords || todayWords.length === 0) return [];
  return todayWords.filter(
    (word) => word.todayPracticeCount && word.todayPracticeCount > 0
  );
}

// 优化后：统一的过滤函数
export function filterWordsByCondition(
  words: IWordReviewRecord[],
  condition: "practiced" | "unpracticed" | "all",
  practiceCount?: number
): IWordReviewRecord[] {
  if (!words || words.length === 0) return [];

  switch (condition) {
    case "practiced":
      return words.filter(
        (word) =>
          word.todayPracticeCount &&
          word.todayPracticeCount > (practiceCount || 0)
      );
    case "unpracticed":
      return words.filter(
        (word) => !word.todayPracticeCount || word.todayPracticeCount === 0
      );
    case "all":
    default:
      return words;
  }
}

// 使用示例
const unpracticedWords = filterWordsByCondition(todayWords, "unpracticed");
const practicedWords = filterWordsByCondition(todayWords, "practiced");
const practicedTwiceWords = filterWordsByCondition(todayWords, "practiced", 1);
```

#### 示例 3：提取业务逻辑到自定义 hooks

```tsx
// 优化前：组件中混合UI和业务逻辑
export default function ReviewPracticePage() {
  const { reviews } = useTodayReviews();
  const [selectedTab, setSelectedTab] = useState('unpracticed');
  const [typingWords, setTypingWords] = useState<string[]>([]);

  useEffect(() => {
    // 根据选择的标签筛选单词
    let filteredWords = [];
    if (selectedTab === 'unpracticed') {
      filteredWords = getUnpracticedWords(reviews);
    } else {
      filteredWords = getPracticedWords(reviews);
    }

    // 转换为打字组件格式
    const words = adaptReviewWordsToTypingWords(filteredWords);
    setTypingWords(words);
  }, [reviews, selectedTab]);

  // 更多业务逻辑...

  return (
    // UI渲染...
  );
}

// 优化后：提取业务逻辑到自定义hook
function useReviewPractice(initialTab = 'unpracticed') {
  const { reviews, refreshTodayReviews } = useTodayReviews();
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [typingWords, setTypingWords] = useState<string[]>([]);
  const [wordMetadata, setWordMetadata] = useState<IWordReviewRecord[]>([]);

  useEffect(() => {
    // 根据选择的标签筛选单词
    let filteredWords = filterWordsByCondition(reviews, selectedTab as any);
    setWordMetadata(filteredWords);

    // 转换为打字组件格式
    const words = adaptReviewWordsToTypingWords(filteredWords);
    setTypingWords(words);
  }, [reviews, selectedTab]);

  const handleWordComplete = useCallback(async (word: string, isCorrect: boolean) => {
    // 处理单词完成逻辑
    // ...
  }, [refreshTodayReviews]);

  return {
    typingWords,
    wordMetadata,
    selectedTab,
    setSelectedTab,
    handleWordComplete,
    // 其他需要的状态和函数
  };
}

// 组件变得更简洁
export default function ReviewPracticePage() {
  const {
    typingWords,
    selectedTab,
    setSelectedTab,
    handleWordComplete,
    // ...
  } = useReviewPractice();

  return (
    // 专注于UI渲染...
  );
}
```

### 10.6 总结

review 目录下的代码整体结构清晰，功能实现完整，但存在一些可优化的空间。主要优化方向包括：

1. **减少重复代码**：提取通用组件和函数，避免逻辑重复
2. **统一命名规范**：保持函数、变量命名的一致性
3. **加强模块解耦**：分离数据层、业务逻辑层和 UI 层
4. **完善错误处理**：增强异步操作的错误处理和状态管理
5. **增加文档注释**：为核心函数和复杂逻辑添加详细注释

通过这些优化，可以提高代码的可维护性、可读性和可扩展性，减少潜在 bug 的出现，并降低后续开发和维护的成本。
