<template>
  <nav class="navbar navbar-expand-md navbar-light mb-4" style="background-color: #dedede;">
    <a class="navbar-brand" href="/"><img alt="Feeling" src="../assets/feeling.png"></a>
    <ul class="navbar-nav ms-auto">
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
