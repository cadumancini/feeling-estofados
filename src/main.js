import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faReceipt, faEdit, faPlusSquare, faMinusSquare, faExclamationTriangle, faRedoAlt, faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import VueNumberFormat from 'vue-number-format'

library.add(faReceipt)
library.add(faEdit)
library.add(faPlusSquare)
library.add(faMinusSquare)
library.add(faExclamationTriangle)
library.add(faRedoAlt)
library.add(faCheckSquare)
createApp(App).use(router).use(VueNumberFormat, { prefix: '', decimal: ',', thousand: '.' })
  .component('font-awesome-icon', FontAwesomeIcon).mount('#app')
