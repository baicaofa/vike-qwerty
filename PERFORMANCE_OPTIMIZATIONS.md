# Performance Optimizations

This document outlines the performance optimizations implemented in the Keybr codebase to improve bundle size, load times, and runtime performance.

## 🚀 Bundle Size Optimizations

### 1. Vite Configuration Optimizations

- **Enabled Production Minification**: Configured Terser for production builds
- **Code Splitting**: Implemented manual chunks for better caching
- **Tree Shaking**: Enabled for unused code elimination
- **Source Maps**: Disabled in production for smaller bundle size
- **Dependency Pre-building**: Optimized for faster builds

```typescript
// vite.config.ts optimizations
build: {
  minify: isProduction ? "terser" : false,
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'ui-vendor': ['@radix-ui/*', '@headlessui/react'],
        'charts-vendor': ['echarts'],
        'utils-vendor': ['dayjs', 'clsx', 'class-variance-authority'],
        'state-vendor': ['jotai', 'zustand', 'swr'],
      },
    },
  },
}
```

### 2. Import Optimizations

**Before:**
```typescript
import * as LucideIcons from "lucide-react";
import * as echarts from "echarts/core";
```

**After:**
```typescript
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { LineChart } from "echarts/charts";
```

### 3. Lazy Loading Implementation

Created a comprehensive lazy loading system for heavy components:

```typescript
// src/utils/lazyLoad.tsx
export const LazyComponents = {
  Analysis: createLazyComponent(() => import('../pages/Analysis/+Page')),
  ErrorBook: createLazyComponent(() => import('../pages/ErrorBook/+Page')),
  Gallery: createLazyComponent(() => import('../pages/Gallery/+Page')),
  CustomArticle: createLazyComponent(() => import('../pages/CustomArticle/+Page')),
};
```

## ⚡ Runtime Performance Optimizations

### 1. React Component Optimizations

#### Typing Page Optimizations
- **Memoized Computations**: Cached expensive path calculations
- **Optimized useEffect**: Merged related effects and improved dependencies
- **Reduced Re-renders**: Used useMemo for context values
- **Event Handler Optimization**: Cached event handlers with useCallback

```typescript
// Before: Multiple useEffect hooks with complex logic
useEffect(() => {
  // Device detection
}, []);

useEffect(() => {
  // Dictionary validation
}, [currentDictId]);

// After: Combined and optimized
useEffect(() => {
  if (!IsDesktop()) {
    const timer = setTimeout(() => {
      alert(t("messages.mobileNotSupported"));
    }, 500);
    return () => clearTimeout(timer);
  }

  const id = currentDictId;
  if (!isCustomDictionary(id) && !(id in idDictionaryMap)) {
    setCurrentDictId("cet4");
    setCurrentChapter(0);
  }
}, [currentDictId, setCurrentChapter, setCurrentDictId, t]);
```

### 2. Memory Management

Replaced complex memory cleanup with optimized memory manager:

```typescript
// src/utils/optimizedMemoryManager.ts
export const memoryManager = OptimizedMemoryManager.getInstance();

// Automatic memory monitoring
memoryManager.startMonitoring(0.85); // 85% threshold
```

**Features:**
- Lightweight memory monitoring
- Automatic cleanup of large localStorage items
- Performance mark cleanup
- Global cache management

### 3. Event Handler Optimization

- **Debounced Event Handlers**: Reduced frequency of expensive operations
- **Event Listener Cleanup**: Proper cleanup to prevent memory leaks
- **Cached Event References**: Avoided recreating handlers on every render

## 📊 Performance Monitoring Tools

### 1. Bundle Analysis Script

```bash
yarn analyze
yarn build:analyze
yarn bundle:report
```

**Features:**
- Bundle size analysis
- File size breakdown
- Dependency duplication detection
- Optimization recommendations

### 2. Performance Check Script

```bash
yarn performance:check
```

**Features:**
- Large file detection
- Import pattern analysis
- useEffect usage analysis
- Dependency analysis
- Performance recommendations

### 3. Build Scripts

```bash
# Production build with analysis
yarn build:prod

# Build with bundle analysis
yarn build:analyze

# Dependency analysis
yarn analyze:deps
```

## 🎯 Specific Optimizations

### 1. Icon Library Optimization

**Problem**: Wildcard imports from lucide-react were including all icons
**Solution**: Specific named imports

```typescript
// Before
import * as LucideIcons from "lucide-react";
<LucideIcons.ThumbsUp />

// After
import { ThumbsUp, ThumbsDown } from "lucide-react";
<ThumbsUp />
```

### 2. ECharts Optimization

**Problem**: Full ECharts library was being loaded synchronously
**Solution**: Lazy loading and specific chart imports

```typescript
// Lazy load ECharts components
export const LazyECharts = createLazyComponent(
  () => import('../pages/Analysis/components/LineCharts'),
  <LoadingSpinner />
);
```

### 3. Memory Cleanup Optimization

**Problem**: Complex memory cleanup system was over-engineered
**Solution**: Lightweight, targeted cleanup

```typescript
// Optimized cleanup targets only large items
const largeKeys = [
  'critical_metrics',
  'word_stats_cache',
  'typing_history',
  'review_cache',
];

// Only clean items larger than 10KB
if (data && data.length > 10000) {
  localStorage.removeItem(key);
}
```

## 📈 Performance Metrics

### Expected Improvements

1. **Bundle Size**: 20-30% reduction in initial bundle size
2. **Load Time**: 15-25% faster initial page load
3. **Memory Usage**: 30-40% reduction in memory footprint
4. **Runtime Performance**: 20-30% improvement in component rendering

### Monitoring

Use the provided scripts to monitor performance:

```bash
# Check current performance
yarn performance:check

# Analyze bundle after build
yarn build:analyze

# Monitor memory usage in development
# Check browser dev tools for memory usage
```

## 🔧 Maintenance

### Regular Performance Checks

1. **Weekly**: Run `yarn performance:check`
2. **Before Releases**: Run `yarn build:analyze`
3. **Monthly**: Review bundle size trends
4. **Quarterly**: Audit dependencies for optimization opportunities

### Performance Budgets

- **Initial Bundle**: < 500KB (gzipped)
- **Total Bundle**: < 2MB (gzipped)
- **Memory Usage**: < 100MB
- **Load Time**: < 3 seconds on 3G

## 🚨 Performance Anti-patterns to Avoid

1. **Wildcard Imports**: Always use specific imports
2. **Large Synchronous Imports**: Use lazy loading for heavy libraries
3. **Unnecessary Re-renders**: Use React.memo, useMemo, useCallback
4. **Memory Leaks**: Always cleanup event listeners and timers
5. **Large Dependencies**: Consider alternatives or lazy loading

## 📚 Additional Resources

- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Bundle Analysis Tools](https://webpack.js.org/guides/bundle-analysis/)
- [Memory Management Best Practices](https://developer.mozilla.org/en-US/docs/Web/Performance/Memory)

## 🤝 Contributing

When adding new features or dependencies:

1. Run `yarn performance:check` before and after changes
2. Consider bundle size impact of new dependencies
3. Use lazy loading for new heavy components
4. Update this document with new optimizations
5. Test performance on low-end devices