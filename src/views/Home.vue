<template>
  <div class="home">
    <h1>Feeling Estofados</h1>
    <form class="formHome" @submit.prevent="handleSubmit">
      <label>Produto:</label>
      <input type="text" required v-model="product" ref="inputProduct">
      <button>Buscar</button>
    </form>
    <div v-if="hasSearched">
      <div v-if="productFound">
        <ul>
          <TreeItem
            v-show="productFound"
            :item="fullProduct"></TreeItem>
        </ul>
      </div>
      <div v-else>
        <p>Produto não encontrado!</p>
      </div>
    </div>
  </div>
</template>

<script>
import TreeItem from '../components/TreeItem.vue'
export default {
  name: 'Home',
  components: { TreeItem },
  data () {
    return {
      hasSearched: false,
      product: '',
      productFound: true,
      fullProduct: ''
    }
  },
  mounted () {
    if (!sessionStorage.getItem('user')) {
      this.$router.push({ name: 'Login' })
    }
    this.$refs.inputProduct.focus()
    this.productFound = false
  },
  methods: {
    async handleSubmit () {
      this.productFound = false
      this.hasSearched = true
      try {
        const response = await fetch('http://localhost:3000/produtos/' + this.product)
        if (!response.ok) {
          this.productFound = false
          throw Error('Produto não encontrado!')
        }
        this.productFound = true
        this.fullProduct = await response.json()
        console.log(this.fullProduct)
      } catch (err) {
        console.log(err.message)
      }
    }
  }
}

</script>

<style>
  ul {
    padding-left: 1em;
    line-height: 1.5em;
    list-style-type: dot;
    cursor: pointer;
  }
</style>
