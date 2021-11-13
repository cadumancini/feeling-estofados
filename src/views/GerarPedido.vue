<template>
  <h1>Feeling Estofados</h1>
  <label for="codCli">Cliente:</label>
  <input id="codCli" type="text" v-model="cliente">
  <button @click="buscaClientes" data-bs-toggle="modal" data-bs-target="#clientesModal">...</button>
  <br>
  <label for="pedCli">Número do Pedido no Cliente:</label>
  <input id="pedCli" type="text" v-model="pedidoCliente">

  <!-- Modal -->
  <div class="modal fade" id="clientesModal" tabindex="-1" aria-labelledby="clientesModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="clientesModalLabel">Busca de Clientes</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3" v-if="clientes != null">
            <table class="table table-striped table-hover table-bordered table-sm table-responsive">
              <thead>
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Cliente</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="clienteRow in clientes" :key="clienteRow.CODCLI" class="mouseHover" @click="selectCliente(clienteRow)">
                  <th scope="row">{{ clienteRow.CODCLI }}</th>
                  <th>{{ clienteRow.NOMCLI }}</th>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <label>Buscando clientes ...</label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

  <br>
  <button v-if="!addingProduct" @click="addingProduct = true">Adicionar Produto</button>
  <ProductSelector v-if="addingProduct" @addItem="addItem"/>

  <br>
  <label>Produtos Adicionados</label>
  <ul v-if="itens.length">
    <li v-for="item in itens" :key="item.codPro">Produto: {{ item.codPro }} - Der.: {{ item.codDer }} - Qtde: {{ item.qtdPed }} - Valor Unit.: {{ item.preUni }} <a href="#" @click="deleteItem(item)">Excluir</a></li>
  </ul>
  <br>
  <button v-if="itens.length" @click="gerarPedido">Gerar Pedido</button>

  <label v-if="pedidoGerado > 0">Pedido {{ pedidoGerado }} gerado com sucesso! Clique <a href="/">aqui</a> para voltar à página inicial, ou <a :href="'/manipulaPedido/' + pedidoGerado">aqui</a> para editar os componentes do pedido.</label>
</template>

<script>
import ProductSelector from '../components/ProductSelector.vue'
import axios from 'axios'
export default {
  name: 'GerarPedido',
  components: { ProductSelector },
  data () {
    return {
      clientes: null,
      cliente: '',
      pedidoCliente: 0,
      addingProduct: false,
      itens: [],
      pedidoGerado: 0
    }
  },
  mounted () {
    if (!sessionStorage.getItem('token')) {
      this.$router.push({ name: 'Login' })
    }
  },
  methods: {
    buscaClientes () {
      const token = sessionStorage.getItem('token')
      axios.get('http://localhost:8080/clientes?token=' + token)
        .then((response) => {
          this.clientes = response.data.clientes
        })
        .catch((err) => console.log(err))
    },
    selectCliente (clienteClicked) {
      this.cliente = clienteClicked.CODCLI
      document.getElementById('closeModal').click()
    },
    addItem (item) {
      this.itens.push(item)
      this.addingProduct = false
    },
    deleteItem (item) {
      const index = this.itens.indexOf(item)
      if (index !== -1) {
        this.itens.splice(index, 1)
      }
    },
    gerarPedido () {
      if (this.cliente === '') {
        alert('Favor preencher o cliente!')
      } else {
        var parseString = require('xml2js').parseString
        var respostaPedido = null
        const token = sessionStorage.getItem('token')
        const body = JSON.stringify({ pedido: { codEmp: 1, codFil: 1, numPed: 0, codCli: this.cliente, pedCli: this.pedidoCliente }, itens: this.itens })
        const headers = { headers: { 'Content-Type': 'application/json' } }
        axios.put('http://localhost:8080/pedido?token=' + token, body, headers)
          .then((response) => {
            parseString(response.data, { explicitArray: false }, (err, result) => {
              if (err) {
                console.log(err)
              }
              respostaPedido = result['S:Envelope']['S:Body']['ns2:GravarPedidosResponse'].result.respostaPedido
              if (parseInt(respostaPedido.numPed) === 0) {
                alert(respostaPedido.retorno)
              } else {
                this.itens = []
                this.cliente = ''
                this.pedidoCliente = 0
                this.pedidoGerado = respostaPedido.numPed
              }
            })
          })
          .catch((err) => console.log(err))
      }
    }
  }
}
</script>

<style>
  .mouseHover {
    cursor: pointer;
  }
</style>
