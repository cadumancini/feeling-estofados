<template>
  <div class="gerarPedido">
    <Navbar/>
    <div class="mx-3">
      <div class="row mb-3">
        <p class="fw-bold fs-3">Geração de Pedido</p>
      </div>
      <div class="row mb-3">
        <label for="codCli" class="form-label">Cliente:</label>
        <div class="col-auto">
          <input id="codCli" class="form-control" type="text" autofocus v-model="cliente">
        </div>
        <div class="col-auto">
          <button class="btn btn-secondary" @click="buscaClientes" data-bs-toggle="modal" data-bs-target="#clientesModal">...</button>
        </div>
      </div>
      <div class="row mb-3">
        <label for="pedCli" class="form-label">Número do Pedido no Cliente:</label>
        <div class="col-auto">
          <input id="pedCli" class="form-control" type="text" onfocus="this.select();" v-model="pedidoCliente">
        </div>
      </div>

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
                      <th class="fw-normal" scope="row">{{ clienteRow.CODCLI }}</th>
                      <th class="fw-normal">{{ clienteRow.NOMCLI }}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <label>Buscando clientes ...</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <button class="btn btn-secondary mb-3" v-if="!addingProduct" @click="addingProduct = true; pedidoGerado = 0">Adicionar Produto</button>
      <ProductSelector class="mb-3" v-if="addingProduct" @addItem="addItem"/>

      <div v-if="itens.length" class="row">
        <p class="fw-bold fs-5">Produtos Adicionados</p>
      </div>

      <div class="row mb-3 mx-0">
        <table v-if="itens.length" class="table table-striped table-hover table-bordered table-sm table-responsive">
          <thead>
            <tr class="table-dark">
              <th class="fw-normal">Produto</th>
              <th class="fw-normal">Der.</th>
              <th class="fw-normal">Descrição</th>
              <th class="fw-normal">Qtde.</th>
              <th class="fw-normal">Valor Unit. (R$)</th>
              <th class="fw-normal">Ação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in itens" :key="item.codPro">
              <th class="fw-normal">{{ item.codPro }}</th>
              <th class="fw-normal">{{ item.codDer }}</th>
              <th class="fw-normal">{{ item.desPro }}</th>
              <th class="fw-normal">{{ item.qtdPed }}</th>
              <th class="fw-normal">{{ vueNumberFormat(item.preUni, {}) }}</th>
              <th><button class="btn btn-sm btn-danger" @click="deleteItem(item)">Excluir</button></th>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="btn btn-secondary" v-if="itens.length" @click="gerarPedido">Gerar Pedido</button>

      <p class="fw-bold" v-if="pedidoGerado > 0">Pedido {{ pedidoGerado }} gerado com sucesso! Clique <a href="/">aqui</a> para voltar à página inicial, ou <a :href="'/manipularPedido/' + pedidoGerado">aqui</a> para editar os componentes do pedido.</p>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import ProductSelector from '../components/ProductSelector.vue'
import axios from 'axios'
export default {
  name: 'GerarPedido',
  components: { ProductSelector, Navbar },
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

<style scoped>
  html, body {
      height: 100%;
    }
  .gerarPedido {
    height: 100%;
    background-color: #f5f5f5;
  }
  .mouseHover {
    cursor: pointer;
  }
</style>
