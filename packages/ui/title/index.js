import HiTitle from './src/index.vue';

// 显式设置 name（避免 .vue 丢失）
HiTitle.name = 'HiTitle';

// 添加 install
HiTitle.install = (Vue) => {
  Vue.component(HiTitle.name, HiTitle);
};

export default HiTitle;