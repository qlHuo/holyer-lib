# HiVirtualList 虚拟滚动列表

## 组件概述  
`HiVirtualList` 是一个高性能的**固定高度虚拟滚动列表**组件，通过仅渲染可视区域内的项并配合上下占位符，显著降低 DOM 节点数量，适用于渲染大量数据（如千级/万级列表）的场景，有效避免页面卡顿。

---

## 基础使用  
传入完整数据列表 `items` 和每项固定高度 `itemHeight`，通过作用域插槽渲染每一项内容。组件自动计算可见区域，实现流畅滚动。

:::demo
```vue
<template>
 <ClientOnly>
    <HiVirtualList
      :items="list"
      :item-height="48"
      height="300px"
      :buffer="10"
      style="border: 1px solid #eee; border-radius: 4px;"
    >
      <template #default="{ item, index }">
        <div class="list-item" :style="{ height: '48px', lineHeight: '48px', padding: '0 16px' }">
          {{ index + 1 }}. {{ item.name }}
        </div>
      </template>
    </HiVirtualList>
  </ClientOnly>
</template>

<script>
export default {
  data() {
    return {
      list: Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `用户 ${i + 1}`
      }))
    };
  }
};
</script>

<style scoped>
.list-item {
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
}
.list-item:hover {
  background: #e6f7ff;
}
</style>
```
:::

---

## Props 属性  

### HiVirtualList 属性  

| 属性名      | 类型             | 必填 | 默认值 | 说明 |
|-------------|------------------|------|--------|------|
| items       | Array            | 是   | —      | 完整数据列表 |
| itemHeight  | Number           | 是   | —      | 每一项的**固定高度**（单位：px），必须为正数 |
| height      | Number / String  | 是   | —      | 虚拟列表容器高度（支持数字或带单位字符串，如 `'300px'`） |
| buffer      | Number           | 否   | `50`   | 可见区域上下额外渲染的项数（用于提升滚动流畅度） |
| nodeKey     | String           | 否   | `undefined` | 指定 `items` 中每项的唯一键字段名（用于 `v-for` 的 `key`） |

> ⚠️ **限制说明**：  
> - 本组件**仅支持固定高度项**，不支持动态高度。  
> - 若提供 `nodeKey`，则 `items` 中每项必须为对象，且包含该字段；否则将回退到使用数组索引作为 key。

---

## 插槽  

| 插槽名    | 作用域参数                     | 说明 |
|-----------|-------------------------------|------|
| default   | `{ item: any, index: number }` | 渲染每一项的模板，`item` 为当前数据项，`index` 为其在原始列表中的位置 |

> ✅ 必须通过此插槽定义列表项的 UI 结构。

---

## 事件  

| 事件名          | 说明                     | 回调参数 |
|-----------------|--------------------------|----------|
| scroll          | 滚动时触发               | 原生 `Event` 对象 |
| reach-top       | 滚动到顶部（scrollTop = 0） | 无 |
| reach-bottom    | 滚动到底部（距底 ≤100px） | 无 |
| visible-change  | 可见范围发生变化         | `{ startIndex: number, endIndex: number }` |

> 📌 `reach-bottom` 可用于实现“滚动加载更多”逻辑。

---

## 方法  

| 方法名             | 说明                         | 参数 | 返回值 |
|--------------------|------------------------------|------|--------|
| scrollTo(target)   | 滚动到指定项                 | `target: string \| number`• 若配置 `nodeKey`，传入该项的 key 值• 否则传入索引（number） | — |
| scrollToTop()      | 滚动到顶部                   | 无   | — |
| scrollToBottom()   | 滚动到底部                   | 无   | — |
| refresh()          | 手动刷新容器高度（应对布局变化） | 无   | — |
| getVisibleRange()  | 获取当前可见项的索引范围     | 无   | `{ startIndex, endIndex }` |

> ✅ 示例：  
> ```js
> // 滚动到第 100 项
> this.$refs.virtualList.scrollTo(99);
> 
> // 若 nodeKey="id"，可滚动到 id=500 的项
> this.$refs.virtualList.scrollTo(500);
> ```

---

## 注意事项  

- **性能优势**：即使渲染 10,000+ 项，DOM 节点始终保持在 `visibleCount ≈ (容器高度 / itemHeight) + 2 * buffer` 以内。
- **高度一致性**：所有列表项必须具有**完全相同的高度**，否则会出现错位或空白。
- **响应式容器**：组件会监听自身尺寸变化（通过 `ResizeObserver` 或 `window.resize`），自动更新可视区域计算。

---

✅ **适用场景**：  
- 大数据表格/列表  
- 聊天消息记录  
- 日志流展示  
- 选择器下拉选项（如城市、商品）  

> 💡 配合 `HiExpandPanel` 或 `HiCardList` 可构建高性能复合布局。