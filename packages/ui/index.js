import HiExpandText from './expand-text';
import HiTitle from './title';

// eslint-disable-next-line prettier/prettier
const components = [
  HiExpandText,
  HiTitle
];

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

export default {
  install,
  HiExpandText,
  HiTitle
};
