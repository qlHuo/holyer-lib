import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '@holyer-lib/styles';
import HiTitle from '@holyer-lib/title';

Vue.use(HiTitle);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
