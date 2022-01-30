<template>
  <div class="gerarPedido">
    <Navbar/>
    <div class="mx-3">
      <div class="row mb-3">
        <div class="col-6">
          <span class="fw-bold fs-4">Geração de Pedido</span>
        </div>
        <div class="col-6">
          <div class="float-end">
            <button class="btn btn-sm btn-secondary ms-2">Enviar à empresa</button>
            <button class="btn btn-sm btn-secondary ms-2">Excluir rascunho</button>
          </div>
          <div class="float-end">
            <div class="input-group input-group-sm">
              <span class="input-group-text" >Empresa:</span>
              <input id="codEmp" class="form-control" type="text" autofocus v-model="empresa">
              <button class="btn btn-secondary input-group-btn">...</button>
            </div>
          </div>
        </div>
      </div>
      <div class="border border-2 rounded-3 px-2 py-2">
        <div class="row mb-3">
          <div class="col-6">
              <span class="fw-bold fs-5">Dados Gerais</span>
          </div>
          <div class="col-6">
            <div class="float-end">
              <button class="btn btn-secondary btn-sm">Salvar</button>
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Nº Pedido</span>
              <input id="numPed" class="form-control" type="text" disabled v-model="numPed">
              <button class="btn btn-secondary input-group-btn">...</button>
            </div>
          </div>
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Transportadora</span>
              <input id="transportadora" class="form-control" type="text" disabled v-model="transportadora">
            </div>
          </div>
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Frete</span>
              <input id="frete" class="form-control" type="text" disabled v-model="frete">
            </div>
          </div>
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Previsão faturamento</span>
              <input id="prevFaturamento" class="form-control" type="text" disabled v-model="prevFaturamento">
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Pedido Cliente</span>
              <input id="pedCli" class="form-control" type="text" v-model="pedCli">
              <button class="btn btn-secondary input-group-btn">...</button>
            </div>
          </div>
          <div class="col-5">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Representada</span>
              <input id="representada" class="form-control" type="text" disabled v-model="representada">
            </div>
          </div>
          <div class="col-4">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Condição de pagamento</span>
              <input id="condPagamento" class="form-control" type="text" disabled v-model="condPagamento">
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Cliente</span>
              <input id="nomCli" class="form-control" type="text" v-model="nomCli">
              <button class="btn btn-secondary input-group-btn">...</button>
            </div>
          </div>
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">E-mail</span>
              <input id="email" class="form-control" type="text" disabled v-model="email">
            </div>
          </div>
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Fone</span>
              <input id="telefone" class="form-control" type="text" disabled v-model="telefone">
            </div>
          </div>
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">CNPJ</span>
              <input id="cnpj" class="form-control" type="text" disabled v-model="cnpj">
            </div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-4">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Endereço</span>
              <input id="endereco" class="form-control" type="text" disabled v-model="endereco">
            </div>
          </div>
          <div class="col-4">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Cidade/UF</span>
              <input id="cidadeUF" class="form-control" type="text" disabled v-model="cidadeUF">
            </div>
          </div>
          <div class="col-4">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Insc. Est.</span>
              <input id="inscrEst" class="form-control" type="text" disabled v-model="inscrEst">
            </div>
          </div>
        </div>
      </div>
      <!-- aaa -->
      <!-- <div class="row mb-3">
        <label for="codCli" class="form-label">Cliente:</label>
        <div class="col-auto">
          <input id="codCli" class="form-control" type="text" autofocus v-model="cliente">
        </div>
        <div class="col-auto">
          <button class="btn btn-secondary" id="btnBuscaClientes" @click="buscaClientes" data-bs-toggle="modal" data-bs-target="#clientesModal">...</button>
        </div>
      </div>
      <div class="row mb-3">
        <label for="pedCli" class="form-label">Número do Pedido no Cliente:</label>
        <div class="col-auto">
          <input id="pedCli" class="form-control" type="text" onfocus="this.select();" v-model="pedidoCliente">
        </div>
      </div>

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

      <button class="btn btn-secondary mb-3" v-if="!addingProduct" id="btnAdicionarProduto" @click="addingProduct = true; pedidoGerado = 0">Adicionar Produto</button>
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
              <td class="fw-normal">{{ item.codPro }}</td>
              <td class="fw-normal">{{ item.codDer }}</td>
              <td class="fw-normal">{{ item.desPro }}</td>
              <td class="fw-normal">{{ item.qtdPed }}</td>
              <td class="fw-normal">{{ vueNumberFormat(item.preUni, {}) }}</td>
              <td><button class="btn btn-sm btn-danger" @click="deleteItem(item)">Excluir</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button class="btn btn-secondary" v-if="itens.length" id="btnGerarPedido" @click="gerarPedido">Gerar Pedido</button>

      <p class="fw-bold" v-if="pedidoGerado > 0">Pedido {{ pedidoGerado }} gerado com sucesso! Clique <router-link :to="{ name: 'Home' }">aqui</router-link> para voltar à página inicial, ou <router-link :to="{ name: 'ManipularPedidoComItem', params: { numPed: pedidoGerado } }">aqui</router-link> para editar os componentes do pedido.</p> -->
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
    checkInvalidLoginResponse (response) {
      if (response === 'Token inválido.') {
        alert('Seu token de acesso não é mais válido. É necessário fazer login novamente.')
        sessionStorage.removeItem('token')
        this.$router.push({ name: 'Login' })
      }
    },
    buscaClientes () {
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      document.getElementById('btnBuscaClientes').disabled = true
      const token = sessionStorage.getItem('token')
      axios.get('http://192.168.1.168:8080/clientes?token=' + token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          this.clientes = response.data.clientes
          document.getElementsByTagName('body')[0].style.cursor = 'auto'
          document.getElementById('btnBuscaClientes').disabled = false
        })
        .catch((err) => {
          document.getElementsByTagName('body')[0].style.cursor = 'auto'
          document.getElementById('btnBuscaClientes').disabled = false
          console.log(err)
        })
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
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnGerarPedido').disabled = true
        document.getElementById('btnAdicionarProduto').disabled = true
        var parseString = require('xml2js').parseString
        var respostaPedido = null
        const token = sessionStorage.getItem('token')
        const body = JSON.stringify({ pedido: { codEmp: 1, codFil: 1, numPed: 0, codCli: this.cliente, pedCli: this.pedidoCliente }, itens: this.itens })
        const headers = { headers: { 'Content-Type': 'application/json' } }
        axios.put('http://192.168.1.168:8080/pedido?token=' + token, body, headers)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
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
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnGerarPedido').disabled = false
            document.getElementById('btnAdicionarProduto').disabled = false
          })
          .catch((err) => {
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnGerarPedido').disabled = false
            document.getElementById('btnAdicionarProduto').disabled = false
            console.log(err)
          })
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
  .input-group-btn {
    width: 40px !important;
  }
</style>
