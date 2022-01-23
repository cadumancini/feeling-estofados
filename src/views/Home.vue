<template>
  <div class="home">
    <Navbar/>
    <div class="d-flex justify-content-around align-items-center main-menu">
      <router-link :to="{ name: 'GerarPedido' }" class="d-flex flex-column align-items-center link-main-menu text-decoration-none"><font-awesome-icon icon="receipt" size="10x"/><span class="pt-4 display-6">Gerar Pedido</span></router-link>
      <router-link :to="{ name: 'ManipularPedido' }" class="d-flex flex-column align-items-center link-main-menu text-decoration-none"><font-awesome-icon icon="edit" size="10x"/><span class="pt-4 display-6">Manipular Pedido</span></router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
export default {
  name: 'Home',
  components: { Navbar },
  mounted () {
    if (!sessionStorage.getItem('token')) {
      this.$router.push({ name: 'Login' })
    }
  }
}

</script>

<style scoped>
  html, body {
    height: 100%;
  }
  .home {
    height: 100%;
    background-color: #f5f5f5;
  }
  .link-main-menu {
    color: #7a7a7a;
  }
  .main-menu {
    height: 75%;
    padding-left: 20%;
    padding-right: 20%;
  }
</style>
