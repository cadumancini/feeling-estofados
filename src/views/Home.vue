<template>
  <div class="home">
    <h1>Feeling Estofados</h1>
    <form class="formHome" @submit.prevent="handleSubmit">
      <label>Produto:</label>
      <input type="text" required v-model="product" ref="inputProduct">
      <button>Buscar</button>
      <TreeItem
        v-show="productFound"
        :item="fullProduct"></TreeItem>
    </form>
  </div>
</template>

<script>
import TreeItem from '../components/TreeItem.vue'
export default {
  name: 'Home',
  components: { TreeItem },
  data () {
    return {
      product: '',
      productFound: false,
      fullProduct: ''
    }
  },
  mounted () {
    if (!sessionStorage.getItem('user')) {
      this.$router.push({ name: 'Login' })
    }
    this.$refs.inputProduct.focus()
  },
  methods: {
    handleSubmit () {
      this.productFound = true
      fetch('http://localhost:3000/produtos/1')
        .then(response => response.json())
        .then((data) => {
          console.log('chegou aqui')
          console.log(data)
          this.fullProduct = data
        })
        .catch(err => console.log(err.message))
    }
  }
}

</script>
