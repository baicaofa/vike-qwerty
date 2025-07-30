#!/usr/bin/env node

/**
 * 性能检查脚本
 * 用于分析运行时性能和识别性能瓶颈
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

function analyzePerformance() {
  log('🚀 开始性能分析...', 'cyan');
  
  // 检查文件大小
  const srcDir = path.join(process.cwd(), 'src');
  const largeFiles = [];
  
  function scanForLargeFiles(dir, relativePath = '') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativeItemPath = path.join(relativePath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        scanForLargeFiles(fullPath, relativeItemPath);
      } else if (stats.size > 50 * 1024) { // 大于 50KB
        largeFiles.push({
          path: relativeItemPath,
          size: stats.size,
          formattedSize: formatBytes(stats.size)
        });
      }
    });
  }
  
  scanForLargeFiles(srcDir);
  
  if (largeFiles.length > 0) {
    log('\n📁 发现大型文件:', 'yellow');
    largeFiles.sort((a, b) => b.size - a.size).forEach(file => {
      log(`  ${file.path}: ${file.formattedSize}`, 'reset');
    });
  }
  
  // 检查导入模式
  log('\n🔍 检查导入模式...', 'cyan');
  
  const problematicImports = [];
  const wildcardImports = [];
  
  function scanImports(dir, relativePath = '') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativeItemPath = path.join(relativePath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        scanImports(fullPath, relativeItemPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // 检查通配符导入
          const wildcardMatch = content.match(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g);
          if (wildcardMatch) {
            wildcardImports.push({
              file: relativeItemPath,
              imports: wildcardMatch
            });
          }
          
          // 检查大型库的导入
          const largeLibs = ['echarts', 'lucide-react', '@radix-ui'];
          largeLibs.forEach(lib => {
            if (content.includes(`from '${lib}'`) || content.includes(`from "${lib}"`)) {
              problematicImports.push({
                file: relativeItemPath,
                library: lib
              });
            }
          });
        } catch (error) {
          // 忽略读取错误
        }
      }
    });
  }
  
  scanImports(srcDir);
  
  if (wildcardImports.length > 0) {
    log('\n⚠️  发现通配符导入:', 'yellow');
    wildcardImports.forEach(item => {
      log(`  ${item.file}:`, 'reset');
      item.imports.forEach(imp => {
        log(`    ${imp}`, 'cyan');
      });
    });
  }
  
  if (problematicImports.length > 0) {
    log('\n⚠️  发现大型库导入:', 'yellow');
    const grouped = problematicImports.reduce((acc, item) => {
      if (!acc[item.library]) acc[item.library] = [];
      acc[item.library].push(item.file);
      return acc;
    }, {});
    
    Object.entries(grouped).forEach(([lib, files]) => {
      log(`  ${lib}:`, 'reset');
      files.forEach(file => {
        log(`    ${file}`, 'cyan');
      });
    });
  }
  
  // 检查 useEffect 使用
  log('\n🔍 检查 useEffect 使用...', 'cyan');
  
  const useEffectFiles = [];
  
  function scanUseEffects(dir, relativePath = '') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativeItemPath = path.join(relativePath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        scanUseEffects(fullPath, relativeItemPath);
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const useEffectMatches = content.match(/useEffect\(/g);
          
          if (useEffectMatches && useEffectMatches.length > 3) {
            useEffectFiles.push({
              file: relativeItemPath,
              count: useEffectMatches.length
            });
          }
        } catch (error) {
          // 忽略读取错误
        }
      }
    });
  }
  
  scanUseEffects(srcDir);
  
  if (useEffectFiles.length > 0) {
    log('\n⚠️  发现大量 useEffect 的文件:', 'yellow');
    useEffectFiles.sort((a, b) => b.count - a.count).forEach(item => {
      log(`  ${item.file}: ${item.count} 个 useEffect`, 'reset');
    });
  }
  
  // 检查依赖项
  log('\n📦 检查依赖项...', 'cyan');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const dependencies = Object.keys(packageJson.dependencies || {});
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      
      log(`  生产依赖: ${dependencies.length} 个`, 'reset');
      log(`  开发依赖: ${devDependencies.length} 个`, 'reset');
      
      // 检查大型依赖
      const largeDeps = [
        'echarts', 'lucide-react', '@radix-ui', 'react-helmet-async',
        'howler', 'html-to-image', 'xlsx', 'dexie'
      ];
      
      const foundLargeDeps = largeDeps.filter(dep => 
        dependencies.includes(dep) || devDependencies.includes(dep)
      );
      
      if (foundLargeDeps.length > 0) {
        log('\n⚠️  发现大型依赖:', 'yellow');
        foundLargeDeps.forEach(dep => {
          log(`  ${dep}`, 'reset');
        });
      }
    } catch (error) {
      log('  ❌ 无法解析 package.json', 'red');
    }
  }
  
  // 提供优化建议
  log('\n💡 性能优化建议:', 'green');
  
  if (largeFiles.length > 0) {
    log('  • 大型文件优化:', 'yellow');
    log('    - 考虑代码分割', 'reset');
    log('    - 使用懒加载', 'reset');
    log('    - 优化导入', 'reset');
  }
  
  if (wildcardImports.length > 0) {
    log('  • 导入优化:', 'yellow');
    log('    - 替换通配符导入为具体导入', 'reset');
    log('    - 使用 Tree Shaking', 'reset');
    log('    - 考虑按需导入', 'reset');
  }
  
  if (useEffectFiles.length > 0) {
    log('  • React 优化:', 'yellow');
    log('    - 合并相关的 useEffect', 'reset');
    log('    - 优化依赖数组', 'reset');
    log('    - 使用 useMemo 和 useCallback', 'reset');
  }
  
  log('  • 通用优化建议:', 'yellow');
  log('    - 启用代码分割', 'reset');
  log('    - 使用动态导入', 'reset');
  log('    - 优化图片和字体', 'reset');
  log('    - 启用 Gzip 压缩', 'reset');
  log('    - 使用 CDN', 'reset');
  log('    - 优化第三方库加载', 'reset');
  
  log('\n✅ 性能分析完成', 'green');
}

// 运行分析
analyzePerformance();