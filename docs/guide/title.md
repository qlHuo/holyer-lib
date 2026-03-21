# title 标题

## 组件概述  
`HiTitle` 是一个结构化、可配置的标题展示组件，支持主标题 + 描述文本组合、前缀图标或装饰条、多尺寸样式，并提供灵活的插槽扩展能力。适用于页面标题、模块头部、卡片标题等场景。

## 基础使用  
通过 `content` 和 `description` 快速设置标题与描述，也可使用默认插槽和 `description` 插槽实现更复杂的内容结构。

:::demo
```vue
<template>
  <ClientOnly>
    <div style="padding: 20px;">
      <!-- 基础用法 -->
      <HiTitle content="用户管理" description="管理系统中的用户账号信息" />

      <!-- 使用插槽自定义内容 -->
      <HiTitle size="large" style="margin-top: 24px;">
        <template #default>
          <span>订单中心 <em style="color: #ff4d4f;">(12)</em></span>
        </template>
        <template #description>
          当前有 12 笔待处理订单
        </template>
      </HiTitle>

      <!-- 自定义前缀图标 -->
      <HiTitle
        content="系统设置"
        :prefix-icon="SettingIcon"
        icon-class="custom-icon"
        style="margin-top: 24px;"
      />
    </div>
  </ClientOnly>
</template>

<script>
// 模拟一个图标组件
const SettingIcon = {
  render(h) {
    return h('svg', {
      attrs: { width: '16', height: '16', viewBox: '0 0 16 16' }
    }, [
      h('path', {
        attrs: {
          fill: 'currentColor',
          d: 'M8 4a4 4 0 100 8 4 4 0 000-8zM0 8a8 8 0 1116 0A8 8 0 010 8z'
        }
      })
    ]);
  }
};

export default {
  data() {
    return {
      SettingIcon
    };
  }
};
</script>

<style scoped>
.custom-icon {
  color: #1890ff;
}
</style>
```
:::

## Props 属性  

### HiTitle 属性  

| 属性名        | 类型                | 默认值     | 说明 |
|---------------|---------------------|------------|------|
| content       | String              | `''`       | 主标题文本（若提供默认插槽，则此属性被忽略） |
| description   | String              | `''`       | 描述文本（若提供 `description` 插槽，则此属性被忽略） |
| size          | String              | `'medium'` | 组件尺寸，可选：`'small'` / `'medium'` / `'large'`，影响文字大小、图标尺寸及装饰条高度 |
| color         | String              | `''`       | 主标题文字颜色（留空则继承父级） |
| prefixIcon    | Object / Function   | `null`     | 自定义前缀图标组件（Vue 组件对象或构造函数），优先级高于默认装饰条 |
| iconClass     | String              | `''`       | 为前缀图标追加的额外类名 |
| barClass      | String              | `''`       | 为默认装饰条（无图标时显示）追加的类名 |
| textClass     | String              | `''`       | 为主标题文本区域追加的类名 |
| descClass     | String              | `''`       | 为描述文本区域追加的类名 |

> 💡 **尺寸映射关系**：
> - `small`：主标题 `14px`
> - `medium`：主标题 `16px`（默认）
> - `large`：主标题 `18px`

> 💡 **前缀优先级**：`prefix` 插槽 > `prefixIcon` 属性 > 默认装饰条。

## 插槽  

| 插槽名        | 说明 |
|---------------|------|
| default       | 自定义主标题内容（替代 `content`） |
| prefix        | 自定义前缀区域（完全覆盖图标/装饰条） |
| description   | 自定义描述内容（替代 `description`） |

> ✅ 推荐在需要富文本、交互元素（如徽标、链接）时使用插槽。

## 样式定制建议  

- 通过 `textClass` / `descClass` 覆盖文字样式（如行高、字重）。
- 通过 `barClass` 修改默认装饰条颜色或圆角：
  ```css
  .my-bar {
    background: linear-gradient(to right, #1890ff, #7dbcea);
    border-radius: 2px;
  }
  ```
- 图标组件应适配 `font-size` 或 `width/height`，确保与文字对齐。

---

✅ **典型应用场景**：  
- 页面主标题（带副标题说明）  
- 卡片/模块头部  
- 表单分组标题  
- 数据看板区块标题  

✅ **设计一致性**：所有尺寸均遵循统一视觉比例，确保在不同上下文中保持协调。