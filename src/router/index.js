import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import GerarPedido from '../views/GerarPedido.vue'

const routes = [
  {
    path: '/',
    name: 'GerarPedido',
    component: GerarPedido
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
