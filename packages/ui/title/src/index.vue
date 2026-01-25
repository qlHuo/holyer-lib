<template>
  <div class="hi-title">
    {{ content }}
  </div>
</template>

<script>
export default {
  name: 'HiTitle',
  props: {
    content: {
      type: String,
      default: '标题'
    }
  },
  data() {}
};
</script>

<style scoped>
.title {
  text-align: center;
  margin: 20px 0;
}
</style>
