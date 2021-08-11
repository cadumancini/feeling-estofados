<template>
  <li>
    <div>
      {{ item.produto }} - {{ item.descricao }}
    </div>
    <ul>
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
  props: ['item']
}
</script>

<style>
 li {
   margin: 10px 0;
 }
</style>
