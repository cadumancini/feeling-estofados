<template>
  <li>
    <div>
      {{ item.produto }}
    </div>
    <TreeItem
      v-for="(child, index) in item.filhos"
      :key="index"
      :item="child"
      ></TreeItem>
  </li>
</template>

<script>
export default {
  name: 'TreeItem',
  props: ['item']
}
</script>

<style>

</style>
