<template>
  <li id="node" v-if="item.exiCmp !== 'S'" v-bind:class="{ trocar: (item.codDer === 'G' || item.proGen === 'S'), temG: item.temG, atencao: item.trocar }">
    <div @click="toggleOpen">
      {{ item.codNiv }} -> {{ item.codPro }} - {{ item.codDer }} - {{ item.desPro }} {{ item.desDer }} - Qtde {{ item.qtdCon }} {{ item.uniMed }} - PodeTrocar {{ item.podeTrocar }}
      <span v-if="item.filhos">[ {{ isOpen ? '-' : '+' }} ]</span>
      <span v-if="item.temG || item.trocar">!!!</span>
      <button v-if="item.codDer === 'G' || item.proGen === 'S' || item.podeTrocar" @click="buscarOpcoes(item)">trocar</button>
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
    async buscarOpcoes (item) {
      const token = sessionStorage.getItem('token')
      this.equivalentes = null
      if (item.proGen === 'S') {
        await axios.get('http://localhost:8080/equivalentes?modelo=' + item.codMod + '&componente=' + item.codPro + '&token=' + token)
          .then((response) => {
            this.equivalentes = response.data.equivalentes
            console.log('Buscando proGen')
          })
          .catch((err) => console.log(err))
      } if (item.podeTrocar) {
        await axios.get('http://localhost:8080/equivalentesAdicionais?modelo=' + item.codMod + '&componente=' + item.codPro + '&der=' + item.codDer + '&token=' + token)
          .then((response) => {
            this.equivalentes = response.data.equivalentes
            console.log('Buscando podeTrocar')
          })
          .catch((err) => console.log(err))
      } else {
        await axios.get('http://localhost:8080/equivalentes?modelo=' + item.codMod + '&componente=' + item.codPro + '&token=' + token)
          .then(async (response) => {
            this.equivalentes = response.data.equivalentes
            console.log('Buscando der G')
            if (!this.equivalentes.length) {
              await axios.get('http://localhost:8080/derivacoesPossiveis?emp=1&pro=' + item.codPro + '&token=' + token)
                .then((response) => {
                  console.log('Buscando der G outras der')
                  this.equivalentes = response.data.derivacoes
                })
                .catch((err) => console.log(err))
            }
          })
          .catch((err) => console.log(err))
      }
      console.log('fora dos ifs')
      if (this.equivalentes === null || !this.equivalentes.length) {
        console.log('Nao encontrado!')
        alert('Nenhuma opção encontrada para o produto!')
      } else {
        console.log(this.equivalentes)
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
