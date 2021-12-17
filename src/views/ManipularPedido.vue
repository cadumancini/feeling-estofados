<template>
  <div class="manipularPedido">
    <Navbar/>
    <div class="mx-3">
      <div class="row mb-3">
        <p class="fw-bold fs-3">Manipulação de Pedido</p>
      </div>
      <div class="row mb-3">
        <label for="pedido" class="form-label">Pedido:</label>
        <div class="col-auto">
          <input id="pedido" class="form-control" type="number" v-model="pedido" ref="inputPedido">
        </div>
        <div class="col-auto">
          <button class="btn btn-secondary" @click="buscaPedido">Buscar</button>
        </div>
        <div class="col-auto">
          <button class="btn btn-secondary" @click="limpar">Cancelar</button>
        </div>
      </div>

      <div class="row mb-3 mx-0">
        <table v-if="itens.length" class="table table-striped table-bordered table-sm table-responsive">
          <thead>
            <tr class="table-dark">
              <th class="fw-normal">Seq</th>
              <th class="fw-normal">Produto</th>
              <th class="fw-normal">Der.</th>
              <th class="fw-normal">Descrição</th>
              <th class="fw-normal">Qtde.</th>
              <th class="fw-normal">Ação</th>
            </tr>
          </thead>
          <tbody v-for="item in itens" :key="item.codPro">
            <tr>
              <td class="fw-normal">{{ item.SEQIPD }}</td>
              <td class="fw-normal">{{ item.CODPRO }}</td>
              <td class="fw-normal">{{ item.CODDER }}</td>
              <td class="fw-normal">{{ item.DSCPRO }}</td>
              <td class="fw-normal">{{ item.QTDPED }}</td>
              <td><button class="btn btn-sm btn-primary" @click="manipularItem(item)">Manipular</button></td>
            </tr>
            <tr v-if="item.MANIPULAR">
              <td colspan="6">
                <table class="table table-hover table-bordered table-sm table-responsive">
                  <thead>
                    <tr class="table-secondary">
                      <th class="fw-normal">Nível</th>
                      <th class="fw-normal">Produto</th>
                      <th class="fw-normal">Der.</th>
                      <th class="fw-normal">Descrição</th>
                      <th class="fw-normal">Qtde.</th>
                      <th class="fw-normal">U.M.</th>
                      <th class="fw-normal">Troca</th>
                      <th class="fw-normal">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <TreeItem
                      v-if="item.PRODUCTFOUND"
                      :item="item.ACABADO"
                      @trocar="(itemTroca) => efetuarTroca(item, itemTroca)"/>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import TreeItem from '../components/TreeItem.vue'
import axios from 'axios'
export default {
  props: ['numPed'],
  components: { TreeItem, Navbar },
  data () {
    return {
      pedido: this.numPed,
      itens: [],
      trocas: []
    }
  },
  methods: {
    limpar () {
      console.log('limpando')
      this.pedido = ''
      this.itens = []
      this.$nextTick(() => this.$refs.inputPedido.focus())
    },
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
        axios.get('http://localhost:8080/equivalentesAdicionais?emp=1&modelo=' + component.codMod + '&componente=' + component.codPro + '&der=' + component.codDer + '&token=' + token)
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

<style scoped>
  html, body {
      height: 100%;
    }
  .manipularPedido {
    height: 100%;
    background-color: #f5f5f5;
  }
</style>
