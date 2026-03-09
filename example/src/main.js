import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@holyer-lib/styles';
import { HiCardList, HiCardItem, HiExpandPanel, HiExpandText, HiTitle, HiVirtualList } from '@holyer-lib/ui';

Vue.component('HiCardList', HiCardList);
Vue.component('HiCardItem', HiCardItem);
Vue.component('HiExpandPanel', HiExpandPanel);
Vue.component('HiExpandText', HiExpandText);
Vue.component('HiTitle', HiTitle);
Vue.component('HiVirtualList', HiVirtualList);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
