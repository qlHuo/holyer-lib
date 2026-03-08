import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@holyer-lib/styles';
import HiUI from '@holyer-lib/ui';

Vue.use(HiUI);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
