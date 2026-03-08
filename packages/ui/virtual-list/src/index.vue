<template>
  <div ref="rootRef" class="hi-virtual-list" :style="styles" @scroll="handleScroll">
    <!-- 顶部空白占位 -->
    <div class="hi-virtual-list--placeholder" :style="{ height: topPlaceholderHeight }"></div>

    <!-- 可见区域项 -->
    <div
      v-for="(item, i) in visibleItems"
      :key="getNodeKey(item, startIndex + i)"
      class="hi-virtual-list--item-wrapper"
      :style="{ height: renderItemHeight }"
    >
      <slot :item="item" :index="startIndex + i" />
    </div>

    <!-- 底部空白占位 -->
    <div class="hi-virtual-list--placeholder" :style="{ height: bottomPlaceholderHeight }"></div>
  </div>
</template>

<script>
import { formatSize } from '@holyer-lib/utils';

export default {
  name: 'HiVirtualList',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    itemHeight: {
      type: Number,
      required: true,
      validator(value) {
        if (value <= 0) {
          // eslint-disable-next-line no-console
          console.error('[HiVirtualList] itemHeight must be a positive number.');
          return false;
        }
        return true;
      }
    },
    height: {
      type: [Number, String],
      required: true
    },
    buffer: {
      type: Number,
      default: 50
    },
    nodeKey: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      scrollTop: 0,
      clientHeight: 0,
      resizeObserver: null,
      resizeTimer: null
    };
  },
  computed: {
    styles() {
      return {
        height: formatSize(this.height)
      };
    },
    renderItemHeight() {
      return formatSize(this.itemHeight);
    },
    total() {
      return this.items.length;
    },
    visibleCount() {
      if (!this.clientHeight || !this.itemHeight) return 20;
      return Math.ceil(this.clientHeight / this.itemHeight) + this.buffer * 2;
    },
    startIndex() {
      return Math.max(0, Math.floor(this.scrollTop / this.itemHeight));
    },
    endIndex() {
      return Math.min(this.total, this.startIndex + this.visibleCount);
    },
    visibleItems() {
      return this.items.slice(this.startIndex, this.endIndex);
    },
    topPlaceholderHeight() {
      return formatSize(this.startIndex * this.itemHeight);
    },
    bottomPlaceholderHeight() {
      return formatSize((this.total - this.endIndex) * this.itemHeight);
    }
  },
  mounted() {
    this.updateClientHeight();
    this.setupResizeListener();
  },
  beforeDestroy() {
    this.cleanupResizeListener();
  },
  methods: {
    /**
     * 判断是否应使用 nodeKey 字段
     */
    _shouldUseNodeKey() {
      return this.nodeKey && typeof this.nodeKey === 'string' && this.nodeKey.trim() !== '';
    },

    /**
     * 获取 item 的唯一 key（用于 v-for）
     */
    getNodeKey(item, index) {
      if (this._shouldUseNodeKey() && item != null && typeof item === 'object') {
        const key = item[this.nodeKey];
        if (key != null) {
          return key;
        }
      }
      return index;
    },

    updateClientHeight() {
      if (this.$refs.rootRef) {
        this.clientHeight = this.$refs.rootRef.clientHeight;
      }
    },

    setupResizeListener() {
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          this.updateClientHeight();
        });
        this.resizeObserver.observe(this.$refs.rootRef);
      } else {
        window.addEventListener('resize', this.handleWindowResize);
      }
    },

    cleanupResizeListener() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = null;
      }
      window.removeEventListener('resize', this.handleWindowResize);
    },

    handleWindowResize() {
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
      }
      this.resizeTimer = setTimeout(() => {
        this.updateClientHeight();
      }, 100);
    },

    handleScroll(e) {
      this.scrollTop = e.target.scrollTop;
      this.$emit('scroll', e);

      const { scrollHeight, clientHeight, scrollTop } = e.target;
      if (scrollTop === 0) this.$emit('reach-top');
      if (scrollHeight - clientHeight - scrollTop < 100) this.$emit('reach-bottom');
      this.$emit('visible-change', { startIndex: this.startIndex, endIndex: this.endIndex });
    },

    refresh() {
      this.updateClientHeight();
    },

    /**
     * 内部滚动方法（仅设置 DOM scrollTop，状态由 handleScroll 同步）
     */
    _setScrollTop(scrollTop) {
      if (this.$refs.rootRef) {
        this.$refs.rootRef.scrollTop = scrollTop;
      }
    },

    /**
     * 滚动到指定目标
     * - 若启用了有效的 nodeKey，则 target 视为 keyValue
     * - 否则，target 必须是 number（index）
     */
    scrollTo(target) {
      if (target == null) {
        // eslint-disable-next-line no-console
        console.warn('[HiVirtualList] scrollTo: target cannot be null or undefined');
        return;
      }

      let index = -1;

      // 使用 getNodeKey 生成的 key 进行匹配（严格对齐）
      if (this._shouldUseNodeKey()) {
        index = this.items.findIndex((item, i) => {
          return this.getNodeKey(item, i) === target;
        });
      } else {
        // 降级到 index 模式
        if (typeof target === 'number' && target >= 0 && target < this.total) {
          index = target;
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            '[HiVirtualList] scrollTo: when nodeKey is not provided, target must be a valid index (number).'
          );
          return;
        }
      }

      if (index < 0 || index >= this.total) {
        if (this._shouldUseNodeKey()) {
          // eslint-disable-next-line no-console
          console.warn(`[HiVirtualList] scrollTo: item with key "${target}" not found`);
        } else {
          // eslint-disable-next-line no-console
          console.warn(`[HiVirtualList] scrollTo: index ${target} is out of range [0, ${this.total})`);
        }
        return;
      }

      this._setScrollTop(index * this.itemHeight);
    },

    scrollToTop() {
      this._setScrollTop(0);
    },

    scrollToBottom() {
      this._setScrollTop(this.total * this.itemHeight);
    },

    getVisibleRange() {
      return {
        startIndex: this.startIndex,
        endIndex: this.endIndex
      };
    }
  }
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
