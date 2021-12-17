<template>
  <tr style="padding-left: 10px" id="node" v-if="item.exiCmp !== 'S'" v-bind:class="{ trocar: (item.codDer === 'G' || item.proGen === 'S'), temG: item.temG, atencao: item.trocar }">
    <th class="fw-normal">{{ item.codNiv }}</th>
    <th class="fw-normal">{{ item.codPro }}</th>
    <th class="fw-normal">{{ item.codDer }}</th>
    <th class="fw-normal">{{ item.desPro }} {{ item.desDer }}</th>
    <th class="fw-normal">{{ item.qtdCon }}</th>
    <th class="fw-normal">{{ item.uniMed }}</th>
    <th class="fw-normal" v-if="item.codDer === 'G' || item.proGen === 'S' || item.podeTrocar">
      <button @click="buscarOpcoes(item)" data-bs-toggle="modal" :data-bs-target="`#modal-`+item.hashModal">Trocar</button>
    </th>
    <th v-else></th>

    <th class="fw-normal" @click="toggleOpen">{{ item.filhos ? (isOpen ? '[-]' : '[Expandir]') : '' }} {{ (item.temG || item.trocar) ? '!!!' : '' }}</th>

    <!-- Modal -->
    <div class="modal fade" :id="`modal-`+item.hashModal" tabindex="-1" aria-labelledby="equivalentesModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="equivalentesModalLabel">Busca de Produtos Equivalentes</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3" v-if="item.equivalentes !== []">
              <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                <thead>
                  <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Derivação</th>
                    <th scope="col">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="equivalenteRow in item.equivalentes" :key="equivalenteRow.CODPRO" class="mouseHover" @click="selecionarEquivalente(equivalenteRow)">
                    <th scope="row">{{ equivalenteRow.CODPRO }}</th>
                    <th>{{ equivalenteRow.CODDER }}</th>
                    <th>{{ equivalenteRow.DSCEQI }}</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <label>Buscando equivalentes ...</label>
            </div>
          </div>
          <div class="m-3" v-if="item.equivalenteSelecionado">
            <label>Equivalente selecionado:</label>
            <br>
            <label>{{item.equivalenteSelecionado.CODPRO}}</label>
            <br>
            <label>{{item.equivalenteSelecionado.CODDER}}</label>
            <br>
            <label>{{item.equivalenteSelecionado.DSCEQI}}</label>
            <br>
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
    @trocar="trocar"/>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TreeItem',
  props: ['item'],
  data () {
    return {
      isOpen: false
    }
  },
  created () {
    const niv = String(this.$props.item.codNiv).replaceAll('.', '')
    this.$props.item.hashModal = Math.floor(Math.random() * (niv * 1000))
    this.$props.item.equivalentes = []
    this.$props.item.equivalenteSelecionado = null
  },
  methods: {
    toggleOpen () {
      this.isOpen = !this.isOpen
    },
    async buscarOpcoes (item) {
      const token = sessionStorage.getItem('token')
      item.equivalentes = []
      this.$props.item.equivalenteSelecionado = null
      item.equivalenteSelecionado = null
      if (item.proGen === 'S') {
        await axios.get('http://localhost:8080/equivalentes?emp=1&modelo=' + item.codMod + '&componente=' + item.codPro + '&token=' + token)
          .then((response) => {
            item.equivalentes = response.data.equivalentes
          })
          .catch((err) => console.log(err))
      } if (item.podeTrocar) {
        await axios.get('http://localhost:8080/equivalentesAdicionais?emp=1&modelo=' + item.codMod + '&componente=' + item.codPro + '&der=' + item.codDer + '&token=' + token)
          .then((response) => {
            item.equivalentes = response.data.equivalentes
          })
          .catch((err) => console.log(err))
      } else {
        await axios.get('http://localhost:8080/equivalentes?emp=1&modelo=' + item.codMod + '&componente=' + item.codPro + '&token=' + token)
          .then(async (response) => {
            item.equivalentes = response.data.equivalentes
            if (!item.equivalentes.length) {
              item.equivalentes = []
              await axios.get('http://localhost:8080/derivacoesPossiveis?emp=1&pro=' + item.codPro + '&token=' + token)
                .then((response) => {
                  item.equivalentes = response.data.derivacoes
                })
                .catch((err) => console.log(err))
            }
          })
          .catch((err) => console.log(err))
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
        derMod: this.$props.item.derMod,
        cmpAnt: this.$props.item.codPro,
        derAnt: this.$props.item.codDer,
        cmpAtu: equivalente.CODPRO,
        derAtu: equivalente.CODDER,
        dscCmp: equivalente.DSCEQI
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
 tr {
   padding-left: 10px;
   color: black;
 }
 .atencao, .temG {
   background-color: #f5ec90;
 }
 .trocar {
   background-color: #fcaeae;
 }
</style>
