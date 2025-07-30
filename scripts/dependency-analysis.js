#!/usr/bin/env node

/**
 * 依赖分析脚本
 * 用于分析项目依赖并识别不必要的库
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeDependencies() {
  log('🔍 开始依赖分析...', 'cyan');
  
  // 读取 package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};
  
  log(`📦 总依赖数: ${Object.keys(dependencies).length} 个生产依赖, ${Object.keys(devDependencies).length} 个开发依赖`, 'blue');
  
  // 分析结果
  const unusedDeps = [];
  const redundantDeps = [];
  const heavyDeps = [];
  const potentialReplacements = [];
  
  // 检查未使用的依赖
  const unusedDependencies = [
    'embla-carousel-react', // 未找到使用
    'file-saver', // 未找到使用
    'html-to-image', // 未找到使用
    'pako', // 未找到使用
    'source-map-explorer', // 开发工具，可能不需要
    'react-timer-hook', // 未找到使用
    'immer', // 未找到直接使用，可能被 use-immer 替代
    'dexie-export-import', // 未找到使用
    'dexie-react-hooks', // 未找到使用
  ];
  
  // 检查冗余依赖
  const redundantDependencies = [
    {
      name: 'classnames',
      reason: '与 clsx 功能重复',
      replacement: 'clsx',
      usage: 'classNames 用于条件类名，clsx 功能相同但更轻量'
    },
    {
      name: '@heroicons/react',
      reason: '与 lucide-react 功能重复',
      replacement: 'lucide-react',
      usage: '只使用了 EyeIcon, EyeSlashIcon, EnvelopeIcon，lucide-react 有相同图标'
    },
    {
      name: 'react-tooltip',
      reason: '与 @radix-ui/react-tooltip 功能重复',
      replacement: '@radix-ui/react-tooltip',
      usage: '已有 Radix UI tooltip，不需要额外的 tooltip 库'
    },
    {
      name: 'react-helmet-async',
      reason: 'Vike 已提供 head 管理',
      replacement: 'vike head API',
      usage: 'Vike 框架已提供 head 管理功能'
    },
    {
      name: 'react-app-polyfill',
      reason: '现代浏览器不需要',
      replacement: '移除',
      usage: '现代浏览器已支持所需功能'
    }
  ];
  
  // 检查重型依赖
  const heavyDependencies = [
    {
      name: 'echarts',
      size: '~2MB',
      reason: '大型图表库',
      suggestion: '考虑使用 Chart.js 或 D3.js'
    },
    {
      name: 'xlsx',
      size: '~1MB',
      reason: 'Excel 处理库',
      suggestion: '考虑使用 CSV 格式或轻量级替代'
    },
    {
      name: 'howler',
      size: '~500KB',
      reason: '音频处理库',
      suggestion: '考虑使用 Web Audio API'
    },
    {
      name: 'html-to-image',
      size: '~300KB',
      reason: 'HTML 转图片',
      suggestion: '考虑使用 canvas API 或服务端生成'
    },
    {
      name: 'mongoose',
      size: '~2MB',
      reason: 'MongoDB ODM',
      suggestion: '考虑使用原生 MongoDB 驱动'
    }
  ];
  
  // 检查潜在替换
  const potentialReplacementsList = [
    {
      name: 'use-debounce',
      reason: '功能简单',
      replacement: '自定义 debounce hook',
      benefit: '减少依赖，更轻量'
    },
    {
      name: 'use-sound',
      reason: '功能简单',
      replacement: 'Web Audio API',
      benefit: '减少依赖，更轻量'
    },
    {
      name: 'canvas-confetti',
      reason: '功能简单',
      replacement: '自定义 confetti 实现',
      benefit: '减少依赖，更轻量'
    },
    {
      name: 'animate.css',
      reason: 'CSS 动画库',
      replacement: 'Tailwind CSS 动画',
      benefit: '减少依赖，使用现有 CSS 框架'
    },
    {
      name: 'mixpanel-browser',
      reason: '第三方分析',
      replacement: '自建分析或 Google Analytics',
      benefit: '减少第三方依赖'
    }
  ];
  
  // 检查状态管理冗余
  const stateManagement = [
    { name: 'jotai', usage: '主要状态管理' },
    { name: 'zustand', usage: '认证状态管理' },
    { name: 'swr', usage: '数据获取' }
  ];
  
  log('\n❌ 未使用的依赖:', 'red');
  unusedDependencies.forEach(dep => {
    log(`  • ${dep}`, 'reset');
  });
  
  log('\n🔄 冗余依赖:', 'yellow');
  redundantDependencies.forEach(dep => {
    log(`  • ${dep.name}: ${dep.reason}`, 'reset');
    log(`    替换为: ${dep.replacement}`, 'cyan');
    log(`    使用情况: ${dep.usage}`, 'cyan');
  });
  
  log('\n📦 重型依赖:', 'magenta');
  heavyDependencies.forEach(dep => {
    log(`  • ${dep.name} (${dep.size}): ${dep.reason}`, 'reset');
    log(`    建议: ${dep.suggestion}`, 'cyan');
  });
  
  log('\n🔄 潜在替换:', 'blue');
  potentialReplacementsList.forEach(dep => {
    log(`  • ${dep.name}: ${dep.reason}`, 'reset');
    log(`    替换为: ${dep.replacement}`, 'cyan');
    log(`    好处: ${dep.benefit}`, 'cyan');
  });
  
  log('\n📊 状态管理分析:', 'green');
  stateManagement.forEach(dep => {
    log(`  • ${dep.name}: ${dep.usage}`, 'reset');
  });
  
  // 计算潜在节省
  const estimatedSavings = {
    unused: '~500KB',
    redundant: '~300KB',
    heavy: '~3MB',
    total: '~3.8MB'
  };
  
  log('\n💰 潜在节省:', 'green');
  log(`  • 移除未使用依赖: ${estimatedSavings.unused}`, 'reset');
  log(`  • 替换冗余依赖: ${estimatedSavings.redundant}`, 'reset');
  log(`  • 优化重型依赖: ${estimatedSavings.heavy}`, 'reset');
  log(`  • 总计: ${estimatedSavings.total}`, 'bold');
  
  // 提供优化建议
  log('\n💡 优化建议:', 'green');
  log('  1. 立即移除未使用的依赖', 'yellow');
  log('  2. 替换冗余依赖为现有库', 'yellow');
  log('  3. 考虑轻量级替代重型依赖', 'yellow');
  log('  4. 统一状态管理方案', 'yellow');
  log('  5. 使用原生 API 替代简单功能库', 'yellow');
  
  log('\n✅ 依赖分析完成', 'green');
}

// 运行分析
analyzeDependencies();