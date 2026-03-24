# expand-panel 展开面板

## 组件概述  
`HiExpandPanel` 是一个支持方向定位、尺寸拖拽调整与状态缓存的可折叠面板组件。面板可停靠在容器的 `left` / `right` / `top` / `bottom` 四个方向，支持受控/非受控模式、拖拽调节尺寸、自动缓存展开状态与大小，并提供触发器用于切换展开/收起。

## 基础使用  
通过配置 `placement` 指定停靠方向，结合 `expanded` 控制展开状态，用户可通过拖拽边缘或点击触发器动态调整面板尺寸与可见性。

:::demo
```vue
<template>
  <ClientOnly>
    <div style="height: 300px; position: relative; border: 1px solid #eee;">
      <HiExpandPanel
        placement="right"
        :size="240"
        :min-size="180"
        :max-size="400"
        cache-key="my-panel"
        cache-version="v1"
      >
        <div style="padding: 16px; background: #f9f9f9; height: 100%;">
          这是可展开面板的内容区域。
        </div>
      </HiExpandPanel>
    </div>
  </ClientOnly>
</template>

<script>
export default {
  name: 'ExpandPanelDemo'
};
</script>
```
:::

## Props 属性  

| 属性名             | 类型             | 默认值           | 说明 |
|--------------------|------------------|------------------|------|
| expanded           | Boolean          | `undefined`        | 是否展开（受控模式）。若未传入，则组件进入非受控模式，内部管理状态。支持v-model |
| placement          | String           | `'right'`        | 面板停靠方向，可选：`'left'` / `'right'` / `'top'` / `'bottom'` |
| size               | Number / String  | `280`            | 初始展开时的尺寸（宽度或高度，取决于方向） |
| minSize            | Number / String  | `240`            | 拖拽时允许的最小尺寸 |
| maxSize            | Number / String  | `480`            | 拖拽时允许的最大尺寸 |
| collapsedSize      | Number / String  | `24`             | 收起状态下的尺寸（通常为触发条宽度/高度） |
| draggable          | Boolean          | `true`           | 是否允许通过拖拽调整面板尺寸 |
| showTrigger        | Boolean          | `true`           | 是否显示默认的展开/收起触发器（可通过 `trigger` 插槽自定义） |
| cacheKey           | String           | `''`             | 本地缓存键名，用于持久化 `expanded` 和 `size` 状态 |
| cacheVersion       | String           | `''`             | 缓存版本号，配合 `cacheKey` 使用，避免旧缓存干扰 |
| draggingBgColor    | String           | `'var(--td-gray-color-6)'` | 拖拽过程中控制条的背景色 |

> 💡 **受控 vs 非受控**：  
> - 若传入 `expanded`，组件为**受控模式**，需监听 `update:expanded` 并更新父级状态。  
> - 若未传入 `expanded`，组件为**非受控模式**，自动管理内部状态，并支持通过 `cacheKey` 持久化。

> 💡 **尺寸单位说明**：  
> 所有尺寸属性（`size`、`minSize` 等）支持数字（单位 px）或带单位字符串（如 `'200px'`、`'50%'`），内部通过 `formatSize` 工具统一处理。

## Slots 插槽  

| 插槽名   | 说明 |
|----------|------|
| default  | 面板展开时显示的主内容区域 |
| trigger  | 自定义展开/收起触发器。若未提供，默认渲染方向相关的箭头图标（◂ ▸ ▴ ▾） |

> ✅ 触发器点击时会调用 `handleToggle`，切换 `innerExpanded` 状态。

## Events 事件  

| 事件名         | 说明                     | 回调参数 |
|----------------|--------------------------|----------|
| update:expanded | 展开状态变化时触发（支持 `.sync` 或 `v-model`） | `Boolean`：当前是否展开 |
| expand-change   | 展开状态变更时触发       | `Boolean`：当前是否展开 |
| drag-end        | 拖拽结束时触发           | `{ size: Number/String, expanded: Boolean }`：最终尺寸与展开状态 |

> 🔄 **状态同步建议**：  
> 在受控模式下，应监听 `update:expanded` 更新父组件数据；在非受控模式下，可监听 `expand-change` 或 `drag-end` 响应用户操作。

---

✅ 本组件适用于侧边工具栏、底部日志面板、顶部导航抽屉等需要动态收展与尺寸调节的场景。