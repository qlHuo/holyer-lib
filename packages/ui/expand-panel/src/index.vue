<template>
  <div ref="hiExpandPanelRef" :class="['hi-expand-panel', `hi-expand-panel--${placement}`]" :style="panelStyle">
    <div class="hi-expand-panel--content" v-show="innerExpanded">
      <slot></slot>
    </div>

    <div
      :class="[
        'hi-expand-panel--control',
        {
          'hi-expand-panel--control-draggable': draggable && innerExpanded,
          'hi-expand-panel--control-dragging': isDragging && innerExpanded
        }
      ]"
      @mousedown="handleDragMousedown"
      @mousemove="handleDragMousemove"
      @mouseup="handleDragMouseup"
    >
      <div
        v-if="$slots.trigger || showTrigger"
        class="hi-expand-panel--control-trigger"
        @click.stop="handleToggle"
        @mousedown.stop
      >
        <slot name="trigger">
          <template v-if="isHorizontal">
            <span v-if="placement === 'right'">{{ innerExpanded ? '◂' : '▸' }}</span>
            <span v-else>{{ innerExpanded ? '▸' : '◂' }}</span>
          </template>
          <template v-else>
            <span v-if="placement === 'top'">{{ innerExpanded ? '▾' : '▴' }}</span>
            <span v-else>{{ innerExpanded ? '▴' : '▾' }}</span>
          </template>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import './index.less';
import { formatSize } from '@holyer-lib/utils';

const validateSize = val => {
  if (typeof val === 'number') {
    return val >= 0;
  }
  return true;
};

export default {
  name: 'HiExpandPanel',
  model: {
    prop: 'expanded',
    event: 'update:expanded'
  },
  props: {
    // 支持受控和非受控两种模式
    expanded: {
      type: Boolean,
      default: undefined
    },

    placement: {
      type: String,
      default: 'right',
      validator: v => ['left', 'right', 'top', 'bottom'].includes(v)
    },

    size: {
      type: [Number, String],
      default: 280,
      validator: validateSize
    },

    minSize: {
      type: [Number, String],
      default: 240,
      validator: validateSize
    },

    maxSize: {
      type: [Number, String],
      default: 480,
      validator: validateSize
    },

    collapsedSize: {
      type: [String, Number],
      default: 24,
      validator: validateSize
    },

    draggable: {
      type: Boolean,
      default: true
    },

    showTrigger: {
      type: Boolean,
      default: true
    },

    cacheKey: {
      type: String,
      default: ''
    },

    cacheVersion: {
      type: String,
      default: ''
    },

    draggingBgColor: {
      type: String,
      default: 'var(--td-gray-color-6)'
    }
  },
  data() {
    let cachedData = {};
    if (this.cacheKey) {
      try {
        const stored = localStorage.getItem(`${this.cacheKey}${this.cacheVersion}`);
        if (stored) {
          cachedData = JSON.parse(stored);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`HiExpandPanel: Failed to parse cache for key "${this.cacheKey}"`, e);
        cachedData = {};
      }
    }

    // 核心逻辑：有外部控制就用外部控制，否则用缓存
    const useExternal = this.expanded !== undefined;
    const initialExpanded = useExternal
      ? this.expanded
      : cachedData.cachedExpanded !== undefined
      ? cachedData.cachedExpanded
      : true;
    const initialSize = useExternal
      ? this.size
      : cachedData.cachedSize !== undefined
      ? cachedData.cachedSize
      : this.size;

    return {
      innerExpanded: initialExpanded,
      clientSize: initialSize,
      isDragging: false,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      hasExternalControl: useExternal
    };
  },
  computed: {
    isHorizontal() {
      return ['left', 'right'].includes(this.placement);
    },

    // 根据展开状态和方向动态计算面板尺寸限制
    getContainerStyles() {
      // 如果未展开，直接返回空对象，不设置min/max尺寸
      if (!this.innerExpanded) return {};
      // 展开时根据方向设置对应的min/max尺寸
      return this.isHorizontal
        ? {
            minWidth: formatSize(this.minSize),
            maxWidth: formatSize(this.maxSize)
          }
        : {
            minHeight: formatSize(this.minSize),
            maxHeight: formatSize(this.maxSize)
          };
    },
    panelStyle() {
      const getWidth = () => {
        if (this.isHorizontal) {
          return this.innerExpanded ? formatSize(this.clientSize) : formatSize(this.collapsedSize) || 0;
        }
        return '100%';
      };

      const getHeight = () => {
        if (this.isHorizontal) {
          return '100%';
        }
        return this.innerExpanded ? formatSize(this.clientSize) : formatSize(this.collapsedSize) || 0;
      };

      return {
        width: getWidth(),
        height: getHeight(),
        ...this.getContainerStyles,
        transition: this.isDragging ? 'none' : 'flex 0.3s ease',
        '--control-draggable-cursor': this.isHorizontal ? 'col-resize' : 'row-resize',
        '--control-dragging-bg-color': this.draggingBgColor
      };
    }
  },
  watch: {
    expanded(newVal) {
      // 只有在组件是受控时才更新状态
      if (this.hasExternalControl) {
        if (newVal !== this.innerExpanded) {
          this.innerExpanded = newVal;
        }
      }
    },

    innerExpanded(newVal) {
      this.$emit('update:expanded', newVal);
      this.$emit('expand-change', newVal);
      if (this.cacheKey) {
        this.handleSaveCache();
      }
    }
  },
  methods: {
    handleToggle() {
      this.innerExpanded = !this.innerExpanded;
    },

    handleSaveCache() {
      if (this.cacheKey) {
        localStorage.setItem(
          `${this.cacheKey}${this.cacheVersion}`,
          JSON.stringify({
            cachedSize: this.clientSize,
            cachedExpanded: this.innerExpanded
          })
        );
      }
    },

    handleDragMousedown(e) {
      if (!this.draggable) return;
      e.preventDefault();
      this.isDragging = true;
      this.startX = e.clientX;
      this.startY = e.clientY;

      const panelRect = this.$refs.hiExpandPanelRef.getBoundingClientRect();
      this.startWidth = panelRect.width;
      this.startHeight = panelRect.height;

      this.handleCreateMousemoveListener();
      // 添加全局样式防止选中文本
      document.body.style.userSelect = 'none';
    },

    // 核心逻辑：根据鼠标移动计算新的尺寸
    handleDragMousemove(e) {
      if (!this.isDragging) return;
      // 只在需要阻止默认行为时调用 preventDefault
      e.preventDefault();

      let newSize;
      if (this.isHorizontal) {
        // 根据放置位置决定宽度变化的方向
        const moveWidth = this.placement === 'left' ? this.startX - e.clientX : e.clientX - this.startX;
        newSize = this.startWidth + moveWidth;
      } else {
        // 根据放置位置决定高度变化的方向
        const moveHeight = this.placement === 'top' ? this.startY - e.clientY : e.clientY - this.startY;
        newSize = this.startHeight + moveHeight;
      }

      // minSize 和 maxSize 已经限制了最大宽高，直接取 newSize 设置 clientSize 即可
      this.clientSize = newSize;
    },

    // 鼠标松开结束拖动
    handleDragMouseup() {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.handleSaveCache();
      // 清理事件监听
      this.handleClearMousemoveListener();
      this.$emit('drag-end', {
        size: this.clientSize,
        expanded: this.innerExpanded
      });

      // 恢复全局样式
      document.body.style.userSelect = '';
    },

    // 添加拖拽事件监听
    handleCreateMousemoveListener() {
      document.addEventListener('mousemove', this.handleDragMousemove);
      document.addEventListener('mouseup', this.handleDragMouseup);
    },

    // 移除拖拽事件监听
    handleClearMousemoveListener() {
      document.removeEventListener('mousemove', this.handleDragMousemove);
      document.removeEventListener('mouseup', this.handleDragMouseup);
    }
  }
};
</script>
