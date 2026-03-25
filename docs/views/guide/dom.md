# DOM 工具函数

提供一组轻量、兼容 IE9+ 的常用 DOM 操作方法，适用于 Vue 2 项目中对元素类名、滚动位置、尺寸等的处理。所有函数均无依赖、无副作用，可安全用于指令、组件逻辑或工具模块。


## 引入方式

```js
import {
  hasClass,
  addClass,
  removeClass,
  toggleClass,
  getScrollTop,
  setScrollTop,
  getBoundingClientRect,
  getElementSize
} from '@holyer-lib/utils';
```

## 类名操作

### `hasClass(el, cls)` 判断是否包含类名

**用途**：检查元素是否包含指定的一个或多个类名。

**参数**
- `el`：目标 DOM 元素；
- `cls`：类名字符串（支持多个类名，用空格分隔）。

**返回**：`true` / `false`

**示例**
```js
const div = document.querySelector('#myDiv');
console.log(hasClass(div, 'active')); // true / false
console.log(hasClass(div, 'btn primary')); // 同时包含 btn 和 primary 才返回 true
```

### `addClass(el, cls)` 添加类名

**用途**：为元素添加一个或多个类名（已存在的不会重复添加）。

**参数**
- `el`：目标 DOM 元素；
- `cls`：类名字符串（支持多个类名，用空格分隔）。

**示例**
```js
addClass(document.body, 'modal-open loading');
// 等价于 body.classList.add('modal-open', 'loading')
```

### `removeClass(el, cls)` 移除类名

**用途**：从元素移除一个或多个类名。

**参数**
- `el`：目标 DOM 元素；
- `cls`：类名字符串（支持多个类名，用空格分隔）。

**示例**
```js
removeClass(document.body, 'modal-open loading');
```


### `toggleClass(el, cls, force)` 切换类名

**用途**：切换类名状态，支持强制设置。

**参数**
- `el`：目标 DOM 元素；
- `cls`：要切换的类名（仅支持单个类名）；
- `force`（可选）：
  - `true`：强制添加；
  - `false`：强制移除；
  - 不传：自动切换（有则删，无则加）。

**返回**：操作后是否包含该类名（`true` 表示已添加）。

**示例**
```js
// 自动切换
const isActive = toggleClass(button, 'active');

// 强制添加
toggleClass(modal, 'show', true);

// 强制移除
toggleClass(modal, 'show', false);
```

> ✅ 完全兼容原生 `Element.classList.toggle()` 行为，并在不支持的环境（如 IE9）下提供 polyfill。


## 滚动操作

### `getScrollTop()` 获取页面垂直滚动位置

**用途**：获取当前页面纵向滚动距离（兼容所有浏览器）。

**返回**：`number`（像素值）

**示例**
```js
const top = getScrollTop();
console.log('当前滚动了', top, 'px');
```

### `setScrollTop(value)` 设置页面滚动位置

**用途**：将页面滚动到指定垂直位置。

**参数**
- `value`：目标滚动位置（单位：px）

**示例**
```js
// 回到顶部
setScrollTop(0);

// 滚动到 500px
setScrollTop(500);
```

## 元素尺寸与位置

### `getBoundingClientRect(el)` 获取元素相对于视口的位置

**用途**：获取元素在视窗中的位置和尺寸，兼容 IE9+。

**参数**
- `el`：目标 DOM 元素

**返回**：对象 `{ top, left, width, height }`

**说明**
- 现代浏览器使用原生 `getBoundingClientRect()`；
- IE8/9 等旧环境通过 `offsetTop`/`offsetLeft` 模拟（精度略低，但可用）。

**示例**
```js
const rect = getBoundingClientRect(myElement);
console.log('距离顶部:', rect.top, 'px');
console.log('宽度:', rect.width, 'px');
```

### `getElementSize(el)` 获取元素尺寸

**用途**：仅获取元素的宽高，忽略位置信息。

**参数**
- `el`：目标 DOM 元素

**返回**：对象 `{ width, height }`

**示例**
```js
const size = getElementSize(container);
console.log('容器宽:', size.width, '高:', size.height);
```

> 💡 优先使用 `getBoundingClientRect()` 获取更精确的尺寸（含小数），在不支持时回退到 `offsetWidth`/`offsetHeight`（整数）。


## 兼容性说明

| 方法 | IE9 | IE10+ | Chrome/Firefox/Safari |
|------|-----|-------|------------------------|
| `hasClass` / `addClass` / `removeClass` / `toggleClass` | ✅ | ✅ | ✅ |
| `getScrollTop` / `setScrollTop` | ✅ | ✅ | ✅ |
| `getBoundingClientRect` | ⚠️（模拟实现） | ✅ | ✅ |
| `getElementSize` | ⚠️（使用 offset） | ✅ | ✅ |

> 所有函数均经过 IE9+ 实际测试，可放心用于企业级后台系统。


## 使用建议

- 在 **自定义指令** 中操作类名时，优先使用 `addClass`/`removeClass` 而非直接拼接 `className`；
- 需要精确位置（如弹窗定位）时，建议配合 `getBoundingClientRect` 使用；
- 滚动操作可用于“回到顶部”、“锚点跳转”、“懒加载”等场景；
- 避免在高频事件（如 `scroll`、`resize`）中频繁调用尺寸获取函数，必要时请节流。
