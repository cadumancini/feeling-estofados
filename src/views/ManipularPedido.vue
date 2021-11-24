<template>
  <h1>Feeling Estofados</h1>
  <label for="pedido">Pedido:</label>
  <input id="pedido" type="number" v-model="pedido">
  <button @click="buscaPedido">Buscar</button>
  <ul v-if="itens.length">
    <li v-for="item in itens" :key="item.SEQIPD">Seq. {{ item.SEQIPD }} | Prod. {{ item.CODPRO }} | Der. {{ item.CODDER }} | Qtde. {{ item.QTDPED }} | <button @click="manipularItem(item)">Manipular Estrutura</button>
      <br>
      <div v-if="item.MANIPULAR">
        <ul>
          <TreeItem
            v-if="item.PRODUCTFOUND"
            :item="item.ACABADO"></TreeItem>
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
      itens: []
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
          item.ALLCOMPONENTS = json['S:Envelope']['S:Body']['ns2:EstruturaResponse'].result.componentes
          item.ACABADO = item.ALLCOMPONENTS[0] // inserindo primeiro (produto pai) no objeto
        })
        await this.parseAllComponentsIntoFullProduct(item)
        item.PRODUCTFOUND = true
        await this.markItemsToExchange(item.ACABADO)
        console.log(item.ACABADO)
      }
    },
    async parseAllComponentsIntoFullProduct (item) {
      item.ALLCOMPONENTS.shift() // removendo produto pai do array
      item.ALLCOMPONENTS.forEach(component => {
        // percorrer objeto completo
        this.checkNodeChildren(item.ACABADO, component)
      })
    },
    async checkNodeChildren (node, component) {
      // comparar niveis
      if ((node.codNiv === component.codNiv.substring(0, node.codNiv.length)) &&
          (/^\.\d+$/.test(component.codNiv.substring(node.codNiv.length)))) {
        if (node.filhos) {
          node.filhos.push(component)
        } else {
          node.filhos = [component]
        }
        if (component.codDer === 'G') {
          node.temG = true
        }
        // Buscar dados adicionais:
        const token = sessionStorage.getItem('token')
        let dadosProduto = null
        await axios.get('http://localhost:8080/dadosProduto?emp=1&pro=' + component.codPro + '&token=' + token)
          .then((response) => {
            dadosProduto = response.data.dados
            component.exiCmp = dadosProduto[0].EXICMP
            component.proGen = dadosProduto[0].PROGEN
            component.codFam = dadosProduto[0].CODFAM
            if (component.proGen === 'S') {
              node.temGen = true
              node.trocar = true
            }
          })
          .catch((err) => console.log(err))
      } else {
        if (node.filhos) {
          node.filhos.forEach(filho => {
            this.checkNodeChildren(filho, component)
          })
        }
      }
    },
    async markItemsToExchange (node) {
      if (node.filhos) {
        node.filhos.forEach(filho => this.checkItems(node, filho))
      }
    },
    checkItems (pai, filho) {
      if (filho.temG || filho.trocar) {
        pai.trocar = true
      }
      if (filho.filhos) {
        filho.filhos.forEach(neto => this.checkItems(filho, neto))
      }
      if (filho.temG || filho.trocar) {
        pai.trocar = true
      }
      if (filho.temGen) {
        console.log('AQUI!!!!')
      }
    }
  }
}
</script>
