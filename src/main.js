import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faReceipt, faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

library.add(faReceipt)
library.add(faEdit)
createApp(App).use(router).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
