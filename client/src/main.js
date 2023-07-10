import '@babel/polyfill';
import 'mutationobserver-shim';
import '@/_plugins/fontawesome';
import 'element-ui/lib/theme-chalk/index.css';
import '@/_plugins/bootstrap-vue';

import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/pt-br';
import Api from '@/_plugins/axios';
import Vuelidate from 'vuelidate';
import { BootstrapVue } from 'bootstrap-vue';

import router from '@/router';
import store from '@/store';

import CompModalForm from '@/components/CompModalForm';
import CompTree from '@/components/CompTree';
import CompTreeNode from '@/components/CompTreeNode';
import CompLaudo from '@/components/CompLaudo';

Vue.config.productionTip = false;
Vue.prototype.$project = require('@/project.json');
Vue.prototype.$http = Api;
Vue.component('cp-modal-form', CompModalForm);
Vue.component('cp-laudos-tree', CompTree);
Vue.component('cp-laudos-tree-node', CompTreeNode);
Vue.component('cp-laudo', CompLaudo);
Vue.use(Vuelidate);
Vue.use(BootstrapVue);
Vue.use(ElementUI, {locale});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')