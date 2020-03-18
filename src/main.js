import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './assets/tailwind.css'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueSignaturePad from 'vue-signature-pad'

Vue.use(VueSignaturePad)
Vue.use(Buefy)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
