<template>
  <div class="directives" v-waterMark="{ text: 'HOLYER-DIRECTIVES', fontSize: 16 }" v-resize="handleResize">
    <HiTitle content="01. 复制" />

    <div v-copy="'复制内容'">复制内容</div>
  </div>
</template>

<script>
export default {
  name: 'About',
  props: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    handleResize() {
      console.log('handleResize');
    }
  }
};
</script>

<style scoped>
.directives {
  height: 100%;
  width: 100%;
}
</style>
