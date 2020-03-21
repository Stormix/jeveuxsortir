import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './assets/tailwind.css'
import VueSignaturePad from 'vue-signature-pad'
import VueSocketIO from 'vue-socket.io'
import VueDisqus from 'vue-disqus'

Vue.use(VueDisqus)

const port = process.env.VUE_APP_BACKEND_PORT || 3000
const host = process.env.VUE_APP_HOST || 'localhost'
const protocol = process.env.VUE_APP_HTTP || 'http'

Vue.use(
  new VueSocketIO({
    debug: false,
    connection:
      process.env.NODE_ENV === 'production'
        ? `${protocol}://${host}/`
        : `${protocol}://${host}:${port}`,
    secure: protocol === 'https'
  })
)

Vue.use(VueSignaturePad)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
