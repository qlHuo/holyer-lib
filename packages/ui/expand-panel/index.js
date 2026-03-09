import HiExpandPanel from './src/index.vue';

HiExpandPanel.name = 'HiExpandPanel';

// 添加 install
HiExpandPanel.install = Vue => {
  Vue.component(HiExpandPanel.name, HiExpandPanel);
};

export { HiExpandPanel };

export default HiExpandPanel;
