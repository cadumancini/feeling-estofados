<template>
  <div class="home">
    <h1>Feeling Estofados</h1>
    <div id="nav">
      <router-link :to="{ name: 'GerarPedido' }">Gerar Pedido</router-link>
      <br>
      <router-link :to="{ name: 'ManipularPedido' }">Manipular Pedido</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted () {
    if (!sessionStorage.getItem('token')) {
      this.$router.push({ name: 'Login' })
    }
  }
}

</script>

<style scoped>
  ul {
    padding-left: 1em;
    line-height: 1.5em;
    list-style-type: none;
    cursor: pointer;
  }
</style>
