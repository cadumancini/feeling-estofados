<template>
  <h1>Feeling Estofados</h1>
  <label for="pedido">Pedido:</label>
  <input id="pedido" type="number" v-model="pedido">
  <button @click="buscaPedido">Buscar</button>
  <ul v-if="itens.length">
    <li v-for="item in itens" :key="item.SEQIPD">Seq. {{ item.SEQIPD }} | Prod. {{ item.CODPRO }} | Der. {{ item.CODDER }} | Qtde. {{ item.QTDPED }}</li>
  </ul>
</template>

<script>
import axios from 'axios'
export default {
  props: ['numPed'],
  data () {
    return {
      pedido: this.numPed,
      itens: []
    }
  },
  methods: {
    buscaPedido () {
      if (this.numPed === '') {
        alert('Favor preencher o pedido')
      } else {
        const token = sessionStorage.getItem('token')
        axios.get('http://localhost:8080/itensPedido?emp=1&fil=1&ped=' + this.numPed + '&token=' + token)
          .then((response) => {
            this.itens = response.data.itens
            console.log(this.itens)
          })
          .catch((err) => console.log(err))
      }
    }
  }
}
</script>
