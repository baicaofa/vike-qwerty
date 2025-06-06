# 自定义文章上传功能文档

## 功能概述

自定义文章上传功能允许用户上传自己的文本内容进行打字练习，整个流程分为三个步骤：添加文本、文本预处理和打字练习。该功能完全在本地运行，数据保存在浏览器的 IndexedDB 中，不需要网络连接或云端同步。

## 技术实现

### 数据模型

```typescript
// 自定义文章
interface CustomArticle {
  id?: number; // 数据库ID
  uuid?: string; // 唯一标识符
  title: string; // 文章标题
  content: string; // 文章内容
  createdAt: number; // 创建时间
  lastPracticedAt?: number; // 最后练习时间
}

// 文章段落
interface ArticleSegment {
  text: string; // 段落文本
  index: number; // 段落索引
}

// 分段类型
type SegmentationType = "sentence" | "paragraph" | "custom";

// 预处理设置
interface PreprocessSettings {
  segmentationType: SegmentationType; // 分段方式
  customSegmentLength?: number; // 自定义分段长度
  repetitionEnabled: boolean; // 启用重复练习
  repetitionCount: number; // 重复次数
  speedTarget?: number; // 目标速度(WPM)
  focusMode: boolean; // 专注模式
  simplifyPunctuation: boolean; // 简化标点
}
```

### 数据存储

文章数据存储在 IndexedDB 中的`articleRecords`表中，表结构如下：

```
articleRecords: "++id, &uuid, title, createdAt, lastPracticedAt"
```

### 流程设计

1. **添加文本**：

   - 用户输入或粘贴文本内容
   - 系统验证文本长度（上限 3000 字符）
   - 文本内容保存在应用状态中

2. **文本预处理**：

   - 选择分段方式（句子、段落、自定义长度）
   - 配置重复练习设置
   - 设置速度目标（可选）
   - 选择是否启用专注模式
   - 选择是否简化标点符号
   - 系统根据设置处理文本并预览效果

3. **打字练习**：
   - 显示当前段落及进度
   - 用户进行打字练习
   - 实时显示速度、准确率和用时
   - 练习完成后显示结果统计
   - 可选择保存文章到本地数据库

## 用户界面

### 第一步：添加文本

- 文本输入框
- 字符计数器（0/3000）
- "清空"和"下一步"按钮

### 第二步：文本预处理

- 分段方式选择
- 重复练习设置
- 速度目标设置
- 专注模式开关
- 简化标点开关
- 文本预览区域
- "返回"和"开始练习"按钮

### 第三步：打字练习

- 统计信息显示（段落进度、速度、准确率、用时）
- 文本显示区域（高亮当前字符和错误）
- 打字输入框
- 控制按钮（开始、暂停、继续、重新开始、返回设置）
- 练习完成后显示结果统计和"保存文章"按钮

## 使用说明

1. 在主页面导航中点击"自定义文章"进入功能页面
2. 输入或粘贴想要练习的文本内容（最多 3000 字符）
3. 点击"下一步"进入预处理设置页面
4. 根据需要调整分段和练习设置，点击"开始练习"
5. 在练习页面中点击"开始"按钮开始打字练习
6. 练习完成后可以查看统计结果并选择保存文章

## 技术依赖

- React (函数组件和 Hooks)
- Dexie.js (IndexedDB 封装库)
- use-immer (状态管理)
- TailwindCSS (样式)

## 未来扩展计划

- 添加文章管理页面，显示所有保存的文章
- 提供更多文本预处理选项，如自动纠正、难度评估
- 增加详细的错误分析和练习报告
- 支持文章的导入/导出功能
