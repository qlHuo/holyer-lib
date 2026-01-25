import HiTitle from './src/index.vue';

HiTitle.install = function (Vue) {
  Vue.component(HiTitle.name, HiTitle);
};

export default HiTitle;