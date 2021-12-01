<template>
  <li id="node" v-if="item.exiCmp !== 'S'" v-bind:class="{ trocar: (item.codDer === 'G' || item.proGen === 'S'), temG: item.temG, atencao: item.trocar }">
    <div @click="toggleOpen">
      {{ item.codNiv }} -> {{ item.codPro }} - {{ item.codDer }} - {{ item.desPro }} {{ item.desDer }} - Qtde {{ item.qtdCon }} {{ item.uniMed }}
      <span v-if="item.filhos">[ {{ isOpen ? '-' : '+' }} ]</span>
      <span v-if="item.temG || item.trocar">!!!</span>
      <button v-if="item.codDer === 'G' || item.proGen === 'S' || item.podeTrocar" @click="buscarOpcoes(item)" data-bs-toggle="modal" :data-bs-target="`#modal-`+item.hashModal">Trocar</button>

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
              <div class="mb-3" v-if="item.equivalenteSelecionado">
                <label>Equivalente selecionado:</label>
                <br>
                <label>{{item.equivalenteSelecionado.CODPRO}}</label>
                <br>
                <label>{{item.equivalenteSelecionado.CODDER}}</label>
                <br>
                <label>{{item.equivalenteSelecionado.DSCEQI}}</label>
                <br>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmarSubstituicao(item.equivalenteSelecionado)">Confirmar</button>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ul v-show="isOpen">
      <TreeItem
        v-for="(child, index) in item.filhos"
        :key="index"
        :item="child"
        ></TreeItem>
    </ul>
  </li>
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
  mounted () {
    const s = this.$props.item.codNiv + this.$props.item.codPro + this.$props.item.codDer
    let hash = ''
    for (let i = 0; i < s.length; i++) {
      const char = s.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    this.$props.item.hashModal = hash
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
      item.equivalenteSelecionado = null
      if (item.proGen === 'S') {
        await axios.get('http://localhost:8080/equivalentes?modelo=' + item.codMod + '&componente=' + item.codPro + '&token=' + token)
          .then((response) => {
            item.equivalentes = response.data.equivalentes
          })
          .catch((err) => console.log(err))
      } if (item.podeTrocar) {
        await axios.get('http://localhost:8080/equivalentesAdicionais?modelo=' + item.codMod + '&componente=' + item.codPro + '&der=' + item.codDer + '&token=' + token)
          .then((response) => {
            item.equivalentes = response.data.equivalentes
          })
          .catch((err) => console.log(err))
      } else {
        await axios.get('http://localhost:8080/equivalentes?modelo=' + item.codMod + '&componente=' + item.codPro + '&token=' + token)
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
    confirmarSubstituicao (equivalente) {
      console.log('Trocando Produto: ' + this.$props.item.codPro + ' - Der: ' + this.$props.item.codDer)
      console.log('Por Produto: ' + equivalente.CODPRO + ' - Der: ' + equivalente.CODDER)
    }
  }
}
</script>

<style>
 li {
   margin: 10px 10px;
   color: black;
 }
 .atencao, .temG {
   color: green;
 }
 .trocar {
   color: red;
 }
</style>
