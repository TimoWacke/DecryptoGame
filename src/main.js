import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'
import './assets/style.scss'

const app = createApp(App)

app.use(router)
app.use(VueCookies, {expires: '7d'})

app.mount('#app')
