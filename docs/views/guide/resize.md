# `v-resize` 元素尺寸变化监听指令

用于监听 DOM 元素尺寸变化（宽度或高度），并在变化时自动调用组件实例中指定的方法。基于 `ResizeObserver` 实现，并内置防抖（200ms），避免频繁触发。

## 基础使用

在目标元素上绑定 `v-resize` 指令，并传入组件方法名，当元素尺寸发生变化时，该方法将被调用：

:::demo
```vue
<template>
  <ClientOnly>
    <div>
      <div 
        v-resize="onResize"
        class="resize"
        style="width: 100%; height: 200px; resize: horizontal; overflow: auto; border: 1px solid #ccc;"
      >
        拖动右下角调整尺寸 👉
      </div>
      <p>当前容器宽度：{{ containerWidth }}px</p>
    </div>
  </ClientOnly>
</template>

<script>
export default {
  data() {
    return {
      containerWidth: 200
    };
  },
  methods: {
    onResize() {
      // 注意：此处无法直接获取新尺寸，需手动读取
      this.containerWidth = this.$el.querySelector('.resize').offsetWidth;
      console.log('resize', this.containerWidth)
    }
  }
};
</script>
```
:::

> 💡 元素需具有明确的布局尺寸（如设置 `height` 或内容撑开），否则 `ResizeObserver` 可能不会触发。

## 使用方式

### 在模板中绑定方法名

```vue
<template>
  <div v-resize="handleResize"></div>
</template>

<script>
export default {
  methods: {
    handleResize() {
      console.log('元素尺寸已变化');
    }
  }
}
</script>
```

- `v-resize` 的值必须是**组件实例上的方法名（字符串）**；
- 方法将在元素尺寸变化后 **200ms 内防抖执行一次**；
- 若绑定的表达式不是函数，控制台将输出警告。

## 特性说明

- **基于 `ResizeObserver`**：现代、高效、无轮询开销；
- **自动防抖**：使用 `@holyer-lib/utils` 中的 `debounce`，延迟 200ms 触发，避免高频回调；
- **自动清理**：指令解绑时自动断开观察器，防止内存泄漏；
- **安全调用**：捕获并打印方法执行中的错误，不影响主流程。

## 注意事项

- 该指令**不传递参数**给回调方法。如需获取新尺寸，请在方法内通过 `ref` 或 DOM 查询手动读取。
- `ResizeObserver` 在 IE 中不支持，若需兼容旧浏览器，请确保项目已做降级处理或不使用此指令。
- 防抖时间固定为 200ms，如需自定义，需修改指令源码或扩展支持配置（当前版本不支持传参）。
- 不适用于监听 `display: none` 到 `display: block` 这类“从无到有”的显示变化（此时尺寸为 0 → 非 0，可能触发，但不可靠）。建议配合 `v-show` 或确保元素始终在文档流中。