# card-list 卡片列表

## 组件概述
`HiCardList` 是用于渲染响应式卡片列表的组件，可灵活配置不同屏幕尺寸下的列数、卡片样式及交互效果，搭配 `HiCardItem` 子组件实现卡片内容的展示与交互，适用于各类需要卡片式布局的场景。

## 基础使用

通过 `HiCardList` 包裹 `HiCardItem`，配置列数、间距、卡片样式等参数，实现基础的卡片列表渲染，支持点击切换卡片激活状态。

:::demo
```vue
<template>
  <ClientOnly>
    <HiCardList
      :col="4"
      :gutter="8"
      :cardHeight="'100px'"
      :borderRadius="2"
      borderColor="#ccc"
      item-class="card-item-custom"
      :xl="6"
      :lg="5"
      :md="4"
      :sm="3"
      :xs="2"
      :xxs="2"
    >
      <HiCardItem
        :key="idx"
        v-for="(item, idx) in Array.from({ length: 10 }).map((_, i) => ({
          content: `卡片内容${i + 1}`
        }))"
        :actived="idx === selectedCardIndex"
        @click="selectedCardIndex = idx"
      >
        <div slot="content">{{ item.content }}</div>
      </HiCardItem>
    </HiCardList>
  </ClientOnly>
</template>


<script>
  export default {
    data() {
      return {
        selectedCardIndex: 1
      }
    }
  }
</script>

```
:::

## Props 属性

### HiCardList 属性

| 属性名       | 类型           | 默认值    | 说明                                               |
| ------------ | -------------- | --------- | -------------------------------------------------- |
| col          | Number         | 4         | 默认列数，适用于未匹配媒体查询断点的场景           |
| gutter       | Number         | 16        | 卡片之间的间距                                     |
| xl           | Number         | null      | 屏幕宽度≥1920px时的列数，未配置则使用col的值       |
| lg           | Number         | null      | 屏幕宽度1680px~1920px时的列数，未配置则使用col的值 |
| md           | Number         | null      | 屏幕宽度1280px~1680px时的列数，未配置则使用col的值 |
| sm           | Number         | null      | 屏幕宽度960px~1280px时的列数，未配置则使用col的值  |
| xs           | Number         | null      | 屏幕宽度768px~960px时的列数，未配置则使用col的值   |
| xxs          | Number         | null      | 屏幕宽度<768px时的列数，未配置则使用col的值        |
| cardHeight   | String/Number  | '48px'    | 卡片的高度                                         |
| borderRadius | String /Number | '8px'     | 卡片的圆角大小                                     |
| borderColor  | String         | '#E6E6E6' | 卡片的边框颜色                                     |
| itemClass    | String         | ''        | 自定义卡片项的类名，多个类名用空格分隔             |
| cardPadding  | String/Number  | '16px'    | 卡片的内边距                                       |



### HiCardItem 属性

| 属性名  | 类型        | 默认值 | 说明                                       |
| :------ | :---------- | :----- | :----------------------------------------- |
| icon    | slot        | ''     | 卡片头部图标区域                           |
| title   | String/slot | ''     | 卡片头部标题，若使用插槽则忽略此属性       |
| content | String/slot | ''     | 卡片内容，若使用插槽则忽略此属性           |
| actived | Boolean     | false  | 是否激活当前卡片，激活时边框颜色变为品牌色 |



## Events 事件

### HiCardItem 事件

| 事件名 | 说明           | 回调参数                                   |
| :----- | :------------- | :----------------------------------------- |
| click  | 点击卡片时触发 | 无参数，可通过事件处理函数更新卡片激活状态 |