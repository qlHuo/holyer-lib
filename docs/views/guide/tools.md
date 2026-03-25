# Tools 通用辅助函数

提供一组轻量、健壮的通用工具函数，适用于 Vue 2 项目中的 **输入校验、函数控制、唯一标识生成、样式处理、深拷贝** 等常见场景。所有函数均无外部依赖，兼容 IE9+（除 `uuid` 的现代 API 回退外），可安全用于组件逻辑、指令或业务模块。


## 引入方式

```js
import {
  oneOf,
  once,
  throttle,
  debounce,
  uuid,
  formatSize,
  deepClone
} from '@holyer-lib/utils';
```


## `oneOf` 值校验工厂函数

### 用途
创建一个校验函数，用于判断某个值是否属于预定义的合法值列表。

### 参数
- `val`：合法值数组

### 返回
- 一个函数 `(value) => boolean`

### 示例
```js
const isValidStatus = oneOf(['active', 'pending', 'disabled']);

console.log(isValidStatus('active'));   // true
console.log(isValidStatus('deleted'));  // false
```

> ✅ 常用于 props 校验、表单验证或状态机控制。


## `once` 单次执行函数

### 用途
确保传入的函数在整个生命周期中**仅执行一次**，后续调用无效。

### 参数
- `fn`：要包装的函数

### 返回
- 新函数，首次调用时执行 `fn`，之后无操作

### 示例
```js
// 防止表单重复提交
this.handleSubmit = this.once(this.submitForm.bind(this));

// 按钮点击后禁用逻辑
const handleClickOnce = once(() => {
  console.log('只打印一次');
});
```

> ⚠️ 若传入非函数类型，会抛出 `TypeError`。


## `throttle` 节流函数

### 用途
限制函数执行频率，**在指定时间间隔内最多执行一次**（常用于滚动、窗口 resize 等高频事件）。

### 参数
- `func`：要节流的函数
- `delay`：延迟时间（毫秒，必须为正整数）

### 返回
- 节流后的函数

### 示例
```js
const throttledScroll = throttle(handleScroll, 100);
window.addEventListener('scroll', throttledScroll);
```

> ⚠️ 参数校验严格：`func` 必须是函数，`delay` 必须是正整数，否则抛出错误。


## `debounce` 防抖函数

### 用途
确保函数在**连续触发后，仅在最后一次触发的 N 毫秒后执行一次**（常用于搜索框、输入校验）。

### 参数
- `func`：要防抖的函数
- `delay`：延迟时间（毫秒，必须为正整数）

### 返回
- 防抖后的函数

### 示例
```js
const debouncedSearch = debounce(query => {
  api.search(query).then(renderResults);
}, 300);

input.addEventListener('input', e => debouncedSearch(e.target.value));
```

> ✅ 每次调用都会重置计时器，确保只响应“稳定”后的输入。


## `uuid` 生成唯一 ID

### 用途
生成符合 **UUID v4 标准** 的随机唯一字符串。

### 特性
- 优先使用现代浏览器的 `crypto.randomUUID()`（更安全、更快）；
- 不支持时自动回退到基于 `Math.random()` 的手动生成方案。

### 返回
- 字符串，如 `'a1b2c3d4-e5f6-4789-9abc-def012345678'`

### 示例
```js
const id1 = uuid(); // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
const id2 = uuid(); // 每次调用结果唯一
```

> 🌐 兼容性：IE 不支持 `crypto.randomUUID`，但回退方案仍可工作。


## `formatSize` 格式化 CSS 尺寸值

### 用途
将数值或字符串转换为合法的 CSS 长度值，便于在 `:style` 绑定中使用。

### 规则
- `number` → 自动加 `'px'`（如 `100` → `'100px'`）；
- `string` → 原样返回（假定用户已提供合法值，如 `'100%'`, `'50vh'`）；
- `null` / `undefined` / 空字符串 → 返回 `0`。

### 示例
```js
formatSize(100);        // '100px'
formatSize('100%');     // '100%'
formatSize('50vh');     // '50vh'
formatSize(null);       // 0
formatSize('');         // 0
```

> ✅ 推荐用于动态设置宽高、间距等样式：
```vue
<div :style="{ width: formatSize(width), height: formatSize(height) }"></div>
```


## `deepClone` 安全深拷贝

### 用途
对任意对象进行**深度克隆**，支持：
- 循环引用（避免栈溢出）；
- 内置对象：`Date`、`RegExp`、`Map`、`Set`、`ArrayBuffer`；
- 普通对象和数组；
- 函数（原样保留，不复制）。

### 参数
- `obj`：要克隆的对象

### 返回
- 深拷贝后的新对象

### 示例
```js
const original = {
  name: 'test',
  date: new Date(),
  regex: /\d+/g,
  map: new Map([['key', 'value']]),
  self: null // 循环引用示例
};
original.self = original;

const cloned = deepClone(original);
console.log(cloned !== original); // true
console.log(cloned.date instanceof Date); // true
```

> ⚠️ 注意：
> - 函数不会被复制，而是直接引用；
> - 不支持 DOM 节点、`Promise`、`Symbol` 作为属性值的完整克隆（但不会报错）；
> - 使用 `WeakMap` 跟踪已访问对象，防止无限递归。


## 使用建议

| 场景 | 推荐函数 |
|------|--------|
| 表单防重复提交 | `once` |
| 搜索框输入优化 | `debounce` |
| 滚动/窗口事件优化 | `throttle` |
| 动态样式绑定 | `formatSize` |
| 状态快照/撤销操作 | `deepClone` |
| 唯一标识生成 | `uuid` |
| 枚举值校验 | `oneOf` |
