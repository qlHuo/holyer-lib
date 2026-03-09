<template>
  <div :class="cardItemClass" @click.stop="$emit('click')">
    <div class="header" v-if="$slots.title || title">
      <div class="hi-card-item--header">
        <div class="hi-card-item--header_icon" v-if="$slots.icon || icon">
          <slot name="icon"></slot>
        </div>
        <div class="hi-card-item--header_title" v-if="$slots.title || title">
          <slot name="title">
            <div class="text-hide-1">
              {{ title }}
            </div>
          </slot>
        </div>
      </div>
    </div>
    <div class="hi-card-item--content" v-if="$slots.content || content">
      <slot name="content">
        <span :title="content">{{ content }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HiCardItem',
  inject: ['HiCardList'],
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    actived: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cardItemClass() {
      const baseClasses = {
        'hi-card-item': true,
        'hi-card-item--active': this.actived
      };
      const itemClass = this.HiCardList?.itemClass || '';
      return [baseClasses, ...itemClass.split(' ').filter(Boolean)];
    }
  }
};
</script>

<style lang="less" scoped>
@import './item.less';
</style>
