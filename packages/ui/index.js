import HiTitle from './title'

const components = [HiTitle];

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

export default { install, HiTitle };