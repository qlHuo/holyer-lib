<template>
  <div class="holyer-lib-view">
    <HiTitle content="HOLYER-LIB 组件说明" size="large" />

    <HiTitle class="mt-16" content="01. title组件" size="medium" />
    <HiTitle
      class="mt-16"
      content="title组件示例"
      size="medium"
      color="var(--td-error-color)"
      description="title组件用户标题的说明，支持props和插槽配置标题文本，支持配置颜色，支持large/medium/small三种大小, 支持自定义装饰条，支持描述信息（支持插槽和props两种方式）"
    />

    <HiTitle class="mt-16" content="02. expand-text组件" />
    <HiExpandText class="mt-16" :line-clamp="2">
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </div>
    </HiExpandText>

    <HiTitle class="mt-16 mb-16" content="03. virtual-list组件" />
    <div class="flex-middle">
      <button @click="handleScrollTop">滚动到顶部</button>
      <button class="ml-8 mr-8" @click="handleScrollBottom">滚动到底部</button>
      <button @click="handleScrollTo8888">滚动到8888项</button>
    </div>
    <HiVirtualList
      ref="virtualListRef"
      class="mt-16 virtual-list-demo"
      :items="Array.from({ length: 100000 }, (_, i) => ({ id: i, text: `Item ${i}` }))"
      :item-height="30"
      :buffer="20"
      height="300px"
    >
      <template #default="{ item, index }">
        <div class="list-item">{{ index }} - {{ item.text }}</div>
      </template>
    </HiVirtualList>
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
  methods: {
    handleToggle(type) {
      console.log('toggle', type);
    },

    handleScrollTop() {
      if (this.$refs.virtualListRef) {
        this.$refs.virtualListRef.scrollToTop();
      }
    },

    handleScrollBottom() {
      if (this.$refs.virtualListRef) {
        this.$refs.virtualListRef.scrollToBottom();
      }
    },

    handleScrollTo8888() {
      if (this.$refs.virtualListRef) {
        this.$refs.virtualListRef.scrollTo(8888);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.virtual-list-demo {
  border: 1px solid #ccc;
  .list-item {
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border-bottom: 1px solid #eee;
  }
}
</style>
