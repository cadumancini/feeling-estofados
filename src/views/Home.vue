<template>
  <div class="home">
    <p>Teste</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted () {
    if (!sessionStorage.getItem('user')) {
      this.$router.push({ name: 'Login' })
    }
  }
}

</script>
