<template>
  <h1>Feeling Estofados</h1>
  <h3>Informe o usuário e a senha para fazer login:</h3>
  <form class="formLogin" @submit.prevent="handleSubmit">
    <label class="labelLogin">Usuário:</label>
    <input class="inputLogin" type="text" required v-model="user" ref="inputUser">
    <label class="labelLogin">Senha:</label>
    <input class="inputLogin" type="password" required v-model="password">
    <button class="buttonLogin">Login</button>
  </form>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      user: '',
      password: ''
    }
  },
  mounted () {
    if (sessionStorage.getItem('user')) {
      this.$router.push({ name: 'Home' })
    }
    this.$refs.inputUser.focus()
  },
  methods: {
    handleSubmit () {
      if (this.user !== 'test' && this.password !== 'test') {
        alert('Credenciais inválidas.')
        this.user = ''
        this.password = ''
        this.$refs.inputUser.focus()
      } else {
        sessionStorage.setItem('user', this.user)
        this.$router.push({ name: 'Home' })
      }
    }
  }
}
</script>

<style>
  h1, h3 {
    text-align: center;
  }
  .formLogin {
      max-width: 420px;
      margin: 30px auto;
      text-align: left;
      padding: 40px;
      border-radius: 10px;
    }
  .labelLogin {
    display: inline-block;
    margin: 25px 0 15px;
    font-weight: bold;
  }
  .inputLogin {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
  }
  .buttonLogin {
    background: blue;
    border: 0;
    padding: 10px 20px;
    margin: 0 auto;
    display: block;
    margin-top: 20px;
    color: white;
    border-radius: 20px;
  }
  .submit {
    text-align: center;
  }
</style>
