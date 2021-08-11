<template>
  <li>
    <div @click="toggleOpen">
      {{ item.id ? item.id : item.produto }} - {{ item.descricao }}
      <span v-if="item.filhos">[ {{ isOpen ? '-' : '+' }} ]</span>
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
   margin: 10px 0;
 }
</style>
