<template>
  <div class="holyer-lib-view">
    <HiTitle content="HOLYER-LIB 组件说明" size="large" />

    <HiTitle
      class="mt-16"
      content="01. title组件"
      size="medium"
      color="var(--td-error-color)"
      description="title组件用户标题的说明，支持props和插槽配置标题文本，支持配置颜色，支持large/medium/small三种大小, 支持自定义装饰条，支持描述信息（支持插槽和props两种方式）"
    />

    <HiTitle
      class="mt-16"
      content="01. title组件"
      size="small"
      color="var(--td-error-color)"
      description="title组件用户标题的说明，支持props和插槽配置标题文本，支持配置颜色，支持large/medium/small三种大小, 支持自定义装饰条，支持描述信息（支持插槽和props两种方式）"
    />
  </div>
</template>

<script>
export default {
  name: 'HolyerLibView',
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped></style>
