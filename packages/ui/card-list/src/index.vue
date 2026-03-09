<template>
  <div class="hi-card-list" :style="styles">
    <div class="hi-card-list--content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { formatSize } from '@holyer-lib/utils';

export default {
  name: 'HiCardList',
  provide() {
    return {
      HiCardList: this
    };
  },
  props: {
    col: {
      type: Number,
      default: 4
    },
    gutter: {
      type: Number,
      default: 16
    },
    // 大于1920px (最大屏幕) - 6列
    xl: {
      type: Number,
      default: null
    },
    // 1680px ~ 1920px - 5列
    lg: {
      type: Number,
      default: null
    },
    // 1280px ~ 1680px - 4列
    md: {
      type: Number,
      default: null
    },
    // 960px ~ 1280px - 3列
    sm: {
      type: Number,
      default: null
    },
    // 小于960px (最小屏幕) - 2列
    xs: {
      type: Number,
      default: null
    },
    // 小于768px (最小屏幕) - 1列
    xxs: {
      type: Number,
      default: null
    },
    // 卡片高度
    cardHeight: {
      type: [String, Number],
      default: '48px'
    },
    borderRadius: {
      type: [String, Number],
      default: '8px'
    },
    borderColor: {
      type: String,
      default: '#E6E6E6'
    },
    itemClass: {
      type: String,
      default: ''
    },
    cardPadding: {
      type: [String, Number],
      default: '16px'
    }
  },
  computed: {
    styles() {
      return {
        // 根据不同的屏幕尺寸设置不同的列数
        '--col-count': this.col,
        '--xl-col-count': this.xl || this.col,
        '--lg-col-count': this.lg || this.col,
        '--md-col-count': this.md || this.col,
        '--sm-col-count': this.sm || this.col,
        '--xs-col-count': this.xs || this.col,
        '--xxs-col-count': this.xxs || this.col,
        '--card-height': formatSize(this.cardHeight), // 设置卡片的高度
        '--card-border-radius': formatSize(this.borderRadius),
        '--card-border-color': this.borderColor,
        '--card-padding': formatSize(this.cardPadding),
        '--card-gutter': formatSize(this.gutter)
      };
    }
  }
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
