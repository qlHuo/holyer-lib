import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@holyer-lib/styles';
import HiTitle from '@holyer-lib/title';
import HiExpandText from '@holyer-lib/expand-text';
import HiVirtualList from '@holyer-lib/virtual-list';
import HiExpandPanel from '@holyer-lib/expand-panel';

Vue.use(HiTitle);
Vue.use(HiExpandText);
Vue.use(HiVirtualList);
Vue.use(HiExpandPanel);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
