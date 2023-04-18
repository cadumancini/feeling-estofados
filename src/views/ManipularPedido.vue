<template>
  <div class="mx-3">
    <div class="row mb-1">
      <table v-if="item.MANIPULAR" class="table table-hover table-bordered table-sm table-responsive">
        <thead>
          <tr class="table-secondary">
            <th style="width: 2%;" class="fw-normal sm-header"></th>
            <th style="width: 88%;" class="fw-normal font-small sm-header">Descrição</th>
            <th style="width: 4%;" class="fw-normal font-small sm-header">Qtde.</th>
            <th style="width: 3%;" class="fw-normal font-small sm-header">U.M.</th>
            <th style="width: 3%;" class="fw-normal font-small sm-header">Ação</th>
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
      api_url: '',
      token: '',
      pedido: 0,
      item: {},
      trocas: [],
      trocou: false,
      exclusivos: [],
      paiAcabado: '',
      embalado: null
    }
  },
  created () {
    this.api_url = process.env.VUE_APP_API_URL
    this.token = sessionStorage.getItem('token')
    this.pedido = this.numPed
    this.item = this.seqIpd
    this.trocou = false
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

        var parseString = require('xml2js').parseString
        var json = null
        const response = await axios.get(this.api_url + '/estrutura?emp=' + this.item.CODEMP + '&fil=1&pro=' + this.item.CODPRO +
          '&der=' + this.item.CODDER + '&ped=' + this.pedido + '&ipd=' + this.item.SEQIPD + '&token=' + this.token)
        this.checkInvalidLoginResponse(response.data)
        if (response.data.includes('<erroExecucao>')) {
          const index1 = response.data.indexOf("<erroExecucao>");
          const index2 = response.data.indexOf("</erroExecucao>");

          alert('Ocorreu um erro: ' + response.data.substring((index1 + 14), index2))
        } else {
          parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
              console.log(err)
            }
            json = result
            this.item.ALLCOMPONENTS = json['S:Envelope']['S:Body']['ns2:EstruturaResponse'].result.componentes
            this.item.ACABADO = this.item.ALLCOMPONENTS[0] // inserindo primeiro (produto pai) no objeto
            this.item.ACABADOS = this.item.ALLCOMPONENTS.filter(comp => /^[1][.]\d+(?!.)/.test(comp.codNiv))
          })
          await this.parseAllComponentsIntoFullProduct(this.item)
          this.item.PRODUCTFOUND = true
          if (this.trocou) {
            await this.montarArrayExclusivos()
            this.enviarStringExclusivos()
          }
        }
        document.getElementsByTagName('body')[0].style.cursor = 'auto'
      }
    },
    async montarArrayExclusivos () {
      this.paiAcabado = ''
      this.exclusivos = []
      this.exclusivos.splice(0)
      while (this.exclusivos.length > 0) {
        this.exclusivos.pop()
      }
      const codfil = 1
      await axios.get(this.api_url + '/trocas?emp=' + this.item.CODEMP + '&fil=' + codfil + '&ped=' + this.pedido + '&ipd=' + this.item.SEQIPD + '&token=' + this.token)
        .then((response) => {
          if (response.data.trocas.length) {
            const trocas = response.data.trocas
            this.item.ACABADOS.forEach(acabado => {
              if (acabado.codFam === '15001') {
                this.embalado = acabado
              }
              if (acabado.filhos) {
                acabado.filhos.forEach(filho => this.analisarFilhosParaString(acabado, filho, trocas, acabado))
              }
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    analisarFilhosParaString (pai, filho, trocas, dono) {
      if (pai.codFam === '14001') {
        pai.desNfv = pai.desPpc
      }
      if (/^[1][.]\d+(?!.)/.test(pai.codNiv) || (pai.codFam === '14001' || pai.codFam === '05001' || pai.trocar)) {
        dono = pai
      }
      if (pai.codFam === '14001' /*&& this.paiAcabado === ''*/) {
        this.paiAcabado = pai.desNfv + (pai.desCpl !== ' ' ? (' ' + pai.desCpl) : '')
      }
      this.analisarTrocas(trocas, dono, pai, filho)
      if (filho.filhos) {
        filho.filhos.forEach(neto => this.analisarFilhosParaString(filho, neto, trocas, dono))
      }
    },
    analisarTrocas (trocas, dono, pai, filho) {
      trocas.forEach(troca => {
        if (dono.codFam === '14001' && this.embalado !== null && troca.CODFAM === '15001') {
          this.exclusivos.push({
            codPro: dono.codPro,
            codDer: dono.codDer,
            desPro: dono.desNfv + (dono.desCpl !== ' ' ? (' ' + dono.desCpl) : ''),
            codRev: '0',
            codTal: '99',
            codCmp: this.embalado.codPro,
            derCmp: this.embalado.codDer,
            desCmp: (this.embalado.desNfv + (this.embalado.desCpl !== ' ' ? (' ' + this.embalado.desCpl) : '')),
            oriPai: dono.numOri,
            paiAca: this.paiAcabado,
            ordPai: (dono.desNfv + (dono.desCpl !== ' ' ? (' ' + dono.desCpl) : '')) === this.paiAcabado ? '0' : '1'
          })
          this.embalado = null
        } else if (troca.CODPRO === pai.codPro && troca.CODDER === pai.codDer && troca.CODCMP === filho.codPro && troca.DERCMP === filho.codDer && filho.numOri < 320 && filho.codFam !== '05001') {
          this.exclusivos.push({
            codPro: dono.codPro,
            codDer: dono.codDer,
            desPro: dono.desNfv + (dono.desCpl !== ' ' ? (' ' + dono.desCpl) : ''),
            codRev: filho.revestido !== null ? filho.revestido : '0',
            codTal: filho.talhado !== null ? filho.talhado : '99',
            codCmp: (filho.codFam === '02001' || filho.codFam === '02002' || filho.codFam === '02003' || filho.codFam === '02004') ? filho.codRef : filho.codPro,
            derCmp: filho.codDer,
            desCmp: (filho.codFam === '02001' || filho.codFam === '02002' || filho.codFam === '02003' || filho.codFam === '02004') ? filho.codRef : (filho.desNfv + (filho.desCpl !== ' ' ? (' ' + filho.desCpl) : '')),
            oriPai: dono.numOri,
            paiAca: this.paiAcabado,
            ordPai: (dono.desNfv + (dono.desCpl !== ' ' ? (' ' + dono.desCpl) : '')) === this.paiAcabado ? '0' : '1'
          })
        }
      })
    },
    async enviarStringExclusivos () {
      this.exclusivos.sort((a,b) => (a.paiAca.localeCompare(b.paiAca) || a.ordPai.localeCompare(b.ordPai) || 
                                     a.codRev.localeCompare(b.codRev) || b.codTal.localeCompare(a.codTal)))
      let stringExclusivos = ''
      let paiAtual = null
      let paiAcaAtual = ''
      let temAcabado = false
      this.exclusivos.forEach(excl => {
        if (excl.desPro === this.paiAcabado && excl.codRev === '0') {
          temAcabado = true
        }
      })
      if (!temAcabado) {
        stringExclusivos = this.paiAcabado + ' | '
      }
      this.exclusivos.forEach(excl => {
        if (paiAtual === null || paiAtual !== excl.codRev || excl.codTal !== '99') {
          if (paiAtual !== null) {
            stringExclusivos += excl.desPro === excl.paiAca ? ((paiAcaAtual !== excl.paiAca) ? (String.fromCharCode(10) + String.fromCharCode(13)) : '') : ' | '
          }
          if ((excl.desPro === excl.paiAca) && (paiAcaAtual === excl.paiAca) && (paiAtual !== null)) {
            stringExclusivos += ' + '
          } else { 
            stringExclusivos += excl.desPro + ' : '
          }
          paiAtual = excl.codRev
          paiAcaAtual = excl.paiAca
        } else {
          stringExclusivos += ' + '
        }
        stringExclusivos += excl.desCmp
      })
      const codfil = 1
      const formData = new FormData()
      formData.append('exclusivos', stringExclusivos)
      axios.post(this.api_url + '/enviarStringExclusivos?emp=' + this.item.CODEMP + '&fil=' + codfil + '&ped=' + this.pedido + '&ipd=' + this.item.SEQIPD + '&token=' + this.token, formData)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          if (response.data !== 'OK') {
            console.log(response.data)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      this.trocou = false
    },
    async parseAllComponentsIntoFullProduct (item) {
      this.item.ACABADOS.forEach(async acabado => {
        acabado.codMod = this.item.CODPRO
        acabado.derMod = this.item.CODDER

        // ver se o pai pode ser trocado
        if (acabado.exiCmp !== 'S') {
          await axios.get(this.api_url + '/equivalentes?emp=' + this.item.CODEMP + '&modelo=' + this.item.CODPRO + '&componente=' + acabado.codPro + '&derivacao=' + acabado.codDer + '&token=' + this.token)
            .then((response) => {
              this.checkInvalidLoginResponse(response.data)
              if (response.data.equivalentes.length) {
                acabado.podeTrocar = true
              } else {
                axios.get(this.api_url + '/derivacoesPossiveis?emp=' + this.item.CODEMP + '&pro=' + this.item.CODPRO + '&mod=' + acabado.codMod + '&derMod=' + acabado.derMod + '&token=' + this.token)
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
        if (component.codDer !== 'GM') {
          await axios.get(this.api_url + '/equivalentes?emp=' + this.item.CODEMP + '&modelo=' + component.codMod + '&componente=' + component.codPro + '&derivacao=' + component.codDer + '&token=' + this.token)
            .then((response) => {
              this.checkInvalidLoginResponse(response.data)
              if (response.data.equivalentes.length) {
                component.equivalentes = response.data.equivalentes
                component.podeTrocar = true
                node.filhoPodeTrocar = true
              } else {
                axios.get(this.api_url + '/derivacoesPossiveis?emp=' + this.item.CODEMP + '&pro=' + component.codPro + '&mod=' + component.codMod + '&derMod=' + component.derMod + '&token=' + this.token)
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
        node.filhos.forEach(filho => this.checkItems(node, filho, null, null, null))
      }
    },
    checkItems (pai, filho, acabado, revestido, talhado) {
      if ((filho.codDer === 'G' || filho.proGen === 'S') && filho.codDer !== 'GM') {
        pai.temG = true
      }
      if (filho.temG || filho.trocar) {
        pai.trocar = true
      }
              
      if (/^[1][.]\d+(?!.)/.test(pai.codNiv) || (pai.codFam === '14001' || pai.codFam === '13001' || pai.codFam === '05001')) {
        if (pai.codFam === '13001') {
          revestido = pai
        } else if (pai.codFam === '05001') {
          talhado = pai
        } else {
          acabado = pai
        }
      }

      filho.revestido = revestido !== null ? revestido.codPro + ';' + revestido.codDer : null
      filho.talhado = talhado !== null ? talhado.codPro + ';' + talhado.codDer : null
      filho.acabado = acabado !== null ? acabado.codPro + ';' + acabado.codDer : null
        
      if (filho.filhos) {
        filho.filhos.forEach(neto => this.checkItems(filho, neto, acabado, revestido, talhado))
      }
      if (filho.temG || filho.trocar) {
        pai.trocar = true
      }
      if ((filho.codDer === 'G' || filho.proGen === 'S') && filho.codDer !== 'GM') {
        pai.temG = true
      }
    },
    efetuarTroca (item, itemTroca) {
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      const seqIpd = item.SEQIPD
      this.trocas = []
      this.trocas.push(itemTroca)
      console.log(itemTroca)
      // if (itemTroca.codFam === '02001' || itemTroca.codFam === '02002') {
      if (itemTroca.agpMod !== ' ') {
        item.ACABADOS.forEach(acabado => {
          if (acabado.filhos) {
            acabado.filhos.forEach(filho => this.analisarSeTrocarFilhos(acabado, filho, itemTroca))
          }
        })
        if (itemTroca.itensMontagem && itemTroca.itensMontagem.length) {
          item.ACABADOS.forEach(acabado => {
            if (acabado.filhos) {
              acabado.filhos.forEach(filho => this.analisarItensMontagem(acabado, filho, itemTroca.itensMontagem))
            }
          })
        }
      } else if (itemTroca.codFam === '05001') { // talhado
        // Ver se existem outros talhados com o mesmo agrupamento para trocar
        item.ACABADOS.forEach(acabado => {
          if (acabado.filhos) {
            acabado.filhos.forEach(filho => this.analisarSeTrocarTalhado(acabado, filho, itemTroca))
          }
        })
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
          filho.equivalentes.forEach(equiv => {
            if ((itemTroca.dscCmp.includes('(TECIDO') && equiv.DSCEQI.includes('(TECIDO')) ||
                (itemTroca.dscCmp.includes('(RECOURO') && equiv.DSCEQI.includes('(RECOURO')) ||
                (itemTroca.dscCmp.includes('(COURO') && equiv.DSCEQI.includes('(COURO')) ||
                (itemTroca.dscCmp.includes('(MANTA TRA') && equiv.DSCEQI.includes('(MANTA TRA'))) {
              const objTroca = {
                codNiv: filho.codNiv,
                codMod: pai.codPro,
                derMod: pai.codDer,
                cmpAnt: filho.codPro,
                derAnt: filho.codDer,
                cmpAtu: equiv.CODPRO,
                derAtu: equiv.CODDER,
                dscCmp: equiv.DSCEQI
              }
              this.trocas.push(objTroca)
            }
          })
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
        (filho.codDer === 'GM' || filho.proGen === 'S')) {
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
      const codEmp = this.item.CODEMP
      const codFil = 1
      return axios.post(this.api_url + '/equivalente?emp=' + codEmp + '&fil=' + codFil + '&ped=' + numPed + '&ipd=' + seqIpd + '&token=' + this.token, this.trocas)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          const requestResponse = response.data
          if (requestResponse === 'OK') {
            alert('Troca realizada com sucesso. Pressione OK para recarregar a estrutura')
          } else {
            alert(requestResponse)
          }
          this.trocou = true
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
