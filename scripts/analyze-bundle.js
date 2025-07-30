#!/usr/bin/env node
// @ts-check

/**
 * Bundle 分析脚本
 * 用于分析打包后的文件大小和依赖关系
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 颜色输出
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function analyzeBundle() {
  log("🔍 开始分析 Bundle 大小...", "cyan");

  const buildDir = path.join(process.cwd(), "build");
  const distDir = path.join(process.cwd(), "dist");

  if (!fs.existsSync(buildDir) && !fs.existsSync(distDir)) {
    log("❌ 未找到构建目录，请先运行 yarn build", "red");
    return;
  }

  const targetDir = fs.existsSync(buildDir) ? buildDir : distDir;
  log(`📁 分析目录: ${targetDir}`, "blue");

  // 分析 JavaScript 文件
  const jsFiles = [];
  const cssFiles = [];
  const otherFiles = [];

  function scanDirectory(dir, relativePath = "") {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const relativeItemPath = path.join(relativePath, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        scanDirectory(fullPath, relativeItemPath);
      } else {
        const size = stats.size;
        const fileInfo = {
          name: relativeItemPath,
          size,
          formattedSize: formatBytes(size),
        };

        if (item.endsWith(".js")) {
          jsFiles.push(fileInfo);
        } else if (item.endsWith(".css")) {
          cssFiles.push(fileInfo);
        } else {
          otherFiles.push(fileInfo);
        }
      }
    });
  }

  scanDirectory(targetDir);

  // 排序并显示结果
  function displayFileList(files, title, color) {
    if (files.length === 0) return;

    log(`\n${title}:`, color);
    const sortedFiles = files.sort((a, b) => b.size - a.size);

    sortedFiles.forEach((file) => {
      log(`  ${file.name}: ${file.formattedSize}`, "reset");
    });

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    log(`  总计: ${formatBytes(totalSize)}`, "bold");
  }

  displayFileList(jsFiles, "📦 JavaScript 文件", "yellow");
  displayFileList(cssFiles, "🎨 CSS 文件", "magenta");
  displayFileList(otherFiles, "📄 其他文件", "blue");

  const totalSize = [...jsFiles, ...cssFiles, ...otherFiles].reduce(
    (sum, file) => sum + file.size,
    0
  );
  log(
    `\n📊 总 Bundle 大小: ${colors.bold}${formatBytes(totalSize)}${
      colors.reset
    }`,
    "green"
  );

  // 分析最大的文件
  const allFiles = [...jsFiles, ...cssFiles, ...otherFiles].sort(
    (a, b) => b.size - a.size
  );
  if (allFiles.length > 0) {
    log("\n🔍 最大的文件:", "cyan");
    allFiles.slice(0, 5).forEach((file, index) => {
      log(`  ${index + 1}. ${file.name}: ${file.formattedSize}`, "reset");
    });
  }

  // 检查是否有重复的依赖
  log("\n🔍 检查重复依赖...", "cyan");
  try {
    const packageLockPath = path.join(process.cwd(), "yarn.lock");
    if (fs.existsSync(packageLockPath)) {
      const packageLock = fs.readFileSync(packageLockPath, "utf8");
      const duplicatePattern = /^(\S+@[^:]+):\s*$/gm;
      const duplicates = new Set();
      let match;

      while ((match = duplicatePattern.exec(packageLock)) !== null) {
        const packageName = match[1].split("@")[0];
        if (duplicates.has(packageName)) {
          log(`  ⚠️  可能的重复依赖: ${packageName}`, "yellow");
        } else {
          duplicates.add(packageName);
        }
      }
    }
  } catch (error) {
    log("  ❌ 无法分析依赖重复", "red");
  }

  // 提供优化建议
  log("\n💡 优化建议:", "green");

  if (totalSize > 1024 * 1024) {
    // 大于 1MB
    log("  • Bundle 大小超过 1MB，建议:", "yellow");
    log("    - 启用代码分割 (Code Splitting)", "reset");
    log("    - 使用动态导入 (Dynamic Import)", "reset");
    log("    - 优化第三方库导入", "reset");
  }

  const largeJsFiles = jsFiles.filter((file) => file.size > 100 * 1024); // 大于 100KB
  if (largeJsFiles.length > 0) {
    log("  • 发现大型 JS 文件，建议:", "yellow");
    largeJsFiles.forEach((file) => {
      log(`    - 分析 ${file.name} 的依赖`, "reset");
    });
  }

  log("  • 通用优化建议:", "yellow");
  log("    - 启用 Gzip/Brotli 压缩", "reset");
  log("    - 使用 CDN 加载第三方库", "reset");
  log("    - 优化图片和字体资源", "reset");
  log("    - 启用 Tree Shaking", "reset");
}

// 运行分析
analyzeBundle();
