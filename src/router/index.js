import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import GerarPedido from '../views/GerarPedido.vue'
import ManipularPedido from '../views/ManipularPedido.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/gerarPedido',
    name: 'GerarPedido',
    component: GerarPedido
  },
  {
    path: '/manipularPedido',
    name: 'ManipularPedido',
    component: ManipularPedido
  },
  {
    path: '/manipularPedido/:numPed',
    name: 'ManipularPedidoComItem',
    component: ManipularPedido,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
