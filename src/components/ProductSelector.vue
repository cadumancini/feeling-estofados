<template>
  <div>
    <div class="row mb-2">
      <label for="selectEstilos" class="col-auto col-form-label">Selecione o estilo:</label>
      <div class="col-auto">
        <select class="form-select" v-if="estilos !== null" id="selectEstilos" v-model="selectedEstilo" @change="onSelectEstilo()">
          <option disabled value="">Selecione um estilo...</option>
          <option v-for="estilo in estilos" :key="estilo.CODCPR" :value="estilo.CODCPR">{{ estilo.DESCPR }}</option>
        </select>
        <label class="col-form-label text-info fst-italic" v-else>Buscando estilos...</label>
      </div>
    </div>
    <div class="row mb-2">
      <label for="selectProdutos" class="col-auto col-form-label">Selecione o produto:</label>
      <div class="col-auto">
        <label class="col-form-label text-secondary fst-italic" v-if="!selectedEstilo">Ainda não selecionou estilo!</label>
        <label class="col-form-label text-info fst-italic" v-else-if="produtos === null">Buscando produtos...</label>
        <label class="col-form-label text-danger fst-italic" v-else-if="produtos.length === 0">Não existe produto cadastrado para este estilo!</label>
        <select v-else class="form-select" id="selectProdutos" v-model="selectedProduto" @change="onSelectProduto()">
          <option disabled value="">Selecione um produto...</option>
          <option v-for="produto in produtos" :key="produto.CODPRO" :value="{codPro: produto.CODPRO, desPro: produto.DESPRO}">{{ produto.CODPRO }} - {{ produto.DESPRO }}</option>
        </select>
      </div>
    </div>
    <div class="row mb-2">
      <label for="selectedDerivacoes" class="col-auto col-form-label">Selecione a derivação:</label>
      <div class="col-auto">
        <label class="col-form-label text-secondary fst-italic" v-if="!selectedProduto">Ainda não selecionou produto!</label>
        <label class="col-form-label text-info fst-italic" v-else-if="derivacoes === null">Buscando derivações...</label>
        <label class="col-form-label text-danger fst-italic" v-else-if="derivacoes.length === 0">Não existe derivação cadastrada para este produto!</label>
        <select v-else class="form-select" id="selectedDerivacoes" v-model="selectedDerivacao">
          <option disabled value="">Selecione uma derivação...</option>
          <option v-for="derivacao in derivacoes" :key="derivacao.CODDER" :value="{codDer: derivacao.CODDER, desDer: derivacao.DESDER}">{{ derivacao.CODDER }} - {{ derivacao.DESDER }}</option>
        </select>
      </div>
    </div>
    <div class="row mb-2">
      <label for="qtdPed" class="col-auto col-form-label" v-show="selectedDerivacao">Quantidade:</label>
      <div class="col-auto">
        <input v-show="selectedDerivacao" class="form-control" onfocus="this.select();" id="qtdPed" type="number" v-model="quantidade">
      </div>
    </div>
    <div class="row mb-2">
      <label for="vlrUni" class="col-auto col-form-label" v-show="selectedDerivacao">Valor Unitário:</label>
      <div class="col-auto">
        <currency-input v-show="selectedDerivacao" class="form-control" onfocus="this.select();" id="vlrUni" v-model="valorUnitario" :options="{ currency: 'BRL' }" />
      </div>
    </div>
    <div class="row mb-2">
      <div class="col-auto">
        <button class="btn btn-secondary" :disabled="selectedDerivacao ? false : true" @click="addProduto">Adicionar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import CurrencyInput from './CurrencyInput'
export default {
  name: 'ProductSelector',
  components: { CurrencyInput },
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
        if (response.data === 'Token inválido.') {
          alert('Seu token de acesso não é mais válido. É necessário fazer login novamente.')
          sessionStorage.removeItem('token')
          this.$router.push({ name: 'Login' })
        }
        this.estilos = response.data.estilos
      })
      .catch((err) => console.log(err))
  },
  methods: {
    checkInvalidLoginResponse (response) {
      if (response === 'Token inválido.') {
        alert('Seu token de acesso não é mais válido. É necessário fazer login novamente.')
        sessionStorage.removeItem('token')
        this.$router.push({ name: 'Login' })
      }
    },
    onSelectEstilo () {
      const token = sessionStorage.getItem('token')
      axios.get('http://localhost:8080/produtosPorEstilo?emp=1&estilo=' + this.selectedEstilo + '&token=' + token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          this.produtos = response.data.produtos
        })
        .catch((err) => console.log(err))
    },
    onSelectProduto () {
      const token = sessionStorage.getItem('token')
      axios.get('http://localhost:8080/derivacoesPorProduto?emp=1&produto=' + this.selectedProduto.codPro + '&token=' + token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          this.derivacoes = response.data.derivacoes
        })
        .catch((err) => console.log(err))
    },
    addProduto () {
      if (this.quantidade <= 0 || this.valorUnitario <= 0) {
        alert('Quantidade e/ou Valor Unitário devem ser um valor positivo!')
      } else {
        this.$emit('addItem', { codPro: this.selectedProduto.codPro, desPro: (this.selectedProduto.desPro + ' ' + this.selectedDerivacao.desDer), codDer: this.selectedDerivacao.codDer, seqIpd: 0, qtdPed: this.quantidade, preUni: this.valorUnitario })
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
