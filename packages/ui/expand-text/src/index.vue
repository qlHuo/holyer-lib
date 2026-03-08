<template>
  <div class="hi-expand-text" :style="{ '--hi-expand-text-line-clamp': lineClamp }">
    <div :class="textClass" ref="textRef">
      <div v-if="showToggle" class="hi-expand-text--toggle" @click="handleToggle">
        <slot name="toggleText">{{ expandText }}</slot>
      </div>
      <slot>{{ content }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HiExpandText',
  props: {
    content: {
      type: String,
      default: ''
    },

    /**
     * [0]: 展开时显示的文本，[1]: 收起时显示的文本
     */
    label: {
      type: Array,
      default: () => ['展开', '收起'],
      validator: arr => {
        return arr.length === 2 && arr.every(s => typeof s === 'string');
      }
    },

    lineClamp: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      showToggle: false,
      isExpanded: false,
      resizeTimer: null,
      resizeObserver: null
    };
  },
  computed: {
    expandText() {
      return this.isExpanded ? this.label[1] : this.label[0];
    },

    textClass() {
      return {
        'hi-expand-text--content': true,
        'hi-expand-text--content__show-toggle': this.showToggle,
        'hi-expand-text--content__expanded': this.isExpanded
      };
    }
  },

  watch: {
    content() {
      this.$nextTick(this.checkEllipsis);
    }
  },
  mounted() {
    this.checkEllipsis();
    window.addEventListener('resize', this.handleResize);
    if (window.ResizeObserver && this.$el) {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(this.$el);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
  },

  methods: {
    handleResize() {
      if (this.resizeTimer) clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.checkEllipsis();
      }, 100);
    },

    /**
     * @Description 检查是否存在溢出情况，兼容展开和收起两种状态
     * @Author holyer
     * @Date 2026/02/08 17:01:51
     */
    checkEllipsis() {
      const textEl = this.$refs.textRef;
      if (!textEl || !textEl.offsetParent) {
        this.showToggle = false;
        return;
      }

      if (this.isExpanded) {
        // 展开状态下：模拟收起状态，检测是否需要 toggle
        this.showToggle = this.wouldOverflowIfCollapsed(textEl);
      } else {
        // 收起状态下：直接检测是否溢出
        this.showToggle = textEl.scrollHeight - textEl.clientHeight > 2;
      }
    },

    /**
     * 模拟收起状态，检测内容是否会溢出
     */
    wouldOverflowIfCollapsed(el) {
      // 1. 保存原始状态
      const originalDisplay = el.style.display;
      const originalWebkitLineClamp = el.style.webkitLineClamp;
      const originalClassList = el.className;

      try {
        // 2. 临时应用“收起”样式，移除 --expanded 和 --show-toggle
        el.className = 'hi-expand-text--content';
        el.style.display = '-webkit-box';
        el.style.webkitBoxOrient = 'vertical';
        el.style.overflow = 'hidden';
        el.style.webkitLineClamp = this.lineClamp;

        // 3. 强制 reflow（触发 layout）
        const { scrollHeight, clientHeight } = el;

        // 4. 判断是否溢出
        return scrollHeight - clientHeight > 2;
      } finally {
        // 5. 恢复原始状态（确保无副作用）
        el.className = originalClassList;
        el.style.display = originalDisplay;
        el.style.webkitLineClamp = originalWebkitLineClamp;
      }
    },

    handleToggle() {
      this.isExpanded = !this.isExpanded;
      this.$emit('toggle', this.isExpanded);
    },

    // 供外部手动更新
    update() {
      this.$nextTick(this.checkEllipsis);
    }
  }
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
