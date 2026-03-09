// 导入组件
import HiCardList from './src/index.vue';
import HiCardItem from './src/item.vue';

// 设置组件名称
HiCardList.name = 'HiCardList';
HiCardItem.name = 'HiCardItem';

// 安装函数
const install = Vue => {
  Vue.component(HiCardList.name, HiCardList);
  Vue.component(HiCardItem.name, HiCardItem);
};

// 按需引入
export { HiCardList, HiCardItem };

// 默认导出
export default {
  install,
  HiCardList,
  HiCardItem
};
