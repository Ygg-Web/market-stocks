import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import Chartkick from 'vue-chartkick';
import { Chart } from 'chart.js';
import App from '@/App.vue';
import router from '@/router/index';
import store from '@/store';
import vuetify from '@/plugins/vuetify';
import 'mdi-icons/css/materialdesignicons.min.css';
import './css/index.css';

Vue.config.productionTip = false;

Vue.use(Chartkick.use(Chart));
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: 'http://localhost:3000',
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
    },
  })
);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
