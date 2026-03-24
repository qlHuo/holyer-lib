# `v-watermark` 水印指令

用于在指定元素上添加防篡改、可配置的全屏或局部水印，支持自动恢复（即使在开发者工具中手动删除），适用于文档预览、后台系统等需内容保护的场景。

## 基础使用

在目标元素上使用 `v-watermark` 指令并传入配置对象：

:::demo
```vue
<template>
  <ClientOnly>
    <div 
      v-watermark="{ text: '内部资料', angle: -15 }"
      style="height: 400px; position: relative; border: 1px solid #eee; padding: 20px;"
    >
      <p>此区域已添加水印，尝试在控制台删除水印节点，它会自动恢复。</p>
    </div>
  </ClientOnly>
</template>

<script>
// 在 main.js 中全局注册（假设指令已正确引入）
// Vue.directive('watermark', WatermarkDirective);

export default {
  name: 'WatermarkDemo'
}
</script>
```
:::

> 💡 若作用于 `<body>`，建议在 `App.vue` 的根容器上使用，并确保其 `position` 为 `relative` 或直接使用 `fixed` 定位。

## 配置参数

通过传入一个对象配置水印样式，所有属性均为可选：

```js
v-watermark="{
  text: '机密',
  angle: -20,
  font: '16px Microsoft Yahei',
  color: 'rgba(0,0,0,0.12)',
  gapX: 80,
  gapY: 80,
  width: 120,
  height: 64,
  zIndex: 9999
}"
```

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `text` | `string` | `'水印'` | 水印显示文字 |
| `angle` | `number` | `-20` | 旋转角度（度），负值为逆时针 |
| `font` | `string` | `'16px Microsoft Yahei'` | 字体样式（CSS `font` 格式） |
| `color` | `string` | `'rgba(0,0,0,0.12)'` | 文字颜色，建议半透明 |
| `gapX` | `number` | `80` | 水平间距（px） |
| `gapY` | `number` | `80` | 垂直间距（px） |
| `width` | `number` | `120` | 单个水印图块宽度（px） |
| `height` | `number` | `64` | 单个水印图块高度（px） |
| `zIndex` | `number` | `9999` | 层级，确保高于内容 |

## 特性说明

- **自动恢复**：通过 `MutationObserver` + 定时器双重机制，防止水印被删除。
- **响应式适配**：窗口尺寸变化时自动重建水印，避免拉伸失真。
- **容器兼容**：
  - 作用于 `<body>` 时使用 `fixed` 定位，覆盖整个视口；
  - 作用于普通元素时自动设为 `relative`（若原为 `static`），水印以 `absolute` 覆盖。
- **无交互干扰**：水印设置 `pointer-events: none` 和 `user-select: none`，不影响用户操作。

## 注意事项

- 水印基于 `canvas` 生成 base64 背景图，首次渲染有轻微性能开销，但后续无重绘压力。
- 打印时默认不显示水印（因是背景图），如需打印水印需额外处理 `@media print` 样式。
- 同一元素重复绑定会导致多个水印叠加，建议通过条件渲染控制启用状态。