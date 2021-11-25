<template>
  <li id="node" v-if="item.exiCmp !== 'S'" v-bind:class="{ trocar: (item.codDer === 'G' || item.proGen === 'S'), temG: item.temG, atencao: item.trocar }">
    <div @click="toggleOpen">
      {{ item.codNiv }} -> {{ item.codPro }} - {{ item.codDer }} - {{ item.desPro }} {{ item.desDer }} - Qtde {{ item.qtdCon }} {{ item.uniMed }} - ExiCmp {{ item.exiCmp }}
      <span v-if="item.filhos">[ {{ isOpen ? '-' : '+' }} ]</span>
      <span v-if="item.temG || item.trocar">!!!</span>
      <button v-if="item.codDer === 'G' || item.proGen === 'S'">trocar</button>
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
export default {
  name: 'TreeItem',
  props: ['item'],
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleOpen () {
      this.isOpen = !this.isOpen
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
