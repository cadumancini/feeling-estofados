<template>
  <div class="mx-3">
    <div class="row mb-1">
      <table v-if="item.MANIPULAR" class="table table-hover table-bordered table-sm table-responsive">
        <thead>
          <tr class="table-secondary">
            <th class="fw-normal sm-header"></th>
            <th class="fw-normal font-small sm-header">Nível (na estrutura ERP)</th>
            <th class="fw-normal font-small sm-header">Produto</th>
            <th class="fw-normal font-small sm-header">Der.</th>
            <th class="fw-normal font-small sm-header">Descrição</th>
            <th class="fw-normal font-small sm-header">Qtde.</th>
            <th class="fw-normal font-small sm-header">U.M.</th>
            <th class="fw-normal font-small sm-header">Ação</th>
            <th class="fw-normal font-small sm-header"></th>
          </tr>
        </thead>
        <tbody>
          <TreeItem
            v-if="item.PRODUCTFOUND"
            :item="item.ACABADO"
            :level=0
            :codEmp="item.CODEMP"
            @trocar="(itemTroca) => efetuarTroca(item, itemTroca)"/>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import TreeItem from '../components/TreeItem.vue'
import axios from 'axios'
export default {
  components: { TreeItem },
  props: ['seqIpd', 'numPed'],
  data () {
    return {
      pedido: 0,
      item: {},
      trocas: []
    }
  },
  created () {
    this.pedido = this.numPed
    this.item = this.seqIpd
    this.manipularItem()
  },
  methods: {
    checkInvalidLoginResponse (response) {
      if (response === 'Token inválido.') {
        alert('Seu token de acesso não é mais válido. É necessário fazer login novamente.')
        sessionStorage.removeItem('token')
        this.$router.push({ name: 'Login' })
      }
    },
    async manipularItem () {
      if (this.item.MANIPULAR) {
        this.item.MANIPULAR = false
      } else {
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        this.item.MANIPULAR = true
        this.item.PRODUCTFOUND = false
        const token = sessionStorage.getItem('token')

        var parseString = require('xml2js').parseString
        var json = null
        const response = await axios.get('http://192.168.1.168:8080/estrutura?emp=' + this.item.CODEMP + '&fil=1&pro=' + this.item.CODPRO +
          '&der=' + this.item.CODDER + '&ped=' + this.pedido + '&ipd=' + this.item.SEQIPD + '&token=' + token)
        this.checkInvalidLoginResponse(response.data)
        parseString(response.data, { explicitArray: false }, (err, result) => {
          if (err) {
            console.log(err)
          }
          json = result
          this.item.ALLCOMPONENTS = json['S:Envelope']['S:Body']['ns2:EstruturaResponse'].result.componentes
          this.item.ACABADO = this.item.ALLCOMPONENTS[0] // inserindo primeiro (produto pai) no objeto
        })
        this.parseAllComponentsIntoFullProduct(this.item)
        this.item.PRODUCTFOUND = true
        document.getElementsByTagName('body')[0].style.cursor = 'auto'
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
        component.agpMod = node.codAgp
        component.derMod = node.codDer
        const token = sessionStorage.getItem('token')
        axios.get('http://192.168.1.168:8080/equivalentesAdicionais?emp=' + this.item.CODEMP + '&modelo=' + component.codMod + '&componente=' + component.codPro + '&der=' + component.codDer + '&token=' + token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            if (response.data.equivalentes.length) {
              component.podeTrocar = true
              node.filhoPodeTrocar = true
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
    async efetuarTroca (item, itemTroca) {
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      const seqIpd = item.SEQIPD
      this.trocas = []
      this.trocas.push(itemTroca)
      if (itemTroca.codFam === '02001') {
        const token = sessionStorage.getItem('token')
        const codEmp = this.item.CODEMP
        let itensMontagem = null
        await axios.get('http://192.168.1.168:8080/itensMontagem?emp=' + codEmp + '&pro=' + itemTroca.cmpAtu + '&der=' + itemTroca.derAtu + '&token=' + token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            itensMontagem = response.data.itensMontagem
            item.ACABADO.filhos.forEach(filho => this.analisarSeTrocarFilhos(item, filho, itemTroca, seqIpd, itensMontagem))
          })
          .catch((err) => {
            console.log(err)
          })
      }
      this.requestTroca(this.pedido, seqIpd, item)
    },
    analisarSeTrocarFilhos (pai, filho, itemTroca, seqIpd, itensMontagem) {
      if (pai.ACABADO) {
        pai.codPro = pai.ACABADO.codPro
        pai.codDer = pai.ACABADO.codDer
        pai.numOri = pai.ACABADO.numOri
      }
      if (filho.codPro === itemTroca.cmpAnt &&
        filho.codDer === itemTroca.derAnt &&
        filho.codNiv !== itemTroca.codNiv &&
        filho.agpMod === itemTroca.agpMod &&
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
      itensMontagem.forEach(itemMontagem => {
        if (pai.numOri <= 320 &&
        filho.codPro === itemMontagem.CODCMP &&
        (filho.codDer === 'G' || filho.proGen === 'S')) {
          const objTroca = {
            codNiv: filho.codNiv,
            codMod: pai.codPro,
            derMod: pai.codDer,
            cmpAnt: filho.codPro,
            derAnt: filho.codDer,
            cmpAtu: itemMontagem.CODCMP,
            derAtu: itemMontagem.DERCMP,
            dscCmp: itemMontagem.DSCCMP
          }
          this.trocas.push(objTroca)
        }
      })

      if (filho.filhos) {
        filho.filhos.forEach(neto => this.analisarSeTrocarFilhos(filho, neto, itemTroca, seqIpd, itensMontagem))
      }
    },
    async requestTroca (numPed, seqIpd, item) {
      const token = sessionStorage.getItem('token')
      const codEmp = this.item.CODEMP
      const codFil = 1
      return axios.post('http://192.168.1.168:8080/equivalente?emp=' + codEmp + '&fil=' + codFil + '&ped=' + numPed + '&ipd=' + seqIpd + '&token=' + token, this.trocas)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          const requestResponse = response.data
          if (requestResponse === 'OK') {
            alert('Troca realizada com sucesso. Pressione OK para recarregar a estrutura')
          } else {
            alert(requestResponse)
          }
          this.manipularItem(item)
          this.manipularItem(item)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
  .btn-dismiss {
    color: #fff;
    background-color: #aab4bd;
    border-color: #aab4bd;
  }
  .btn-dismiss:hover {
    color: #fff;
    background-color: #93999e;
    border-color: #93999e;
  }
  .sm {
    font-size: 0.8rem !important;
  }
  .sm-header {
    font-size: 0.9rem !important;
  }
</style>
