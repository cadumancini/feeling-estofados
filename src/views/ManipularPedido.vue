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
            :item="item.ACABADO"
            @trocar="(itemTroca) => efetuarTroca(item, itemTroca)"/>
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
      trocas: []
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
        this.parseAllComponentsIntoFullProduct(item)
        item.PRODUCTFOUND = true
      }
    },
    async parseAllComponentsIntoFullProduct (item) {
      item.ALLCOMPONENTS.shift() // removendo produto pai do array
      item.ALLCOMPONENTS.forEach(async component => {
        // percorrer objeto completo
        await this.checkNodeChildren(item.ACABADO, component)
      })
      this.markItemsToExchange(item.ACABADO)
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
        component.codMod = node.codPro
        component.derMod = node.codDer
        const token = sessionStorage.getItem('token')
        axios.get('http://localhost:8080/equivalentesAdicionais?modelo=' + component.codMod + '&componente=' + component.codPro + '&der=' + component.codDer + '&token=' + token)
          .then((response) => {
            if (response.data.equivalentes.length) {
              component.podeTrocar = true
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
    markItemsToExchange (node) {
      if (node.filhos) {
        node.filhos.forEach(filho => this.checkItems(node, filho))
      }
    },
    checkItems (pai, filho) {
      if ((filho.codDer === 'G' || filho.proGen === 'S') && filho.exiCmp !== 'S') {
        pai.temG = true
      }
      if (filho.temG || filho.trocar) {
        pai.trocar = true
      }
      if (filho.filhos) {
        filho.filhos.forEach(neto => this.checkItems(filho, neto))
      }
      if (filho.temG || filho.trocar) {
        pai.trocar = true
      }
      if ((filho.codDer === 'G' || filho.proGen === 'S') && filho.exiCmp !== 'S') {
        pai.temG = true
      }
    },
    efetuarTroca (item, itemTroca) {
      const seqIpd = item.SEQIPD
      this.trocas = []
      this.trocas.push(itemTroca)
      item.ACABADO.filhos.forEach(filho => this.analisarSeTrocarFilhos(item, filho, itemTroca, seqIpd))
      console.log(this.trocas)
      this.requestTroca(this.pedido, seqIpd)
      this.manipularItem(item)
    },
    analisarSeTrocarFilhos (pai, filho, itemTroca, seqIpd) {
      if (filho.codPro === itemTroca.cmpAnt &&
        filho.codDer === itemTroca.derAnt &&
        filho.codNiv !== itemTroca.codNiv &&
        (filho.codDer === 'G' || filho.proGen === 'S')) {
        const objTroca = {
          codNiv: filho.codNiv,
          codMod: pai.codPro,
          derMod: pai.codDer,
          cmpAnt: filho.codPro,
          derAnt: filho.codDer,
          cmpAtu: itemTroca.cmpAtu,
          derAtu: itemTroca.derAtu,
          dscCmp: itemTroca.dscCmp
        }
        this.trocas.push(objTroca)
      }
      if (filho.filhos) {
        filho.filhos.forEach(neto => this.analisarSeTrocarFilhos(filho, neto, itemTroca, seqIpd))
      }
    },
    async requestTroca (numPed, seqIpd) {
      const token = sessionStorage.getItem('token')
      const codEmp = 1
      const codFil = 1
      return axios.post('http://localhost:8080/equivalente?emp=' + codEmp + '&fil=' + codFil + '&ped=' + numPed + '&ipd=' + seqIpd + '&token=' + token, this.trocas)
        .then((response) => {
          const requestResponse = response.data
          alert(requestResponse)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
