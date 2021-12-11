<template>
  <div class="home">
    <Navbar/>
    <div id="nav">
      <router-link :to="{ name: 'GerarPedido' }">Gerar Pedido</router-link>
      <br>
      <router-link :to="{ name: 'ManipularPedido' }">Manipular Pedido</router-link>
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
    /* display: -ms-flexbox;
    display: -webkit-box; */
    /* display: flex; */
    /* -ms-flex-align: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center; */
    /* padding-top: 40px; */
    padding-bottom: 40px;
    height: 100%;
    background-color: #f5f5f5;
  }
  ul {
    padding-left: 1em;
    line-height: 1.5em;
    list-style-type: none;
    cursor: pointer;
  }
</style>
