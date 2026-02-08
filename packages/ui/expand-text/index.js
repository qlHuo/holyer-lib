import HiExpandText from './src/index.vue';

HiExpandText.name = 'HiExpandText';

// 添加 install
HiExpandText.install = Vue => {
  Vue.component(HiExpandText.name, HiExpandText);
};

export default HiExpandText;
