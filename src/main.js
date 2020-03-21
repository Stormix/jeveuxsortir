import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './assets/tailwind.css'
import VueSignaturePad from 'vue-signature-pad'
import VueDisqus from 'vue-disqus'

Vue.use(VueDisqus)
Vue.use(VueSignaturePad)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
