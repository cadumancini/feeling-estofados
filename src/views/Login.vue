<template>
  <div class="text-center login-page">
    <form class="form-signin" @submit.prevent="handleSubmit">
      <img src="../assets/feeling.png" class="mb-4">
      <h1 class="h3 mb-3 font-weight-normal">Pedido Web</h1>
      <input class="form-control" type="text" id="inputUsuario" placeholder="Usuário" required autofocus v-model="user" ref="inputUser">
      <input class="form-control" type="password" id="inputSenha" placeholder="Senha" required v-model="password">
      <button class="btn btn-lg btn-primary btn-block">Login</button>
    </form>
  </div>
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

<style scope>
  html, body {
    height: 100%;
  }
  .login-page {
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-align: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding-top: 40px;
    padding-bottom: 40px;
    height: 100%;
    background-color: #f5f5f5;
  }

  .form-signin {
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: 0 auto;
  }

  .form-signin .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
  }

  .form-signin .form-control:focus {
    z-index: 2;
  }

  .form-signin input[type="text"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }
  .form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
  .btn-block {
    display: block;
    width: 100%;
  }
  /* .formLogin {
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
  } */
</style>
