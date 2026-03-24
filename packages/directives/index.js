import resize from './resize';
import copy from './copy';
import watermark from './watermark';

// 1. 独立导出每个指令，供按需引入使用
export { resize, copy, watermark };

// 2. 导出一个插件，提供 install 方法，供 Vue.use() 安装使用
export default {
  install(Vue) {
    Vue.directive('resize', resize);
    Vue.directive('copy', copy);
    Vue.directive('watermark', watermark);
  }
};
