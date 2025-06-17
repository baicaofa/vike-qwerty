# CustomArticle 错误处理优化

## 背景

CustomArticle 模块的打字错误处理逻辑与 Typing 页面存在差异，需要统一用户体验。

## 优化内容

### 1. 大小写忽略功能

将严格的字符比较改为大小写不敏感的比较：

```typescript
// 修改前
if (inputChar === correctChar) {
  // 输入正确
}

// 修改后
const isEqual = inputChar.toLowerCase() === correctChar.toLowerCase();
if (isEqual) {
  // 输入正确
}
```

### 2. 错误后重置功能

添加错误后自动重置输入的功能，与 Typing 页面保持一致：

1. 在 ArticleState 中添加`hasWrong`状态
2. 添加`RESET_WRONG_INPUT`动作类型
3. 在`ADD_ERROR`处理中设置`hasWrong: true`
4. 添加 useEffect 钩子，检测`hasWrong`状态变化并延迟重置

```typescript
// 错误后重置输入
useEffect(() => {
  if (state.hasWrong) {
    const timer = setTimeout(() => {
      dispatch({
        type: ArticleActionType.RESET_WRONG_INPUT,
      });
    }, 300); // 300毫秒后重置

    return () => {
      clearTimeout(timer);
    };
  }
}, [state.hasWrong, dispatch]);
```

## 未实现的功能

根据需求，暂不实现错误次数限制功能。

## 效果

1. 用户输入不区分大小写，提高打字容错性
2. 输入错误后会短暂显示错误状态，然后自动重置，与 Typing 页面体验一致
