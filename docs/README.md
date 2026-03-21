---
home: true
heroImage: /logo.png
actionText: "快速上手 →"
actionLink: /guide/
features: 
  - title: "基础组件"
    details: "开箱即用的 Vue 2.6 组件，如卡片列表、侧边展开等，支持按需引入。"
  - title: "指令 & 工具函数"
    details: "实用指令（水印、复制）与工具方法（防抖、节流、类型判断），提升开发效率。"
  - title: "原子化公共样式"
    details: "轻量级 CSS 工具类，覆盖 Flex 布局、间距、文本等常用场景，零运行时开销。"
footer: "Copyright for Holyer"
---

### 快速安装

本组件库采用 **Monorepo 分包设计**，可按需安装所需模块：

```bash
  # 安装完整 UI 组件库（含所有组件）
  npm install @holer-lib/ui
  
  # 按需安装单个组件（例如 Title 组件）
  npm install @holer-lib/title
  
  # 安装指令集（v-watermark, v-copy 等）
  npm install @holer-lib/directives
  
  # 安装原子化样式工具类
  npm install @holer-lib/styles

```

::: warning 注意
  该组件库 **仅支持 Vue 2.6.x（最高兼容至 2.6.14）**，不适用于 Vue 3 或组合式 API。
:::


