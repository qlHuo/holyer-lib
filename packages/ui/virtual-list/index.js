import HiVirtualList from './src/index.vue';

// 显式设置 name（避免 .vue 丢失）
HiVirtualList.name = 'HiVirtualList';

// 添加 install
HiVirtualList.install = Vue => {
  Vue.component(HiVirtualList.name, HiVirtualList);
};

export { HiVirtualList };

export default HiVirtualList;
