<template>
  <tr style="padding-left: 10px" id="node" v-show="(/^[1][.]\d+(?!.)/.test(item.codNiv) && (item.codFam === '14001' || item.codFam === '05001' || item.trocar)) || (item.codDer !== 'GM' && ((item.codDer === 'G' || item.proGen === 'S' || item.podeTrocar || item.codFam === '05001')))" v-bind:class="{ trocar: (item.codDer === 'G' || item.proGen === 'S'), temG: item.temG, atencao: item.trocar, filhoPodeTrocar: item.filhoPodeTrocar }">
    <th class="fw-normal">
      <font-awesome-icon v-if="((item.filhos && (item.temG || item.filhoPodeTrocar)) && isOpen)" icon="minus-square" @click="toggleOpen" class="expand pointer" v-bind:class="{ warning: (item.temG || item.trocar) }" />
      <font-awesome-icon v-else-if="((item.filhos && (item.temG || item.filhoPodeTrocar)) && !isOpen)" icon="plus-square" @click="toggleOpen" class="expand pointer" v-bind:class="{ warning: (item.temG || item.trocar) }" />
    </th>
    <th class="fw-normal font-small" v-if="(item.codFam === '02001' || item.codFam === '02002' || item.codFam === '02003' || item.codFam === '02004') && item.codDer !== 'G'"><span class="indent pipe" :style="cssVars">|</span><span class="dash">&#8213;&#8213;&#8213;&#8213;&#8213;&#8213;</span><span class="pe-2">></span>{{ item.codRef }}</th>
    <th class="fw-normal font-small" v-else-if="(item.desNfv !== '' && item.desNfv !== ' ')"><span class="indent pipe" :style="cssVars">|</span><span class="dash">&#8213;&#8213;&#8213;&#8213;&#8213;&#8213;</span><span class="pe-2">></span>{{ item.desNfv }} {{ item.desDer }}</th>
    <th class="fw-normal font-small" v-else><span class="indent pipe" :style="cssVars">|</span><span class="dash">&#8213;&#8213;&#8213;&#8213;&#8213;&#8213;</span><span class="pe-2">></span>{{ item.desPro }} {{ item.desDer }}</th>

    <th class="fw-normal font-small">{{ item.qtdCon }}</th>
    <th class="fw-normal font-small">{{ item.uniMed }}</th>
    <th class="fw-normal align-center exchange" v-if="item.codDer === 'G' || item.proGen === 'S' || item.podeTrocar">
      <font-awesome-icon class="pointer" icon="redo-alt" @click="buscarOpcoes(item)" data-bs-toggle="modal" :data-bs-target="`#modal-`+item.hashModal"/>
    </th>
    <th v-else></th>

    <!-- Modal -->
    <div class="modal fade" :id="`modal-`+item.hashModal" tabindex="-1" aria-labelledby="equivalentesModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Busca de Produtos Equivalentes</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" id="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3" v-if="item.equivalentes !== []">
              <input type="text" class="form-control mb-3" v-on:keyup="filtrarEquivalentes(item)" v-model="equivalentesFiltro" placeholder="Digite para buscar por referência na tabela abaixo">
              <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                <thead>
                  <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Derivação</th>
                    <th scope="col">Referência</th>
                    <th scope="col">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- eslint-disable-next-line vue/require-v-for-key -->
                  <tr v-for="equivalenteRow in item.equivalentesFiltrados" class="mouseHover pointer" @click="selecionarEquivalente(equivalenteRow)">
                    <th class="fw-normal">{{ equivalenteRow.CODPRO }}</th>
                    <th class="fw-normal">{{ equivalenteRow.CODDER }}</th>
                    <th class="fw-normal">{{ equivalenteRow.CODREF }}</th>
                    <th class="fw-normal">{{ equivalenteRow.DSCEQI }}</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <label>Buscando equivalentes ...</label>
            </div>
          </div>
          <div class="m-3" v-if="item.equivalenteSelecionado">
            <div class="row mb-3">
              <label class="fw-bold fs-5">Equivalente selecionado:</label>
              <label class="fw-bold">Produto: {{item.equivalenteSelecionado.CODPRO}}</label>
              <label class="fw-bold">Derivação: {{item.equivalenteSelecionado.CODDER}}</label>
              <label class="fw-bold">Descrição: {{item.equivalenteSelecionado.DSCEQI}}</label>
            </div>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmarTroca(item.equivalenteSelecionado)">Confirmar</button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelar">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </tr>
  <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
  <TreeItem v-if="isOpen"
    v-for="(child, index) in item.filhos"
    :key="index"
    :item="child"
    :codEmp="codEmp"
    :level="(child.codDer !== 'GM' && ((child.codDer === 'G' || child.proGen === 'S' || child.podeTrocar || child.codFam === '05001'))) ? level + 1 : level"
    @trocar="trocar"/>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TreeItem',
  props: ['item', 'level', 'codEmp'],
  data () {
    return {
      api_url: '',
      token: '',
      isOpen: true,
      equivalentesFiltro: ''
    }
  },
  created () {
    this.api_url = process.env.VUE_APP_API_URL
    this.token = sessionStorage.getItem('token')
    const niv = String(this.$props.item.codNiv).replaceAll('.', '')
    this.$props.item.hashModal = Math.floor(Math.random() * (niv * 1000))
    this.$props.item.equivalentes = []
    this.$props.item.equivalenteSelecionado = null
  },
  computed: {
    cssVars () {
      return {
        '--padding': (this.$props.level * 20) + 'px'
      }
    }
  },
  methods: {
    checkInvalidLoginResponse (response) {
      if (response === 'Token inválido.') {
        alert('Seu token de acesso não é mais válido. É necessário fazer login novamente.')
        sessionStorage.removeItem('token')
        this.$router.push({ name: 'Login' })
      }
    },
    toggleOpen () {
      this.isOpen = !this.isOpen
    },
    async buscarOpcoes (item) {
      item.equivalentes = []
      item.equivalentesFiltrados = []
      this.$props.item.equivalenteSelecionado = null
      item.equivalenteSelecionado = null
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      if (item.proGen === 'S') {
        await axios.get(this.api_url + '/equivalentes?emp=' + this.codEmp + '&modelo=' + item.codMod + '&componente=' + item.codPro + '&derivacao=' + item.codDer + '&token=' + this.token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            item.equivalentes = response.data.equivalentes
            item.equivalentesFiltrados = response.data.equivalentes
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
          })
          .catch((err) => {
            console.log(err)
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
          })
      } else if (item.podeTrocar && item.codDer !== 'G') {
        await axios.get(this.api_url + '/equivalentes?emp=' + this.codEmp + '&modelo=' + item.codMod + '&componente=' + item.codPro + '&derivacao=' + item.codDer + '&token=' + this.token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            item.equivalentes = response.data.equivalentes
            item.equivalentesFiltrados = response.data.equivalentes
            if (!item.equivalentes.length) {
              item.equivalentes = []
              item.equivalentesFiltrados = []
              axios.get(this.api_url + '/derivacoesPossiveis?emp=' + this.codEmp + '&pro=' + item.codPro + '&mod=' + item.codMod + '&derMod=' + item.derMod + '&token=' + this.token)
                .then((response) => {
                  this.checkInvalidLoginResponse(response.data)
                  item.equivalentes = response.data.derivacoes
                  item.equivalentesFiltrados = response.data.derivacoes
                  document.getElementsByTagName('body')[0].style.cursor = 'auto'
                })
                .catch((err) => {
                  console.log(err)
                  document.getElementsByTagName('body')[0].style.cursor = 'auto'
                })
            }
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
          })
          .catch((err) => {
            console.log(err)
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
          })
      } else {
        await axios.get(this.api_url + '/equivalentes?emp=' + this.codEmp + '&modelo=' + item.codMod + '&componente=' + item.codPro + '&derivacao=' + item.codDer + '&token=' + this.token)
          .then(async (response) => {
            this.checkInvalidLoginResponse(response.data)
            item.equivalentes = response.data.equivalentes
            item.equivalentesFiltrados = response.data.equivalentes
            if (!item.equivalentes.length) {
              item.equivalentes = []
              item.equivalentesFiltrados = []
              await axios.get(this.api_url + '/derivacoesPossiveis?emp=' + this.codEmp + '&pro=' + item.codPro + '&mod=' + item.codMod + '&derMod=' + item.derMod + '&token=' + this.token)
                .then((response) => {
                  this.checkInvalidLoginResponse(response.data)
                  item.equivalentes = response.data.derivacoes
                  item.equivalentesFiltrados = response.data.derivacoes
                  document.getElementsByTagName('body')[0].style.cursor = 'auto'
                })
                .catch((err) => {
                  console.log(err)
                  document.getElementsByTagName('body')[0].style.cursor = 'auto'
                })
            }
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
          })
          .catch((err) => {
            console.log(err)
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
          })
      }
    },
    filtrarEquivalentes (item) {
      item.equivalentesFiltrados = []
      item.equivalentesFiltrados = item.equivalentes.filter(equiv => equiv.CODREF.toUpperCase().startsWith(this.equivalentesFiltro.toUpperCase()))
    },
    selecionarEquivalente (equivalente) {
      this.$props.item.equivalenteSelecionado = equivalente
    },
    confirmarTroca (equivalente) {
      this.$props.item.equivalenteSelecionado = null
      const itemTroca = {
        codNiv: this.$props.item.codNiv,
        codMod: this.$props.item.codMod,
        codAgp: this.$props.item.codAgp,
        agpMod: this.$props.item.agpMod,
        derMod: this.$props.item.derMod,
        cmpAnt: this.$props.item.codPro,
        derAnt: this.$props.item.codDer,
        cmpAtu: equivalente.CODPRO,
        derAtu: equivalente.CODDER,
        dscCmp: equivalente.DSCEQI,
        codFam: this.$props.item.codFam
      }
      axios.get(this.api_url + '/itensMontagem?emp=' + this.codEmp + '&pro=' + itemTroca.cmpAtu + '&der=' + itemTroca.derAtu + '&token=' + this.token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          if (response.data.itensMontagem.length) {
            itemTroca.itensMontagem = response.data.itensMontagem
          }
          this.trocar(itemTroca)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    cancelar () {
      this.$props.item.equivalenteSelecionado = null
    },
    trocar (itemTroca) {
      this.$emit('trocar', itemTroca)
    }
  }
}
</script>

<style scoped>
  th {
    vertical-align: middle;
  }
  .align-center {
    text-align: center;
  }
  .trocar {
    background-color: #ffdede;
  }
  .pointer {
    cursor: pointer;
  }
  .expand {
    color: #28a745;
  }
  .success {
    color: #28a745;
  }
  .contract {
    color: #007bbd;
  }
  .exchange {
    color: #0d6efd;
  }
  .warning {
    color: red;
  }
  .indent {
    padding-left: var(--padding);
  }
  .font-small {
    font-size: small;
  }
  .pipe {
    position: relative;
    top: -6px;
    left: 2px;
  }
</style>
