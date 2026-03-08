import HiExpandPanel from './expand-panel';
import HiExpandText from './expand-text';
import HiTitle from './title';
import HiVirtualList from './virtual-list';

// eslint-disable-next-line prettier/prettier
const components = [
  HiExpandPanel,
  HiExpandText,
  HiTitle,
  HiVirtualList
];

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

export default {
  install,
  HiExpandPanel,
  HiExpandText,
  HiTitle,
  HiVirtualList
};
