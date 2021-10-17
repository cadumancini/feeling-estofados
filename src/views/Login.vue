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
import axios from 'axios'
export default {
  name: 'Login',
  data () {
    return {
      user: '',
      password: ''
    }
  },
  mounted () {
    if (sessionStorage.getItem('token')) {
      this.$router.push({ name: 'Home' })
    }
    this.$refs.inputUser.focus()
  },
  methods: {
    handleSubmit () {
      const formData = new FormData()
      formData.append('user', this.user)
      formData.append('pswd', this.password)
      axios.post('http://localhost:8080/login', formData)
        .then((response) => {
          if (response.data === 'Credenciais inválidas') {
            alert(response.data)
            this.$refs.inputUser.focus()
          } else {
            sessionStorage.setItem('token', response.data)
            this.$router.push({ name: 'Home' })
          }
        })
        .catch((err) => console.log(err))
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
