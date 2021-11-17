<template>
  <h1>Feeling Estofados</h1>
  <label for="pedido">Pedido:</label>
  <input id="pedido" type="number" v-model="pedido">
  <button @click="buscaPedido">Buscar</button>
  <ul v-if="itens.length">
    <li v-for="item in itens" :key="item.SEQIPD">Seq. {{ item.SEQIPD }} | Prod. {{ item.CODPRO }} | Der. {{ item.CODDER }} | Qtde. {{ item.QTDPED }} | <button @click="manipularItem(item)">Manipular Estrutura</button>
      <br>
      <div v-if="item.MANIPULAR">
        <label>Manipulando item {{ item.SEQIPD }}</label>
        <br>
        <ul>
          <TreeItem
            v-show="item.PRODUCTFOUND"
            :item="fullProduct"></TreeItem>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
import TreeItem from '../components/TreeItem.vue'
import axios from 'axios'
export default {
  props: ['numPed'],
  components: { TreeItem },
  data () {
    return {
      pedido: this.numPed,
      itens: [],
      fullProduct: ''
    }
  },
  methods: {
    buscaPedido () {
      if (this.pedido === '' || this.pedido === undefined) {
        alert('Favor preencher o pedido')
      } else {
        const token = sessionStorage.getItem('token')
        axios.get('http://localhost:8080/itensPedido?emp=1&fil=1&ped=' + this.pedido + '&token=' + token)
          .then((response) => {
            this.itens = response.data.itens
          })
          .catch((err) => console.log(err))
      }
    },
    async manipularItem (item) {
      if (item.MANIPULAR) {
        item.MANIPULAR = false
      } else {
        item.MANIPULAR = true
        item.PRODUCTFOUND = false
        const token = sessionStorage.getItem('token')

        var parseString = require('xml2js').parseString
        var json = null
        const response = await axios.get('http://localhost:8080/estrutura?emp=1&fil=1&pro=' + item.CODPRO +
          '&der=' + item.CODDER + '&ped=' + this.pedido + '&ipd=' + item.SEQIPD + '&token=' + token)
        parseString(response.data, { explicitArray: false }, (err, result) => {
          if (err) {
            console.log(err)
          }
          json = result
          item.PRODUCTFOUND = true
          item.ALLCOMPONENTS = json['S:Envelope']['S:Body']['ns2:EstruturaResponse'].result.componentes
        })
        this.parseAllComponentsIntoFullProduct(item.ALLCOMPONENTS)
      }
    },
    parseAllComponentsIntoFullProduct (allComponents) {
      this.fullProduct = allComponents[0] // inserindo primeiro (produto pai) no objeto
      allComponents.shift() // removendo produto pai do array
      allComponents.forEach(component => {
        // percorrer objeto completo
        this.checkNodeChildren(this.fullProduct, component)
      })
    },
    checkNodeChildren (node, component) {
      // comparar niveis
      if ((node.codNiv === component.codNiv.substring(0, node.codNiv.length)) &&
          (/^\.\d+$/.test(component.codNiv.substring(node.codNiv.length)))) {
        if (node.filhos) {
          node.filhos.push(component)
        } else {
          node.filhos = [component]
        }
      } else {
        if (node.filhos) {
          node.filhos.forEach(filho => this.checkNodeChildren(filho, component))
        }
      }
    }
  }
}
</script>
