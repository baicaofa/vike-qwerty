# usePageContext 为 undefined 问题排查 SOP

## 1. 问题识别阶段

### 1.1 确认问题现象
- [ ] 确认 `usePageContext()` 返回 `undefined`
- [ ] 记录具体出现问题的组件路径
- [ ] 确认问题出现的时机（SSR/客户端/特定交互）

### 1.2 环境检查
```bash
# 检查 vike-react 版本
npm list vike-react

# 检查相关依赖版本
npm list vike react react-dom
```

## 2. 问题定位阶段

### 2.1 组件层级分析
```typescript
// 在问题组件中添加调试代码
export function ProblematicComponent() {
  const pageContext = usePageContext();
  console.log('🔍 PageContext Debug:', {
    pageContext,
    isUndefined: pageContext === undefined,
    componentName: 'ProblematicComponent',
    renderLocation: 'client' // 或 'server'
  });
}
```

### 2.2 Context Provider 检查
- [ ] 确认 `+Layout.tsx` 中是否正确设置了 Context
- [ ] 检查是否存在多个 Context Provider
- [ ] 确认组件是否在正确的 Context 作用域内

### 2.3 渲染时机分析
```typescript
// 添加渲染时机检测
useEffect(() => {
  console.log('🕐 Component mounted, pageContext:', usePageContext());
}, []);

// 检查是否在服务端渲染
const isSSR = typeof window === 'undefined';
console.log('🖥️ Rendering environment:', { isSSR });
```

## 3. 常见原因排查清单

### 3.1 第三方组件问题
- [ ] **Portal 组件**：Dialog、Modal、Tooltip 等
  ```typescript
  // 问题：Portal 渲染在 body 下，脱离了 Context 树
  <Dialog> {/* 可能脱离 Context */}
    <ComponentUsingPageContext /> {/* ❌ 获取不到 Context */}
  </Dialog>
  ```

- [ ] **异步渲染组件**：Tab、Accordion 等
  ```typescript
  // 问题：异步渲染时 Context 可能还未就绪
  <Tab.Panel> {/* 异步显示 */}
    <ComponentUsingPageContext /> {/* ❌ 时机问题 */}
  </Tab.Panel>
  ```

### 3.2 嵌套层级问题
- [ ] 检查组件嵌套是否过深
- [ ] 确认中间层级是否有 Context 隔离

### 3.3 SSR/客户端不一致
- [ ] 检查服务端和客户端的 Context 提供是否一致
- [ ] 确认水合过程中的时机问题

## 4. 解决方案选择

### 4.1 方案优先级
1. **Props 传递** (推荐) - 可靠性最高
2. **useEffect 延迟** - 适用于时机问题
3. **Context 重新包装** - 适用于第三方组件
4. **条件渲染** - 最后的兜底方案

### 4.2 Props 传递解决方案
```typescript
// ✅ 推荐方案：从有 Context 的组件传递
function ParentWithContext() {
  const pageContext = usePageContext(); // ✅ 这里能获取到
  
  return (
    <ThirdPartyComponent>
      <ChildComponent pageContext={pageContext} /> {/* 传递下去 */}
    </ThirdPartyComponent>
  );
}

function ChildComponent({ pageContext: fallbackPageContext }) {
  const pageContextFromHook = usePageContext();
  const pageContext = pageContextFromHook || fallbackPageContext; // 回退机制
}
```

### 4.3 延迟渲染解决方案
```typescript
// 适用于时机问题
function ComponentWithDelay() {
  const [mounted, setMounted] = useState(false);
  const pageContext = usePageContext();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted || !pageContext) {
    return <div>Loading...</div>; // 等待 Context 就绪
  }
  
  return <ActualComponent pageContext={pageContext} />;
}
```

### 4.4 Context 重新包装解决方案
```typescript
// 适用于第三方组件隔离问题
function ContextBridge({ children }) {
  const pageContext = usePageContext(); // 在外层获取
  
  return (
    <Portal> {/* 第三方 Portal */}
      <PageContextProvider value={pageContext}> {/* 重新提供 */}
        {children}
      </PageContextProvider>
    </Portal>
  );
}
```

## 5. 预防措施

### 5.1 代码规范
```typescript
// ✅ 总是提供 fallback
interface ComponentProps {
  pageContext?: PageContext; // 备用 prop
}

function SafeComponent({ pageContext: fallbackPageContext }: ComponentProps) {
  const pageContextFromHook = usePageContext();
  const pageContext = pageContextFromHook || fallbackPageContext;
  
  // 安全使用 pageContext
}
```

### 5.2 类型安全
```typescript
// 添加类型检查
function usePageContextSafe(): PageContext {
  const pageContext = usePageContext();
  if (!pageContext) {
    throw new Error('usePageContext must be used within a PageContext Provider');
  }
  return pageContext;
}
```

### 5.3 测试覆盖
```typescript
// 测试 Context 缺失情况
describe('PageContext handling', () => {
  it('should handle missing pageContext gracefully', () => {
    // 模拟没有 Provider 的情况
    render(<ComponentUsingPageContext />);
    // 验证不会崩溃
  });
});
```

## 6. 调试工具

### 6.1 Context Debugger
```typescript
// 开发环境下的 Context 调试工具
function PageContextDebugger() {
  const pageContext = usePageContext();
  
  if (process.env.NODE_ENV === 'development') {
    console.table({
      'PageContext Status': pageContext ? '✅ Available' : '❌ Undefined',
      'Locale': pageContext?.locale || 'N/A',
      'URL': pageContext?.urlPathname || 'N/A',
      'Component Tree': document.querySelectorAll('[data-component]').length + ' components'
    });
  }
  
  return null;
}
```

### 6.2 浏览器扩展
- React Developer Tools - 查看 Context 层级
- Vike Developer Tools - 检查 pageContext 状态

## 7. 常见错误模式

### 7.1 ❌ 错误做法
```typescript
// 直接使用，没有错误处理
function BadComponent() {
  const pageContext = usePageContext();
  return <div>{pageContext.locale}</div>; // 💥 可能崩溃
}

// 在条件渲染外使用 Hook
function BadComponent2({ show }) {
  if (!show) return null;
  const pageContext = usePageContext(); // 💥 Hook 规则违反
}
```

### 7.2 ✅ 正确做法
```typescript
// 安全使用，有错误处理
function GoodComponent({ pageContext: fallback }) {
  const pageContextFromHook = usePageContext();
  const pageContext = pageContextFromHook || fallback;
  
  if (!pageContext) {
    return <div>Loading...</div>; // 优雅降级
  }
  
  return <div>{pageContext.locale}</div>;
}

// Hook 始终在顶层调用
function GoodComponent2({ show }) {
  const pageContext = usePageContext(); // ✅ 总是调用
  
  if (!show) return null;
  return <div>{pageContext?.locale}</div>;
}
```

## 8. 排查检查清单

- [ ] 确认问题组件的渲染环境 (SSR/客户端)
- [ ] 检查组件是否在第三方库的 Portal 中
- [ ] 验证 Context Provider 的作用域
- [ ] 分析组件的嵌套层级
- [ ] 确认渲染时机是否正确
- [ ] 检查是否有多个 Context Provider
- [ ] 验证 vike-react 配置是否正确
- [ ] 测试不同的解决方案
- [ ] 添加错误边界和 fallback
- [ ] 编写相应的测试用例 