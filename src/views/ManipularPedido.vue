<template>
  <div class="mx-3">
    <div class="row mb-1">
      <table v-if="item.MANIPULAR" class="table table-hover table-bordered table-sm table-responsive">
        <thead>
          <tr class="table-secondary">
            <th style="width: 2%;" class="fw-normal sm-header"></th>
            <!-- remover depois -->
            <!-- <th class="fw-normal font-small sm-header">Nível (na estrutura ERP)</th> -->
            <!-- <th class="fw-normal font-small sm-header">Produto</th> -->
            <!-- <th class="fw-normal font-small sm-header">Der.</th> -->
            <th style="width: 88%;" class="fw-normal font-small sm-header">Descrição</th>
            <th style="width: 4%;" class="fw-normal font-small sm-header">Qtde.</th>
            <th style="width: 3%;" class="fw-normal font-small sm-header">U.M.</th>
            <th style="width: 3%;" class="fw-normal font-small sm-header">Ação</th>
            <!-- remover depois -->
            <!-- <th class="fw-normal font-small sm-header">Sit.</th> -->
          </tr>
        </thead>
        <tbody v-if="item.PRODUCTFOUND">
          <TreeItem
            v-for="(child, index) in item.ACABADOS"
            :key="index"
            :item="child"
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
        const response = await axios.get('http://localhost:8080/estrutura?emp=' + this.item.CODEMP + '&fil=1&pro=' + this.item.CODPRO +
          '&der=' + this.item.CODDER + '&ped=' + this.pedido + '&ipd=' + this.item.SEQIPD + '&token=' + token)
        this.checkInvalidLoginResponse(response.data)
        parseString(response.data, { explicitArray: false }, (err, result) => {
          if (err) {
            console.log(err)
          }
          json = result
          this.item.ALLCOMPONENTS = json['S:Envelope']['S:Body']['ns2:EstruturaResponse'].result.componentes
          this.item.ACABADO = this.item.ALLCOMPONENTS[0] // inserindo primeiro (produto pai) no objeto
          this.item.ACABADOS = this.item.ALLCOMPONENTS.filter(comp => /^[1][.]\d+(?!.)/.test(comp.codNiv))
        })
        this.parseAllComponentsIntoFullProduct(this.item)
        this.item.PRODUCTFOUND = true
        document.getElementsByTagName('body')[0].style.cursor = 'auto'
      }
    },
    async parseAllComponentsIntoFullProduct (item) {
      this.item.ACABADOS.forEach(async acabado => {
        acabado.codMod = this.item.CODPRO
        acabado.derMod = this.item.CODDER

        // ver se o pai pode ser trocado
        if (acabado.exiCmp !== 'S') {
          const token = sessionStorage.getItem('token')
          await axios.get('http://localhost:8080/equivalentes?emp=' + this.item.CODEMP + '&modelo=' + this.item.CODPRO + '&componente=' + acabado.codPro + '&derivacao=' + acabado.codDer + '&token=' + token)
            .then((response) => {
              this.checkInvalidLoginResponse(response.data)
              if (response.data.equivalentes.length) {
                acabado.podeTrocar = true
              } else {
                axios.get('http://localhost:8080/derivacoesPossiveis?emp=' + this.item.CODEMP + '&pro=' + this.item.CODPRO + '&mod=' + acabado.codMod + '&derMod=' + acabado.derMod + '&token=' + token)
                  .then((response) => {
                    this.checkInvalidLoginResponse(response.data)
                    if (response.data.derivacoes.length) {
                      acabado.podeTrocar = true
                    }
                  })
                  .catch((err) => console.log(err))
              }
            })
            .catch((err) => {
              console.log(err)
            })
        }
      })
      item.ALLCOMPONENTS.forEach(async component => {
        // percorrer objeto completo
        this.item.ACABADOS.forEach(async acabado => {
          await this.checkNodeChildren(acabado, component)
        })
      })
      this.item.ACABADOS.forEach(acabado => {
        this.markItemsToExchange(acabado)
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
        component.codMod = node.codPro
        component.agpMod = node.codAgp
        component.derMod = node.codDer
        const token = sessionStorage.getItem('token')
        if (component.exiCmp !== 'S') {
          await axios.get('http://localhost:8080/equivalentes?emp=' + this.item.CODEMP + '&modelo=' + component.codMod + '&componente=' + component.codPro + '&derivacao=' + component.codDer + '&token=' + token)
            .then((response) => {
              this.checkInvalidLoginResponse(response.data)
              if (response.data.equivalentes.length) {
                component.equivalentes = response.data.equivalentes
                component.podeTrocar = true
                node.filhoPodeTrocar = true
              } else {
                axios.get('http://localhost:8080/derivacoesPossiveis?emp=' + this.item.CODEMP + '&pro=' + component.codPro + '&mod=' + component.codMod + '&derMod=' + component.derMod + '&token=' + token)
                  .then((response) => {
                    this.checkInvalidLoginResponse(response.data)
                    if (response.data.derivacoes.length) {
                      component.podeTrocar = true
                      node.filhoPodeTrocar = true
                    }
                  })
                  .catch((err) => console.log(err))
              }
              document.getElementsByTagName('body')[0].style.cursor = 'auto'
            })
            .catch((err) => {
              console.log(err)
              document.getElementsByTagName('body')[0].style.cursor = 'auto'
            })
        }
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
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      const seqIpd = item.SEQIPD
      this.trocas = []
      this.trocas.push(itemTroca)
      if (itemTroca.codFam === '02001' || itemTroca.codFam === '02002') {
        const token = sessionStorage.getItem('token')
        const codEmp = this.item.CODEMP
        let itensMontagem = null
        item.ACABADO.filhos.forEach(filho => this.analisarSeTrocarFilhos(item, filho, itemTroca))
        axios.get('http://localhost:8080/itensMontagem?emp=' + codEmp + '&pro=' + itemTroca.cmpAtu + '&der=' + itemTroca.derAtu + '&token=' + token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            itensMontagem = response.data.itensMontagem
            item.ACABADO.filhos.forEach(filho => this.analisarItensMontagem(item, filho, itensMontagem))
          })
          .catch((err) => {
            console.log(err)
          })
      } else if (itemTroca.codFam === '05001') { // talhado
        // Ver se existem outros talhados com o mesmo agrupamento para trocar
        item.ACABADO.filhos.forEach(filho => this.analisarSeTrocarTalhado(item, filho, itemTroca))
      }
      this.requestTroca(this.pedido, seqIpd, item)
    },
    analisarSeTrocarTalhado (pai, filho, itemTroca) {
      if (pai.ACABADO) {
        pai.codPro = pai.ACABADO.codPro
        pai.codDer = pai.ACABADO.codDer
        pai.numOri = pai.ACABADO.numOri
      }
      if (filho.codAgp === itemTroca.codAgp &&
        filho.codNiv !== itemTroca.codNiv) {
        // ver qual é o equivalente do filho
        if (filho.equivalentes.length) {
          if ((itemTroca.dscCmp.includes('TECIDO') && filho.equivalentes[0].DSCEQI.includes('TECIDO')) ||
          (itemTroca.dscCmp.includes('COURO') && filho.equivalentes[0].DSCEQI.includes('COURO'))) {
            const objTroca = {
              codNiv: filho.codNiv,
              codMod: pai.codPro,
              derMod: pai.codDer,
              cmpAnt: filho.codPro,
              derAnt: filho.codDer,
              cmpAtu: filho.equivalentes[0].CODPRO,
              derAtu: filho.equivalentes[0].CODDER,
              dscCmp: filho.equivalentes[0].DSCEQI
            }
            this.trocas.push(objTroca)
            console.log(this.trocas)
          }
        }
      }
      if (filho.filhos) {
        filho.filhos.forEach(neto => this.analisarSeTrocarTalhado(filho, neto, itemTroca))
      }
    },
    analisarItensMontagem (pai, filho, itensMontagem) {
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
        filho.filhos.forEach(neto => this.analisarItensMontagem(filho, neto, itensMontagem))
      }
    },
    analisarSeTrocarFilhos (pai, filho, itemTroca) {
      if (pai.ACABADO) {
        pai.codPro = pai.ACABADO.codPro
        pai.codDer = pai.ACABADO.codDer
        pai.numOri = pai.ACABADO.numOri
      }
      if (filho.codPro === itemTroca.cmpAnt &&
        filho.codDer === itemTroca.derAnt &&
        filho.codNiv !== itemTroca.codNiv &&
        filho.agpMod === itemTroca.agpMod) {
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
        filho.filhos.forEach(neto => this.analisarSeTrocarFilhos(filho, neto, itemTroca))
      }
    },
    async requestTroca (numPed, seqIpd, item) {
      const token = sessionStorage.getItem('token')
      const codEmp = this.item.CODEMP
      const codFil = 1
      return axios.post('http://localhost:8080/equivalente?emp=' + codEmp + '&fil=' + codFil + '&ped=' + numPed + '&ipd=' + seqIpd + '&token=' + token, this.trocas)
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
