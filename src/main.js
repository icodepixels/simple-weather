import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

/* Import Font Awesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

/* Add icons to the library */
library.add(faSearch)

const app = createApp(App)
const pinia = createPinia()

/* Register Font Awesome component globally */
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(pinia)
app.mount('#app')
