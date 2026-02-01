<template>
  <div class="hi-title">
    <slot>{{ content }}</slot>
  </div>
</template>

<script>
import './index.less';
export default {
  name: 'HiTitle',
  props: {
    content: {
      type: String,
      default: '标题'
    }
  },
  data() {
    return {};
  }
};
</script>
