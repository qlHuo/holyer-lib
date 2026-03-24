# `v-copy` 文本复制指令

用于一键复制文本内容到剪贴板，支持传入静态文本、响应式数据或配置对象（含成功/失败回调），兼容现代浏览器及降级方案（`execCommand`）。

## 基础使用

在可点击元素上绑定 `v-copy` 指令，点击即可触发复制：

:::demo
```vue
<template>
  <ClientOnly>
    <div style="display: flex; gap: 12px; flex-wrap: wrap; color: var(--td-brand-color)">
      <!-- innerText -->
      <div v-copy>复制innerText</div>
      
      <!-- 静态文本 -->
      <div v-copy="'复制静态文本'">复制静态文本</div>

      <!-- 响应式数据 -->
      <div v-copy="dynamicText">复制动态文本</div>

      <!-- 配置对象 + 自定义回调 -->
      <div 
        v-copy="{
          text: dynamicText,
          success: handleSuccess,
          error: handleError
        }"
      >
        复制并回调提示
      </div>
    </div>
  </ClientOnly>
</template>

<script>
export default {
  data() {
    return {
      dynamicText: '当前时间：' + new Date().toLocaleString()
    }
  },
  methods: {
    handleSuccess() {
      console.log('复制成功')
    },
    handleError() {
      console.log('复制失败')
    },
  }
}
</script>
```
:::

> 💡 若未提供 `success`/`error` 回调，默认使用 `alert` 提示。建议在实际项目中替换为更友好的 UI 反馈（如 message 组件）。

## 配置方式

### 1. 直接传入字符串或数字

```vue
<button v-copy="someVariable">复制</button>
```

- 支持 `string` 或 `number` 类型；
- 若值为 `0`，也会被正常复制；
- 若值为空（`null`/`undefined`/空字符串），则尝试读取元素的 `data-copy` 属性或 `innerText`。

### 2. 传入配置对象

```js
v-copy="{
  text: '要复制的内容',
  success: () => { /* 成功回调 */ },
  error: (err) => { /* 失败回调，可接收错误对象 */ }
}"
```

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `text` | `String | Number` | 否 | 要复制的文本内容 |
| `success` | `Function` | 否 | 复制成功时的回调函数 |
| `error` | `Function` | 否 | 复制失败时的回调函数 |

> 📌 若 `text` 未提供或为空，指令会自动回退到：
> - 元素上的 `data-copy` 属性值；
> - 元素的 `innerText` 内容。

## 特性说明

- **双模式兼容**：优先使用 `navigator.clipboard.writeText`（安全上下文），不支持时降级到 `textarea + execCommand`。
- **自动清理**：指令解绑时移除事件监听，避免内存泄漏。
- **响应式更新**：当绑定值变化时，自动更新内部处理逻辑，确保复制最新内容。
- **无侵入设计**：不修改原元素结构，仅监听点击事件。

## 注意事项

- 在非安全上下文（如 HTTP 页面）中，`navigator.clipboard` 可能不可用，此时自动使用降级方案。
- `execCommand` 在部分移动端浏览器中可能受限，建议测试目标环境。
- 避免在不可见或禁用的元素上使用（如 `display: none`），可能导致 `execCommand` 失败。
- 若需复制富文本（HTML），本指令**仅支持纯文本**，请勿传入 HTML 字符串。