import HiTemplate from './src/index.vue';

HiTemplate.name = 'HiTemplate';

// 添加 install
HiTemplate.install = Vue => {
  Vue.component(HiTemplate.name, HiTemplate);
};

export default HiTemplate;
