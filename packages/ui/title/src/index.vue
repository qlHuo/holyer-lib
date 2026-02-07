<template>
  <div :class="titleClass" v-bind="$attrs">
    <div class="hi-title__header">
      <!-- 前缀区域：插槽 > 自定义 icon 组件 > 默认装饰条 -->
      <div class="hi-title__prefix">
        <slot name="prefix">
          <component
            v-if="prefixIcon"
            :is="prefixIcon"
            :class="['hi-title__icon', iconClass]"
            :style="{ fontSize: iconSize }"
          />
          <div v-else :class="['hi-title__bar', barClass]" :style="{ height: barHeight }" />
        </slot>
      </div>
      <div
        v-if="content || $slots.default"
        :class="['hi-title__text', textClass]"
        :style="{
          color: textColor,
          fontSize: textSize
        }"
      >
        <slot>{{ content }}</slot>
      </div>
    </div>
    <p v-if="hasDescription" :class="['hi-title__description', descClass]">
      <slot name="description">{{ description }}</slot>
    </p>
  </div>
</template>

<script>
import './index.less';
const TITILE_SIZE_MAP = {
  small: '14px',
  medium: '16px',
  large: '18px'
};
export default {
  name: 'HiTitle',
  inheritAttrs: false,
  props: {
    // 自定义图标类名
    iconClass: {
      type: String,
      default: ''
    },
    // 主标题文本（优先级低于 default slot）
    content: {
      type: String,
      default: ''
    },
    // 描述文本（优先级低于 description slot）
    description: {
      type: String,
      default: ''
    },
    // 尺寸：控制整体大小（影响文字、图标、bar 高度）
    size: {
      type: String,
      default: 'medium',
      validator: val => ['small', 'medium', 'large'].includes(val)
    },
    // 主标题颜色（支持自定义）
    color: {
      type: String,
      default: ''
    },
    // 自定义前缀图标组件
    prefixIcon: {
      type: [Object, Function],
      default: null
    },
    // 自定义 bar 类名（用于覆盖样式）
    barClass: {
      type: String,
      default: ''
    },
    // 自定义标题文字类名
    textClass: {
      type: String,
      default: ''
    },
    // 自定义描述文字类名
    descClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    titleClass() {
      return ['hi-title', `hi-title--${this.size}`, { 'hi-title--has-desc': this.hasDescription }];
    },
    // 根据 size 计算文字大小
    textSize() {
      return TITILE_SIZE_MAP[this.size] || TITILE_SIZE_MAP.medium;
    },
    // 图标大小 = 文字大小（保持视觉一致）
    iconSize() {
      return this.textSize;
    },
    // 装饰条高度 = 文字行高 ≈ 文字大小 * 1.2～1.5
    barHeight() {
      const base = parseFloat(TITILE_SIZE_MAP[this.size] || '16');
      return `${base * 1.2}px`;
    },
    // 主标题颜色（props 优先，否则继承）
    textColor() {
      return this.color || 'inherit';
    },
    // 是否存在描述内容（用于控制布局）
    hasDescription() {
      return this.description || this.$slots.description;
    }
  }
};
</script>
