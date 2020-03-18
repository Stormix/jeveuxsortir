import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './assets/tailwind.css'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueSignaturePad from 'vue-signature-pad'
import VueSocketIO from 'vue-socket.io'

const port = process.env.BACKEND_PORT || 3000
const host = process.env.HOST || 'localhost'
const protocol = process.env.HTTP || 'http'

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: `${protocol}://${host}:${port}`,
    secure: protocol === 'https'
  })
)

Vue.use(VueSignaturePad)
Vue.use(Buefy)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
