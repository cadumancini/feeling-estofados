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
            <button class="btn btn-sm btn-secondary ms-2" data-bs-toggle="modal" data-bs-target="#confirmaExclusaoRascunhoModal">Limpar</button>
          </div>
          <div class="float-end">
            <div class="input-group input-group-sm">
              <span class="input-group-text" >Empresa</span>
              <select v-if="empresasCliente.length" id="inputGroupSelectEmpresa" class="form-select" v-model="empresa">
                  <option selected disabled value="">Selecione uma empresa</option>
                  <option :value="empresaCliente.CODEMP" v-for="empresaCliente in empresasCliente" :key="empresaCliente.CODEMP">{{empresaCliente.CODEMP}} - {{empresaCliente.NOMEMP}}</option>
              </select>
              <select v-else id="inputGroupSelectEmpresa" class="form-select">
                  <option selected disabled>Selecione um cliente</option>
              </select>
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
              <button id="btnSalvar" class="btn btn-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#confirmaPedidoModal">Salvar</button>
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
              <button id="btnBuscaPedidosCliente" class="btn btn-secondary input-group-btn">...</button>
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
              <input id="nomCli" class="form-control" type="text" v-model="nomCli" placeholder="Clique ao lado para selecionar o cliente">
              <button id="btnBuscaClientes" class="btn btn-secondary input-group-btn" @click="buscaClientes" data-bs-toggle="modal" data-bs-target="#clientesModal">...</button>
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

      <!-- Modal Clientes -->
      <div class="modal fade" id="clientesModal" tabindex="-1" aria-labelledby="clientesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="clientesModalLabel">Busca de Clientes</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalClientes"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" v-if="clientes != null">
                <input type="text" class="form-control mb-3" v-on:keyup="filtrarClientes" v-model="clientesFiltro" placeholder="Digite para buscar na tabela abaixo">
                <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                  <thead>
                    <tr>
                      <th scope="col">Código</th>
                      <th scope="col">Cliente</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="clienteRow in clientesFiltrados" :key="clienteRow.CODCLI" class="mouseHover" @click="selectCliente(clienteRow)">
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
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Gerar Pedido -->
      <div class="modal fade" id="confirmaPedidoModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirma geração de pedido</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalConfirmaPedido"></button>
            </div>
            <div class="modal-body">
              <p>Ao salvar, as informações dos dados gerais serão gravadas no rascunho e não poderão ser alteradas mais tarde. Deseja continuar?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="gerarPedido">Sim</button>
              <button type="button" class="btn btn-dismiss" data-bs-dismiss="modal">Não</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Excluir rascunho -->
      <div class="modal fade" id="confirmaExclusaoRascunhoModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirma exclusão de rascunho</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalExclusaoRascunho"></button>
            </div>
            <div class="modal-body">
              <p>Ao excluir, todas as informações inseridas no pedido serão apagadas. Deseja continuar?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="excluirRascunho">Sim</button>
              <button type="button" class="btn btn-dismiss" data-bs-dismiss="modal">Não</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Itens do Pedido -->
      <div v-if="numPed" class="border border-2 mt-2 rounded-3 px-2 py-2">
        <div class="row mb-2">
          <div class="col-6">
            <span class="fw-bold fs-5">Itens do pedido</span>
          </div>
          <div class="col-6">
            <div class="float-end">
              <button class="btn btn-secondary btn-sm" @click="addItemVazio">Adicionar item</button>
              <button id="btnSalvarItens" class="btn btn-secondary btn-sm ms-2" @click="salvarItens">Salvar itens</button>
            </div>
          </div>
        </div>
        <div class="row mb-3 mx-0">
          <table class="table table-striped table-hover table-bordered table-sm table-responsive">
            <thead>
              <tr class="table-dark">
                <th class="fw-normal"><small><font-awesome-icon icon="edit"/></small></th>
                <th class="fw-normal" style="width: 60px;"><small>Cnj.</small></th>
                <th class="fw-normal"><small>Estilo</small></th>
                <th class="fw-normal"><small>Configuração</small></th>
                <th class="fw-normal" style="width: 140px;"><small>Comp.</small></th>
                <th class="fw-normal" style="width: 80px;"><small>UN</small></th>
                <th class="fw-normal" style="width: 80px;"><small>Desc.</small></th>
                <th class="fw-normal" style="width: 80px;"><small>Comiss.</small></th>
                <th class="fw-normal"><small>Cond. Especial?</small></th>
                <th class="fw-normal"><small>Observações</small></th>
                <th class="fw-normal" style="width: 80px;"><small>R$</small></th>
                <th class="fw-normal"><small>Ação</small></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in itens" :key="item.codPro">
                <td class="fw-normal"><button class="btn btn-sm btn-secondary"><font-awesome-icon icon="edit"/></button></td>
                <td class="fw-normal"><input class="form-control form-control-sm"
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                  maxlength="2" type="number" v-model="item.cnj"></td>
                <td class="fw-normal">
                  <div class="input-group input-group-sm">
                    <input class="form-control" type="text" disabled v-model="item.estilo">
                    <button :id="`btnBuscaEstilos`+item.hash" class="btn btn-secondary input-group-btn" @click="buscaEstilos(item)" data-bs-toggle="modal" data-bs-target="#estilosModal">...</button>
                  </div>
                </td>
                <td class="fw-normal">
                  <div class="input-group input-group-sm">
                    <input class="form-control" type="text" disabled v-model="item.config">
                    <button :id="`btnBuscaConfigs`+item.hash" disabled class="btn btn-secondary input-group-btn" @click="buscaConfigs(item, item.codEstilo)" data-bs-toggle="modal" data-bs-target="#configsModal">...</button>
                  </div>
                </td>
                <td class="fw-normal">
                  <div class="input-group input-group-sm">
                    <input id="inputComp" class="form-control" type="text" disabled v-model="item.comp">
                    <button :id="`btnBuscaComps`+item.hash" disabled class="btn btn-secondary input-group-btn" @click="buscaComps(item, item.codConfig)" data-bs-toggle="modal" data-bs-target="#compsModal">...</button>
                  </div>
                </td>
                <td class="fw-normal"><input class="form-control form-control-sm"
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                  maxlength="2" type="number" v-model="item.un"></td>
                <td class="fw-normal"><small>{{item.desc}}</small></td>
                <td class="fw-normal"><small>{{item.comiss}}</small></td>
                <td class="fw-normal">
                  <select id="inputGroupSelectCondEsp" class="form-select form-select-sm" @change="handleCondicao(item)" v-model="item.condEsp">
                    <option value=""></option>
                    <option value="M">Medida Especial</option>
                    <option value="D">Desconto Especial</option>
                    <option value="C">Condição de Pagto</option>
                    <option value="P">Prazo Especial</option>
                    <option value="O">Outras</option>
                  </select>
                </td>
                <td class="fw-normal"><small><input class="form-control form-control-sm" type="text" v-model="item.obs"></small></td>
                <td class="fw-normal"><small>{{item.vlrUnit}}</small></td>
                <td><button class="btn btn-sm btn-danger" @click="deleteItem(item)">Excluir</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Estilos -->
      <div class="modal fade" id="estilosModal" tabindex="-1" aria-labelledby="estilosModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="clientesModalLabel">Busca de Estilos</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalEstilos"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" v-if="estilos != null">
                <input type="text" class="form-control mb-3" v-on:keyup="filtrarEstilos" v-model="estilosFiltro" placeholder="Digite para buscar na tabela abaixo">
                <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                  <thead>
                    <tr>
                      <th scope="col">Código</th>
                      <th scope="col">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="estiloRow in estilosFiltrados" :key="estiloRow.CODCPR" class="mouseHover" @click="selectEstilo(estiloRow)">
                      <th class="fw-normal" scope="row">{{ estiloRow.CODCPR }}</th>
                      <th class="fw-normal">{{ estiloRow.DESCPR }}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <label>Buscando estilos ...</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Configs -->
      <div class="modal fade" id="configsModal" tabindex="-1" aria-labelledby="configsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="clientesModalLabel">Busca de Configurações</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalConfigs"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" v-if="configs != null">
                <input type="text" class="form-control mb-3" v-on:keyup="filtrarConfigs" v-model="configsFiltro" placeholder="Digite para buscar na tabela abaixo">
                <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                  <thead>
                    <tr>
                      <th scope="col">Código</th>
                      <th scope="col">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="configRow in configsFiltrados" :key="configRow.CODPRO" class="mouseHover" @click="selectConfig(configRow)">
                      <th class="fw-normal" scope="row">{{ configRow.CODPRO }}</th>
                      <th class="fw-normal">{{ configRow.DESPRO }}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <label>Buscando configurações ...</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Comps -->
      <div class="modal fade" id="compsModal" tabindex="-1" aria-labelledby="compsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="clientesModalLabel">Busca de Comprimentos (derivação)</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalComps"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" v-if="comps != null">
                <input type="text" class="form-control mb-3" v-on:keyup="filtrarComps" v-model="compsFiltro" placeholder="Digite para buscar na tabela abaixo">
                <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                  <thead>
                    <tr>
                      <th scope="col">Código</th>
                      <th scope="col">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="compRow in compsFiltrados" :key="compRow.CODDER" class="mouseHover" @click="selectComp(compRow)">
                      <th class="fw-normal" scope="row">{{ compRow.CODDER }}</th>
                      <th class="fw-normal">{{ compRow.DESDER }}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <label>Buscando comprimentos ...</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- <ProductSelector class="mb-3" v-if="addingProduct" @addItem="addItem"/> -->
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import ProductSelector from '../components/ProductSelector.vue'
import axios from 'axios'
import StringMask from 'string-mask'
export default {
  name: 'GerarPedido',
  components: { ProductSelector, Navbar },
  data () {
    return {
      clientes: null,
      estilos: null,
      configs: null,
      comps: null,
      clientesFiltrados: null,
      estilosFiltrados: null,
      configsFiltrados: null,
      compsFiltrados: null,
      cliente: '',
      clientesFiltro: '',
      estilosFiltro: '',
      configsFiltro: '',
      compsFiltro: '',
      nomCli: '',
      email: '',
      telefone: '',
      cnpj: '',
      endereco: '',
      cidadeUF: '',
      inscrEst: '',
      frete: '',
      codTransportadora: '',
      transportadora: '',
      codRepresentada: '',
      representada: '',
      empresa: '',
      empresasCliente: [],
      pedidoCliente: 0,
      addingProduct: false,
      itens: [],
      itemSelecionado: null,
      numPed: '',
      pedCli: ''
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
      this.clientes = null
      this.clientesFiltro = ''
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      document.getElementById('btnBuscaClientes').disabled = true
      const token = sessionStorage.getItem('token')
      axios.get('http://localhost:8080/clientes?token=' + token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          this.clientes = response.data.clientes
          this.clientesFiltrados = response.data.clientes
          document.getElementsByTagName('body')[0].style.cursor = 'auto'
          document.getElementById('btnBuscaClientes').disabled = false
        })
        .catch((err) => {
          document.getElementsByTagName('body')[0].style.cursor = 'auto'
          document.getElementById('btnBuscaClientes').disabled = false
          console.log(err)
        })
    },
    buscaEstilos (item) {
      this.itemSelecionado = item
      this.estilos = null
      this.estilosFiltro = ''
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      document.getElementById('btnBuscaEstilos' + item.hash).disabled = true
      document.getElementById('btnBuscaConfigs' + item.hash).disabled = true
      document.getElementById('btnBuscaComps' + item.hash).disabled = true
      const token = sessionStorage.getItem('token')
      axios.get('http://localhost:8080/estilos?emp=1&token=' + token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          this.estilos = response.data.estilos
          this.estilosFiltrados = response.data.estilos
          document.getElementsByTagName('body')[0].style.cursor = 'auto'
          document.getElementById('btnBuscaEstilos' + item.hash).disabled = false
        })
        .catch((err) => {
          document.getElementsByTagName('body')[0].style.cursor = 'auto'
          document.getElementById('btnBuscaEstilos' + item.hash).disabled = false
          console.log(err)
        })
    },
    buscaConfigs (item, estilo) {
      if (estilo) {
        this.itemSelecionado = item
        this.configs = null
        this.configsFiltro = ''
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnBuscaConfigs' + item.hash).disabled = true
        document.getElementById('btnBuscaComps' + item.hash).disabled = true
        const token = sessionStorage.getItem('token')
        axios.get('http://localhost:8080/produtosPorEstilo?emp=1&estilo=' + estilo + '&token=' + token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            this.configs = response.data.produtos
            this.configsFiltrados = response.data.produtos
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaConfigs' + item.hash).disabled = false
          })
          .catch((err) => {
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaConfigs' + item.hash).disabled = false
            console.log(err)
          })
      } else {
        alert('Favor escolher um estilo!')
      }
    },
    buscaComps (item, config) {
      if (config) {
        this.itemSelecionado = item
        this.comps = null
        this.compsFiltro = ''
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnBuscaComps' + item.hash).disabled = true
        const token = sessionStorage.getItem('token')
        axios.get('http://localhost:8080/derivacoesPorProduto?emp=1&produto=' + config + '&token=' + token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            this.comps = response.data.derivacoes
            this.compsFiltrados = response.data.derivacoes
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaComps' + item.hash).disabled = false
          })
          .catch((err) => {
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaComps' + item.hash).disabled = false
            console.log(err)
          })
      } else {
        alert('Favor escolher uma configuração!')
      }
    },
    selectCliente (clienteClicked) {
      const formatter = new StringMask('99.999.999/0000-00')
      this.cliente = clienteClicked.CODCLI
      this.nomCli = clienteClicked.NOMCLI
      this.email = clienteClicked.INTNET
      this.telefone = clienteClicked.FONCLI
      this.cnpj = formatter.apply(clienteClicked.CGCCPF)
      this.endereco = clienteClicked.ENDCPL
      this.cidadeUF = clienteClicked.CIDEST
      this.inscrEst = clienteClicked.INSEST
      this.frete = 'FOB'
      this.empresasCliente = []
      document.getElementById('closeModalClientes').click()
      this.buscarDadosCliente(this.cliente)
    },
    selectEstilo (estiloClicked) {
      this.itemSelecionado.estilo = estiloClicked.DESCPR
      this.itemSelecionado.codEstilo = estiloClicked.CODCPR
      document.getElementById('closeModalEstilos').click()
      document.getElementById('btnBuscaConfigs' + this.itemSelecionado.hash).disabled = false
      document.getElementById('btnBuscaComps' + this.itemSelecionado.hash).disabled = true
      this.itemSelecionado.config = ''
      this.itemSelecionado.codConfig = ''
      this.itemSelecionado.comp = ''
      this.itemSelecionado.codComp = ''
      this.itemSelecionado = null
    },
    selectConfig (configClicked) {
      this.itemSelecionado.config = configClicked.DESPRO
      this.itemSelecionado.codConfig = configClicked.CODPRO
      document.getElementById('closeModalConfigs').click()
      document.getElementById('btnBuscaComps' + this.itemSelecionado.hash).disabled = false
      this.itemSelecionado.comp = ''
      this.itemSelecionado.codComp = ''
      this.itemSelecionado = null
    },
    selectComp (compClicked) {
      this.itemSelecionado.comp = compClicked.DESDER
      this.itemSelecionado.codComp = compClicked.CODDER
      document.getElementById('closeModalComps').click()
      this.itemSelecionado = null
    },
    buscarDadosCliente (codCli) {
      const token = sessionStorage.getItem('token')
      axios.get('http://localhost:8080/dadosCliente?token=' + token + '&codCli=' + codCli)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          this.dadosCliente = response.data.dadosCliente
          if (this.dadosCliente.length > 0) {
            this.codTransportadora = this.dadosCliente[0].CODTRA
            this.transportadora = this.dadosCliente[0].NOMTRA
            this.codRepresentada = this.dadosCliente[0].CODREP
            this.representada = this.dadosCliente[0].NOMREP
            this.dadosCliente.forEach(empresa => {
              this.empresasCliente.push({
                CODEMP: empresa.CODEMP, NOMEMP: empresa.NOMEMP
              })
            })
          } else {

          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addItem (item) {
      this.itens.push(item)
      this.addingProduct = false
    },
    addItemVazio () {
      const item = {
        cnj: '',
        estilo: '',
        config: '',
        posicao: '',
        comp: '',
        un: 1,
        descr: '',
        comiss: '',
        condEsp: '',
        obs: '',
        vlrUnit: '',
        hash: Math.floor(Math.random() * ((this.itens.length + 1) * 1000))
      }
      this.itens.push(item)
    },
    deleteItem (item) {
      const index = this.itens.indexOf(item)
      if (index !== -1) {
        this.itens.splice(index, 1)
      }
    },
    gerarPedido () {
      document.getElementById('closeModalConfirmaPedido').click()
      if (this.cliente === '') {
        alert('Favor preencher o cliente!')
      } else if (this.empresa === '') {
        alert('Favor escolher uma empresa!')
      } else {
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnSalvar').disabled = true
        var parseString = require('xml2js').parseString
        var respostaPedido = null
        const token = sessionStorage.getItem('token')
        const body = JSON.stringify(
          {
            pedido: {
              codEmp: this.empresa,
              codFil: 1,
              numPed: 0,
              codCli: this.cliente,
              pedCli: this.pedidoCliente,
              codRep: this.codRepresentada,
              codTra: this.codTransportadora,
              cifFob: 'F'
            },
            itens: this.itens
          }
        )
        const headers = { headers: { 'Content-Type': 'application/json' } }
        axios.put('http://localhost:8080/pedido?token=' + token, body, headers)
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
                this.numPed = respostaPedido.numPed
                document.getElementById('pedCli').disabled = true
                document.getElementById('nomCli').disabled = true
                document.getElementById('btnBuscaPedidosCliente').disabled = true
                document.getElementById('btnBuscaClientes').disabled = true
                alert('Pedido ' + this.numPed + ' gerado com sucesso!')
                this.itens = []
              }
            })
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnSalvar').disabled = false
          })
          .catch((err) => {
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnSalvar').disabled = false
            console.log(err)
          })
      }
    },
    filtrarClientes () {
      this.clientesFiltrados = this.clientes.filter(cliente => cliente.NOMCLI.toUpperCase().startsWith(this.clientesFiltro.toUpperCase()))
    },
    filtrarEstilos () {
      this.estilosFiltrados = this.estilos.filter(estilo => estilo.DESCPR.toUpperCase().startsWith(this.estilosFiltro.toUpperCase()))
    },
    filtrarConfigs () {
      this.configsFiltrados = this.configs.filter(config => config.DESPRO.toUpperCase().startsWith(this.configsFiltro.toUpperCase()))
    },
    filtrarComps () {
      this.compsFiltrados = this.comps.filter(comp => comp.DESDER.toUpperCase().startsWith(this.compsFiltro.toUpperCase()))
    },
    excluirRascunho () {
      document.getElementById('closeModalExclusaoRascunho').click()
      this.cliente = ''
      this.nomCli = ''
      this.email = ''
      this.telefone = ''
      this.cnpj = ''
      this.endereco = ''
      this.cidadeUF = ''
      this.inscrEst = ''
      this.frete = ''
      this.codTransportadora = ''
      this.transportadora = ''
      this.codRepresentada = ''
      this.representada = ''
      this.empresa = ''
      this.empresasCliente = []
      this.numPed = ''
      this.itens = []
      this.pedCli = ''
    },
    handleCondicao (item) {
      if (item.condEsp === 'M') {
        document.getElementById('inputComp').disabled = false
      } else {
        document.getElementById('inputComp').disabled = true
      }
    },
    salvarItens () {
      const itensPedido = []
      let temErro = false
      this.itens.forEach(item => {
        if (item.un < 1 || item.un > 99) {
          alert('Erro: Existe(m) produto(s) com quantidade menor que zero ou maior que 99. Verifique!')
          temErro = true
        }
        if (!item.cnj || !item.codEstilo || !item.codConfig || !item.codComp) {
          alert('Erro: Existe(m) produto(s) faltando definir conjunto, estilo, configuração ou comprimento. Verifique!')
          temErro = true
        }
        if (item.cnj < 1) {
          alert('Erro: Existe(m) produto(s) com número de conjunto menor que 1. Verifique!')
          temErro = true
        }
      })
      const itensChecarCnj = [...this.itens]
      itensChecarCnj.sort(this.compare)
      let cnjIni = itensChecarCnj[0].cnj
      let estiloIni = itensChecarCnj[0].codEstilo
      itensChecarCnj.forEach(item => {
        if (item.cnj === cnjIni && item.codEstilo !== estiloIni) {
          alert('Erro: Existe(m) produto(s) com o mesmo número do conjunto (conj. ' + item.cnj + ') mas com estilos diferentes. Verifique!')
          temErro = true
        }
        if (item.cnj !== cnjIni) {
          cnjIni = item.cnj
          estiloIni = item.codEstilo
        }
      })
      if (!temErro) {
        this.itens.forEach(item => {
          itensPedido.push(
            {
              numCnj: item.cnj,
              codPro: item.codConfig,
              desPro: (item.config + ' ' + item.comp),
              codDer: item.codComp,
              seqIpd: 0,
              qtdPed: item.un,
              preUni: 1000
            }
          )
        })
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnSalvarItens').disabled = true
        var parseString = require('xml2js').parseString
        var respostaPedido = null
        const token = sessionStorage.getItem('token')
        const body = JSON.stringify(
          {
            pedido: {
              codEmp: this.empresa,
              codFil: 1,
              numPed: this.numPed
            },
            itens: itensPedido
          }
        )
        const headers = { headers: { 'Content-Type': 'application/json' } }
        axios.post('http://localhost:8080/pedido/itens?token=' + token, body, headers)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            parseString(response.data, { explicitArray: false }, (err, result) => {
              if (err) {
                console.log(err)
              }
              respostaPedido = result['S:Envelope']['S:Body']['ns2:GravarPedidosResponse'].result.respostaPedido
              if (parseInt(respostaPedido.retorno) === 'OK') {
                alert('Itens salvos com sucesso!')
                this.carregarItens()
              } else {
                alert(respostaPedido.retorno)
              }
            })
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnSalvarItens').disabled = false
          })
          .catch((err) => {
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnSalvarItens').disabled = false
            console.log(err)
          })
      }
    },
    compare (a, b) {
      if (a.cnj < b.cnj) {
        return -1
      }
      if (a.cnj > b.cnj) {
        return 1
      }
      return 0
    },
    carregarItens () {
      const token = sessionStorage.getItem('token')
      this.itens = []
      axios.get('http://localhost:8080/itensPedido?emp=' + this.empresa + '&fil=1&ped=' + this.numPed + '&token=' + token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          response.data.itens.forEach(item => {
            this.itens.push(
              {
                cnj: item.SEQPCL
              }
            )
          })
        })
        .catch((err) => {
          console.log(err)
        })
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
  .btn-dismiss {
    color: #fff;
    background-color: #aab4bd;
  }
  .btn-dismiss:hover {
    color: #fff;
    background-color: #93999e;
  }
</style>
