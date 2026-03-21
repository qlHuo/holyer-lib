
# 安装使用

本组件库采用 **Monorepo 分包架构**，支持按需安装和引入，适用于 Vue 2.6 项目。

## 安装

### 全量安装（推荐快速体验）
```bash
npm install @holyer-lib/ui
# 或使用 pnpm（推荐）
pnpm add @holyer-lib/ui
```

### 按需安装（生产环境推荐）
```bash
# 基础组件（如 title）
pnpm add @holyer-lib/title

# 工具函数与指令
pnpm add @holyer-lib/utils @holyer-lib/directives

# 原子化公共样式
pnpm add @holyer-lib/styles
```

> 💡 **提示**：所有包均发布至 npm，命名空间为 `@holyer-lib/*`。


## 基础组件

### 全局注册（适用于小型项目）
```js
// main.js
import Vue from 'vue'
import HolyerUI from '@holyer-lib/ui'

Vue.use(HolyerUI)
```

### 按需引入（推荐，减少打包体积）
```vue

<template>
  <HiTitle
    class="mt-16"
    content="title组件示例"
    size="medium"
    color="var(--td-error-color)"
    description="title组件用户标题的说明，支持props和插槽配置标题文本，支持配置颜色，支持large/medium/small三种大小, 支持自定义装饰条，支持描述信息（支持插槽和props两种方式）"
  />
</template>

<script>
import { HiTitle } from '@holyer-lib/ui'

export default {
  components: {
    HiTitle
  },
}
</script>
```

> ✅ 所有组件均基于 **Vue 2.6** 开发，**不依赖 TypeScript 或组合式 API**，兼容 IE11+（需配置 babel）。


## 工具与指令

### 工具函数（utils）
```js
import { debounce, throttle } from '@holyer-lib/utils'

export default {
  methods: {
    handleScroll: throttle(function() {
      console.log('滚动防抖')
    }, 300)
  }
}
```

### 内置指令
```js
import { Watermark, Copy } from '@holyer-lib/directives'

// 全局注册
Vue.directive('watermark', Watermark)
Vue.directive('copy', Copy)
```

在模板中使用：
```vue
<template>
  <!-- 添加水印 -->
  <div v-watermark="'Holyer'" />

  <!-- 一键复制 -->
  <button v-copy="'要复制的内容'">复制</button>
</template>
```

> 📦 指令与工具函数均为 **ES Module 输出**，支持 tree-shaking。


## 样式

### 引入原子化 CSS 工具类
```js
// main.js
import '@holyer-lib/styles'
```

### 在模板中使用
```html
<!-- Flex 布局 -->
<div class="flex-between flex-middle">
  <span>左侧</span>
  <span>右侧</span>
</div>

<!-- 间距控制 -->
<div class="p-16 mt-8">内边距 16px，上外边距 8px</div>

```

> 🎨 样式系统与 **TDesign 主题色自动同步**（通过 CSS 变量 `--td-brand-color`），确保 UI 一致性。


::: warning 注意事项
- 本组件库 **仅支持 Vue 2.6.x（最高兼容至 2.6.14）**
- 不支持 Vue 3、Composition API 或 `<script setup>`
:::



