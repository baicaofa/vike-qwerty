/**
 * 懒加载工具
 * 用于延迟加载重型组件和库，提升初始加载性能
 */
import type { ComponentType } from "react";
import React, { Suspense, lazy } from "react";

/**
 * 创建懒加载组件包装器
 * @param importFn - 动态导入函数
 * @param fallback - 加载时的占位组件
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback: React.ReactNode = null
) {
  const LazyComponent = lazy(importFn);

  const LazyWrapper = (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );

  // 添加 display name
  LazyWrapper.displayName = "LazyWrapper";

  return LazyWrapper;
}

/**
 * 懒加载 ECharts 组件
 */
export const LazyECharts = createLazyComponent(
  () => import("../pages/Analysis/components/LineCharts"),
  React.createElement(
    "div",
    { className: "flex items-center justify-center h-64" },
    React.createElement("div", {
      className:
        "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600",
    })
  )
);

/**
 * 动态导入工具函数
 * @param modulePath - 模块路径
 * @param timeout - 超时时间（毫秒）
 */
export async function dynamicImport<T>(
  modulePath: string,
  timeout = 5000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error(`Import timeout: ${modulePath}`)),
      timeout
    );
  });

  try {
    const module = await Promise.race([import(modulePath), timeoutPromise]);
    return module as T;
  } catch (error) {
    console.error(`Failed to load module: ${modulePath}`, error);
    throw error;
  }
}

/**
 * 预加载关键模块
 */
export function preloadCriticalModules() {
  // 预加载核心模块
  const criticalModules = [
    () => import("../store"),
    () => import("../utils/index"),
    () => import("../hooks/useAuthRequired"),
  ];

  // 在空闲时间预加载
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      criticalModules.forEach((importFn) => {
        importFn().catch(console.warn);
      });
    });
  } else {
    // 降级到 setTimeout
    setTimeout(() => {
      criticalModules.forEach((importFn) => {
        importFn().catch(console.warn);
      });
    }, 1000);
  }
}

/**
 * 条件加载工具
 * @param condition - 加载条件
 * @param importFn - 动态导入函数
 */
export function conditionalImport<T>(
  condition: boolean,
  importFn: () => Promise<T>
): Promise<T | null> {
  if (!condition) {
    return Promise.resolve(null);
  }
  return importFn();
}

/**
 * 批量懒加载组件
 */
export const LazyComponents = {
  // 分析页面组件
  Analysis: createLazyComponent(
    () =>
      import("../pages/Analysis/+Page").then((module) => ({
        default: module.Page,
      })),
    React.createElement(
      "div",
      { className: "flex items-center justify-center h-64" },
      React.createElement("div", {
        className:
          "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600",
      })
    )
  ),

  // 错误本页面组件
  ErrorBook: createLazyComponent(
    () =>
      import("../pages/ErrorBook/+Page").then((module) => ({
        default: module.Page,
      })),
    React.createElement(
      "div",
      { className: "flex items-center justify-center h-64" },
      React.createElement("div", {
        className:
          "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600",
      })
    )
  ),

  // 画廊页面组件
  Gallery: createLazyComponent(
    () =>
      import("../pages/gallery/+Page").then((module) => ({
        default: module.default,
      })),
    React.createElement(
      "div",
      { className: "flex items-center justify-center h-64" },
      React.createElement("div", {
        className:
          "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600",
      })
    )
  ),

  // 自定义文章组件
  CustomArticle: createLazyComponent(
    () =>
      import("../pages/CustomArticle/+Page").then((module) => ({
        default: module.Page,
      })),
    React.createElement(
      "div",
      { className: "flex items-center justify-center h-64" },
      React.createElement("div", {
        className:
          "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600",
      })
    )
  ),
};
