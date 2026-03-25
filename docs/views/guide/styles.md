# Styles 公共样式

## 说明

本样式系统由三个核心文件组成，提供 **主题变量、全局重置、原子化工具类** 三大能力，支持亮/暗双主题，适用于组件库开发与业务项目。通过 `index.css` 统一入口引入：

```js
// Vue 项目中全局引入
import '@holyer-lib/styles';
```

## 一、主题系统（`theme.css`）

基于 `tdesign-vue` 组件库 的  CSS 自定义属性（CSS Variables）实现设计系统，支持动态切换亮色/暗色模式。

### 主题切换方式
- 添加 `class="dark"` 到 `<html>` 或 `<body>`
- 或设置 `theme-mode="dark"` 属性：
  ```html
  <html theme-mode="dark">
  ```

### 核心变量分类

#### 1. 色彩体系
| 类型 | 变量前缀 | 示例 |
|------|--------|------|
| 品牌色 | `--td-brand-color-{1-10}` | `--td-brand-color-7`（主色） |
| 状态色 | `--td-{warning/error/success}-color-{1-10}` | `--td-error-color-6`（错误主色） |
| 中性灰 | `--td-gray-color-{1-14}` | `--td-gray-color-6`（文本次级色） |
| 文字色 | `--td-text-color-{primary/secondary/placeholder/disabled}` | 语义化文本颜色 |

> ✅ 所有颜色均提供 10 级梯度，满足 hover/active/disabled 等交互状态。

#### 2. 背景与边框
| 用途 | 变量 |
|------|------|
| 页面背景 | `--td-bg-color-page` |
| 容器背景 | `--td-bg-color-container` |
| 组件背景 | `--td-bg-color-component` |
| 主边框 | `--td-border-level-1-color` |
| 次边框 | `--td-border-level-2-color` |

#### 3. 字体系统
- **字体族**：`--td-font-family`
- **字号 & 行高**：按用途分层（`link`, `body`, `title`, `headline`, `display`）
- **复合字体**：如 `--td-font-body-medium` = `14px / 22px`

#### 4. 尺寸与圆角
| 类型 | 变量 | 说明 |
|------|------|------|
| 基础尺寸 | `--td-size-{1-16}` | `--td-size-4` = 8px |
| 组件尺寸 | `--td-comp-size-{xxs-xl}` | 用于按钮、输入框等 |
| 圆角 | `--td-radius-{small/default/medium/large/extraLarge/round/circle}` | 最大 12px |

#### 5. 阴影
- `--td-shadow-1`：轻量卡片阴影
- `--td-shadow-2`：中等浮层阴影
- `--td-shadow-3`：重度弹窗阴影

## 二、全局重置与工具类（`global.css`）

### 1. 基础重置
```css
body { margin: 0; padding: 0; }
* { box-sizing: border-box; }
```

### 2. 通用工具类

#### 鼠标与文本
| 类名 | 作用 |
|------|------|
| `.cursor-pointer` | 悬停显示手型光标 |
| `.text-hide-1` | 单行文本溢出省略（`...`） |

#### 间距系统（4px 基数）
支持 `0` / `4` / `8` / `12` / `16` / `20` / `24` / `40` 八档

| 方向 | 类名示例 | 说明 |
|------|--------|------|
| 全方向 | `.p-8`, `.m-16` | padding/margin |
| 上 | `.pt-4`, `.mt-12` | top |
| 右 | `.pr-0`, `.mr-24` | right |
| 下 | `.pb-20`, `.mb-40` | bottom |
| 左 | `.pl-16`, `.ml-8` | left |

> 💡 推荐组合使用：`<div class="p-16 mb-24">`

#### 滚动条美化
- WebKit 浏览器：6px 宽滑块，透明轨道，悬停高亮
- Firefox：使用 `scrollbar-width: thin`
- 自动适配 `.dark` 主题


## 三、Flex 布局工具类（`flex.css`）

提供语义化 Flex 辅助类，无需记忆 CSS 属性。

### 基础类
| 类名 | 作用 |
|------|------|
| `.flex` | 启用 Flex 布局（水平主轴） |
| `.flex-1` | 子元素自动伸缩填满剩余空间 |
| `.flex-column` | 改为垂直主轴（纵向排列） |
| `.flex-wrap` | 允许子元素换行 |

### 对齐与分布

#### 主轴对齐（`justify-content`）
| 类名 | 效果 |
|------|------|
| `.flex-start` | 起始对齐（默认） |
| `.flex-end` | 末尾对齐 |
| `.flex-center` | 居中 |
| `.flex-between` | 两端对齐 |
| `.flex-around` | 均匀环绕 |
| `.flex-evenly` | 完全等距 |

#### 交叉轴对齐（`align-items`）
| 类名 | 效果 |
|------|------|
| `.flex-top` | 顶部对齐 |
| `.flex-middle` | 居中对齐 |
| `.flex-bottom` | 底部对齐 |
| `.flex-stretch` | 拉伸填满（默认） |

#### 单项控制（`align-self`）
| 类名 | 作用 |
|------|------|
| `.self-start` | 单项顶部对齐 |
| `.self-center` | 单项居中 |
| `.self-end` | 单项底部对齐 |
| `.self-stretch` | 单项拉伸 |

> ✅ 所有布局类均包含 `display: flex`，可直接使用（除 `.flex-1` 和 `.flex-column` 需配合 `.flex`）


## 四、使用示例

### 1. 主题色使用
```vue
<template>
  <button 
    class="btn" 
    :style="{ backgroundColor: 'var(--td-brand-color)' }"
  >
    提交
  </button>
</template>
```

### 2. 原子化布局
```html
<div class="flex-between p-16 mb-24">
  <h3 class="text-hide-1">订单 #12345</h3>
  <span class="cursor-pointer">详情</span>
</div>
```

## 五、设计原则

1. **原子化**：每个类只做一件事，可自由组合；
2. **语义化**：类名表达设计意图（如 `.flex-between` 而非 `.justify-between`）；
3. **主题驱动**：所有视觉属性通过 CSS 变量引用，确保一致性；
4. **低侵入性**：不设置非必要属性（如 width/height），避免副作用；
5. **双主题友好**：亮/暗模式自动适配，无需额外代码。


## 六、兼容性说明

| 特性 | 兼容性 | 备注 |
|------|--------|------|
| CSS 变量 | IE9+（需 polyfill） | Vue 2 项目建议 IE11+ |
| Flexbox | IE10+ | 完全支持 |
| `gap` 属性 | ❌ 未提供 | 使用 margin/padding 替代 |
| 滚动条样式 | Chrome/Safari/Firefox | IE 不支持自定义滚动条 |

> 📌 **推荐环境**：现代浏览器（Chrome ≥ 60, Firefox ≥ 60, Safari ≥ 12）

