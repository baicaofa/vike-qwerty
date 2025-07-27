/**
 * Vike框架类型扩展
 * 扩展PageContext接口以包含自定义属性
 */

declare global {
  namespace Vike {
    interface PageContext {
      // 多语言支持
      locale?: string;
      urlLogical?: string;
    }
  }
}

export {};
