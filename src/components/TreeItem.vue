<template>
  <li id="node" v-if="item.exiCmp !== 'S'" v-bind:class="{ trocar: (item.codDer === 'G' || item.proGen === 'S'), temG: item.temG, atencao: item.trocar }">
    <div @click="toggleOpen">
      {{ item.codNiv }} -> {{ item.codPro }} - {{ item.codDer }} - {{ item.desPro }} {{ item.desDer }} - Qtde {{ item.qtdCon }} {{ item.uniMed }} - ExiCmp {{ item.exiCmp }}
      <span v-if="item.filhos">[ {{ isOpen ? '-' : '+' }} ]</span>
      <span v-if="item.temG || item.trocar">!!!</span>
      <button v-if="item.codDer === 'G' || item.proGen === 'S'" @click="buscarOpcoes(item)">trocar</button>
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
      isOpen: false,
      equivalentes: null
    }
  },
  methods: {
    toggleOpen () {
      this.isOpen = !this.isOpen
    },
    buscarOpcoes (item) {
      if (item.proGen === 'S') {
        this.derivacoes = null
        console.log('Buscar tabela de equivalentes')
        const token = sessionStorage.getItem('token')
        axios.get('http://localhost:8080/equivalentes?modelo=' + item.codMod + '&componente=' + item.codPro + '&token=' + token)
          .then((response) => {
            this.derivacoes = response.data.equivalentes
            console.log(response)
          })
          .catch((err) => console.log(err))
      } else {
        console.log('Buscar tabela de equivalentes, depois derivação <> G caso nao tiver')
        const token = sessionStorage.getItem('token')
        axios.get('http://localhost:8080/equivalentes?modelo=' + item.codMod + '&componente=' + item.codPro + '&token=' + token)
          .then((response) => {
            this.equivalentes = response.data.equivalentes
            console.log(this.equivalentes)
            if (!this.equivalentes.length) {
              console.log('Buscar por derivação!')
            }
          })
          .catch((err) => console.log(err))
      }
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
