<template>
  <div>
    <label>Selecione o estilo:</label>
    <select v-if="estilos !== null" id="selectEstilos" v-model="selectedEstilo" @change="onSelectEstilo()">
      <option disabled value="">Selecione um estilo...</option>
      <option v-for="estilo in estilos" :key="estilo.CODCPR" :value="estilo.CODCPR">{{ estilo.DESCPR }}</option>
    </select>
    <br>
    <label>Selecione o produto:</label>
    <label v-if="!selectedEstilo">Ainda não selecionou estilo!</label>
    <label v-else-if="produtos === null">Buscando produtos...</label>
    <label v-else-if="produtos.length === 0">Não existe produto cadastrado para este estilo!</label>
    <select v-else id="selectProdutos" v-model="selectedProduto" @change="onSelectProduto()">
      <option disabled value="">Selecione um produto...</option>
      <option v-for="produto in produtos" :key="produto.CODPRO" :value="produto.CODPRO">{{ produto.CODPRO }} - {{ produto.DESPRO }}</option>
    </select>
    <br>
    <label>Selecione a derivação:</label>
    <label v-if="!selectedProduto">Ainda não selecionou produto!</label>
    <label v-else-if="derivacoes === null">Buscando derivações...</label>
    <label v-else-if="derivacoes.length === 0">Não existe derivação cadastrada para este produto!</label>
    <select v-else id="selectedDerivacoes" v-model="selectedDerivacao">
      <option disabled value="">Selecione uma derivação...</option>
      <option v-for="derivacao in derivacoes" :key="derivacao.CODDER" :value="derivacao.CODDER">{{ derivacao.CODDER }} - {{ derivacao.DESDER }}</option>
    </select>
    <br>
    <label v-show="selectedDerivacao">Quantidade:</label>
    <input v-show="selectedDerivacao" type="number" v-model="quantidade">
    <br>
    <label v-show="selectedDerivacao">Valor Unitário:</label>
    <input v-show="selectedDerivacao" type="number" v-model="valorUnitario">
    <br>
    <button :disabled="selectedDerivacao ? false : true" @click="addProduto">Adicionar</button>
    <br>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ProductSelector',
  data () {
    return {
      estilos: null,
      selectedEstilo: '',
      produtos: null,
      selectedProduto: '',
      derivacoes: null,
      selectedDerivacao: '',
      quantidade: 1,
      valorUnitario: 0
    }
  },
  created () {
    const token = sessionStorage.getItem('token')
    axios.get('http://localhost:8080/estilos?emp=1&token=' + token)
      .then((response) => {
        this.estilos = response.data.estilos
      })
      .catch((err) => console.log(err))
  },
  methods: {
    onSelectEstilo () {
      const token = sessionStorage.getItem('token')
      axios.get('http://localhost:8080/produtosPorEstilo?emp=1&estilo=' + this.selectedEstilo + '&token=' + token)
        .then((response) => {
          this.produtos = response.data.produtos
        })
        .catch((err) => console.log(err))
    },
    onSelectProduto () {
      const token = sessionStorage.getItem('token')
      axios.get('http://localhost:8080/derivacoesPorProduto?emp=1&produto=' + this.selectedProduto + '&token=' + token)
        .then((response) => {
          this.derivacoes = response.data.derivacoes
        })
        .catch((err) => console.log(err))
    },
    addProduto () {
      if (this.quantidade <= 0 || this.valorUnitario <= 0) {
        alert('Quantidade e/ou Valor Unitário devem ser um valor positivo!')
      } else {
        this.$emit('addItem', { codPro: this.selectedProduto, codDer: this.selectedDerivacao, seqIpd: 0, qtdPed: this.quantidade, preUni: this.valorUnitario })
        this.selectedEstilo = ''
        this.selectedProduto = ''
        this.selectedDerivacao = ''
        this.quantidade = 1
        this.valorUnitario = 0
      }
    }
  }
}
</script>
