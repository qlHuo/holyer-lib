// UI组件库的入口文件,用于导出所有组件并提供安装方法

import { HiCardList, HiCardItem } from './card-list';
import { HiExpandPanel } from './expand-panel';
import { HiExpandText } from './expand-text';
import { HiTitle } from './title';
import { HiVirtualList } from './virtual-list';

// eslint-disable-next-line prettier/prettier
const components = [HiCardList, HiCardItem, HiExpandPanel, HiExpandText, HiTitle, HiVirtualList];

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

// eslint-disable-next-line prettier/prettier
export { HiCardList, HiCardItem, HiExpandPanel, HiExpandText, HiTitle, HiVirtualList };

export default {
  install,
  HiCardList,
  HiCardItem,
  HiExpandPanel,
  HiExpandText,
  HiTitle,
  HiVirtualList
};
