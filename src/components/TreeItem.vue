<template>
  <!-- <tr style="padding-left: 10px" id="node" v-if="item.exiCmp !== 'S'" v-bind:class="{ trocar: (item.codDer === 'G' || item.proGen === 'S'), temG: item.temG, atencao: item.trocar, filhoPodeTrocar: item.filhoPodeTrocar }"> -->
  <tr style="padding-left: 10px" id="node" v-show="item.codNiv === '1.0' || (item.exiCmp !== 'S' && ((item.codDer === 'G' || item.proGen === 'S' || item.podeTrocar) || item.temG || item.filhoPodeTrocar))" v-bind:class="{ trocar: (item.codDer === 'G' || item.proGen === 'S'), temG: item.temG, atencao: item.trocar, filhoPodeTrocar: item.filhoPodeTrocar }">
    <th class="fw-normal">
      <font-awesome-icon v-if="(item.filhos && isOpen)" icon="minus-square" @click="toggleOpen" class="contract pointer"/>
      <font-awesome-icon v-else-if="(item.filhos && !isOpen)" icon="plus-square" @click="toggleOpen" class="expand pointer"/>
    </th>
    <th class="fw-normal indent font-small" :style="cssVars">{{ item.codNiv }}</th>
    <th class="fw-normal indent font-small" :style="cssVars">{{ item.codPro }}</th>
    <th class="fw-normal font-small">{{ item.codDer }}</th>
    <th class="fw-normal font-small">{{ item.desPro }} {{ item.desDer }}</th>
    <th class="fw-normal font-small">{{ item.qtdCon }}</th>
    <th class="fw-normal font-small">{{ item.uniMed }}</th>
    <th class="fw-normal align-center exchange" v-if="item.codDer === 'G' || item.proGen === 'S' || item.podeTrocar">
      <font-awesome-icon class="pointer" icon="redo-alt" @click="buscarOpcoes(item)" data-bs-toggle="modal" :data-bs-target="`#modal-`+item.hashModal"/>
    </th>
    <th v-else></th>

    <th class="fw-normal align-center">
      <font-awesome-icon v-if="(item.temG || item.trocar)" icon="exclamation-triangle" class="warning"/>
      <font-awesome-icon v-else-if="item.codNiv === '1.0'" icon="check-square" class="success"/>
    </th>

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
                  <tr v-for="equivalenteRow in item.equivalentes" :key="equivalenteRow.CODPRO" class="mouseHover pointer" @click="selecionarEquivalente(equivalenteRow)">
                    <th class="fw-normal" scope="row">{{ equivalenteRow.CODPRO }}</th>
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
    :level="(child.exiCmp !== 'S' && ((child.codDer === 'G' || child.proGen === 'S' || child.podeTrocar) || child.temG || child.filhoPodeTrocar)) ? level + 1 : level"
    @trocar="trocar"/>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TreeItem',
  props: ['item', 'level', 'codEmp'],
  data () {
    return {
      isOpen: true
    }
  },
  created () {
    const niv = String(this.$props.item.codNiv).replaceAll('.', '')
    this.$props.item.hashModal = Math.floor(Math.random() * (niv * 1000))
    this.$props.item.equivalentes = []
    this.$props.item.equivalenteSelecionado = null
    if (this.item.filhos) {
      if (this.item.temG || this.item.filhoPodeTrocar) {
        this.isOpen = false
      }
    }
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
      const token = sessionStorage.getItem('token')
      item.equivalentes = []
      this.$props.item.equivalenteSelecionado = null
      item.equivalenteSelecionado = null
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      if (item.proGen === 'S') {
        await axios.get('http://192.168.1.168:8080/equivalentes?emp=' + this.codEmp + '&modelo=' + item.codMod + '&componente=' + item.codPro + '&token=' + token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            item.equivalentes = response.data.equivalentes
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
          })
          .catch((err) => {
            console.log(err)
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
          })
      } else if (item.podeTrocar) {
        await axios.get('http://192.168.1.168:8080/equivalentesAdicionais?emp=' + this.codEmp + '&modelo=' + item.codMod + '&componente=' + item.codPro + '&der=' + item.codDer + '&token=' + token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            item.equivalentes = response.data.equivalentes
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
          })
          .catch((err) => {
            console.log(err)
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
          })
      } else {
        await axios.get('http://192.168.1.168:8080/equivalentes?emp=' + this.codEmp + '&modelo=' + item.codMod + '&componente=' + item.codPro + '&token=' + token)
          .then(async (response) => {
            this.checkInvalidLoginResponse(response.data)
            item.equivalentes = response.data.equivalentes
            if (!item.equivalentes.length) {
              item.equivalentes = []
              await axios.get('http://192.168.1.168:8080/derivacoesPossiveis?emp=' + this.codEmp + '&pro=' + item.codPro + '&token=' + token)
                .then((response) => {
                  this.checkInvalidLoginResponse(response.data)
                  item.equivalentes = response.data.derivacoes
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
    selecionarEquivalente (equivalente) {
      this.$props.item.equivalenteSelecionado = equivalente
    },
    confirmarTroca (equivalente) {
      this.$props.item.equivalenteSelecionado = null
      const itemTroca = {
        codNiv: this.$props.item.codNiv,
        codMod: this.$props.item.codMod,
        agpMod: this.$props.item.agpMod,
        derMod: this.$props.item.derMod,
        cmpAnt: this.$props.item.codPro,
        derAnt: this.$props.item.codDer,
        cmpAtu: equivalente.CODPRO,
        derAtu: equivalente.CODDER,
        dscCmp: equivalente.DSCEQI,
        codFam: this.$props.item.codFam
      }
      this.trocar(itemTroca)
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
</style>
