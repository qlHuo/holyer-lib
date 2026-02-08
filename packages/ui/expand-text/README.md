# HiExpandText 组件说明


## 1. 概述

`HiExpandText` 是一个 Vue 组件，旨在处理多行文本的截断与展开。它通过 `-webkit-line-clamp` 实现多行文本的自动截断，并在内容超出指定行数时显示“展开”按钮；点击按钮后，文本完全展开，并显示“收起”按钮。该组件适用于需要动态控制文本显示长度的场景，如文章摘要、评论列表等。

---

## 2. 布局思想

### 2.1 基础布局

基础布局使用了 Flexbox 和 Webkit 的 `-webkit-line-clamp` 特性来实现多行文本的截断。以下是关键点：

- **Flexbox**：用于确保 `.hi-expand-text` 容器内的元素能够灵活对齐和分布。
  
  ```less
  .hi-expand-text {
    display: flex;
    width: 100%;
    line-height: 1.5; // 强制统一行高
  }
  ```

- **Webkit Line Clamp**：通过 `-webkit-line-clamp` 控制文本的最大行数，并结合 `overflow: hidden` 和 `text-overflow: ellipsis` 实现文本截断。

  ```less
  &--content {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    -webkit-line-clamp: var(--hi-expand-text-line-clamp);
    line-clamp: var(--hi-expand-text-line-clamp);
  }
  ```

### 2.2 浮动布局实现展开/折叠按钮

为了在文本右下角显示展开/折叠按钮，我们使用了浮动布局 (`float: right`) 和伪元素 (`::before`) 来创建占位符。

```less
&.hi-expand-text--content__show-toggle::before {
  content: '';
  float: right;
  height: 100%;
  margin-bottom: calc(-1em * 1.5); // 调整垂直位置
}
```

- **浮动布局**：通过 `float: right` 将展开/折叠按钮定位到文本块的右下角。
- **伪元素**：使用 `::before` 创建一个占位符，确保按钮在视觉上与文本分离。

展开/折叠按钮本身是一个独立的 `div`，带有特定样式：

```less
&--toggle {
  color: var(--td-brand-color);
  float: right;
  clear: both;
  cursor: pointer;
}
```

- **颜色**：通过 CSS 变量 `var(--td-brand-color)` 设置按钮颜色，方便主题定制。
- **清除浮动**：`clear: both` 确保按钮不会被浮动元素影响。
- **交互提示**：`cursor: pointer` 提示用户这是一个可点击的按钮。

---

## 3. 溢出时展开/折叠按钮显示逻辑分析

### 3.1 收起状态下检测溢出

当组件处于收起状态（即 `isExpanded = false`）时，我们需要检测文本是否溢出容器的高度。具体实现如下：

```js
checkEllipsis() {
  const textEl = this.$refs.textRef;
  if (!textEl || !textEl.offsetParent) {
    this.showToggle = false;
    return;
  }

  if (this.isExpanded) {
    // 展开状态下：模拟收起状态，检测是否需要 toggle
    this.showToggle = this.wouldOverflowIfCollapsed(textEl);
  } else {
    // 收起状态下：直接检测是否溢出
    this.showToggle = textEl.scrollHeight - textEl.clientHeight > 2;
  }
}
```

- **直接检测**：通过比较 `scrollHeight` 和 `clientHeight` 来判断文本是否溢出。如果 `scrollHeight > clientHeight`，则设置 `showToggle = true`，显示展开按钮。

### 3.2 展开状态下模拟收起状态检测溢出

当组件处于展开状态（即 `isExpanded = true`）时，虽然文本已经全部展开，但在窗口大小发生变化时，文本可能会重新溢出。因此，我们需要模拟收起状态来检测是否需要显示折叠按钮。

```js
wouldOverflowIfCollapsed(el) {
  // 保存原始状态
  const originalDisplay = el.style.display;
  const originalWebkitLineClamp = el.style.webkitLineClamp;
  const originalClassList = el.className;

  try {
    // 临时应用“收起”样式，移除 --expanded 和 --show-toggle
    el.className = 'hi-expand-text--content';
    el.style.display = '-webkit-box';
    el.style.webkitBoxOrient = 'vertical';
    el.style.overflow = 'hidden';
    el.style.webkitLineClamp = this.lineClamp;

    // 强制 reflow（触发 layout）
    const { scrollHeight, clientHeight } = el;

    // 判断是否溢出
    return scrollHeight - clientHeight > 2;
  } finally {
    // 恢复原始状态（确保无副作用）
    el.className = originalClassList;
    el.style.display = originalDisplay;
    el.style.webkitLineClamp = originalWebkitLineClamp;
  }
}
```

- **保存原始状态**：在检测之前，保存当前元素的所有样式属性，以防止检测过程中的样式修改影响最终结果。
- **临时应用“收起”样式**：将元素的样式恢复为收起状态（即 `-webkit-line-clamp` 生效），并强制浏览器重新计算布局 (`reflow`)。
- **检测溢出**：通过比较 `scrollHeight` 和 `clientHeight` 来判断文本是否溢出。如果溢出，则返回 `true`，表示需要显示折叠按钮。
- **恢复原始状态**：无论检测结果如何，都要恢复元素的原始样式，避免影响后续渲染。

---

## 4. 其他功能简述

### 4.1 动态内容更新

组件通过监听 `content` prop 的变化，在内容更新时重新检测是否需要显示展开/折叠按钮：

```js
watch: {
  content() {
    this.$nextTick(this.checkEllipsis);
  }
}
```

### 4.2 响应式布局变化

为了响应窗口大小或父容器尺寸的变化，组件使用了 `window.resize` 事件和 `ResizeObserver` 来检测布局变化，并重新检查文本是否溢出：

```js
mounted() {
  this.checkEllipsis();
  window.addEventListener('resize', this.handleResize);
  if (window.ResizeObserver && this.$el) {
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(this.$el);
  }
}

methods: {
  handleResize() {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.checkEllipsis();
    }, 100);
  }
}
```

- **防抖机制**：为了避免频繁触发检测，使用了防抖机制（100ms），确保每次 resize 后只执行一次检测。

---

## 5. 总结

`HiExpandText` 组件通过巧妙运用 CSS 特性和 JavaScript 逻辑，实现了多行文本的自动截断与展开功能。其核心亮点包括：
- 使用 `-webkit-line-clamp` 实现多行文本截断。
- 通过 `ResizeObserver` 和 `window.resize` 事件响应布局变化，确保在不同屏幕尺寸下都能正确显示展开/折叠按钮。
- 在展开状态下通过模拟收起状态检测是否需要显示折叠按钮，解决了展开状态下 resize 误判的问题。
