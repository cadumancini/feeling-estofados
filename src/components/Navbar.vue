<template>
  <nav class="navbar navbar-expand-md navbar-light mb-4" style="background-color: #dedede;">
    <a class="navbar-brand" href="/"><img alt="Feeling" src="../assets/feeling.png"></a>
    <ul class="navbar-nav ms-auto">
      <li class="nav-item active">
        <router-link class="nav-link" :to="{ name: 'Home' }">Home</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" :to="{ name: 'GerarPedido' }">Gerar Pedido</router-link>
      </li>
      <li class="nav-item">
      <router-link class="nav-link" :to="{ name: 'ManipularPedido' }">Manipular Pedido</router-link>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" @click="logout">Logout</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    logout () {
      sessionStorage.removeItem('token')
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>
