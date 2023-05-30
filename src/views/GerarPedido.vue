<template>
  <div class="gerarPedido">
    <Navbar/>
    <div class="mx-3">
      <div class="row mb-1">
        <div class="col-3">
          <span class="fw-bold fs-4">Geração de Pedido</span>
        </div>
        <div class="col">
          <div class="float-end">
            <button class="btn btn-sm btn-secondary ms-2" :disabled="numPed == '' || (numPed != '' && (enviadoEmpresa && !itemAbe))" data-bs-toggle="modal" data-bs-target="#confirmaEnviarEmpresaModal">Enviar à empresa</button>
            <button class="btn btn-sm btn-secondary ms-2" data-bs-toggle="modal" data-bs-target="#confirmaExclusaoRascunhoModal">Limpar</button>
          </div>
          <div class="float-end">
            <div class="input-group input-group-sm">
              <span class="input-group-text" >Empresa</span>
              <select v-if="empresasCliente.length" :disabled="enviadoEmpresa" id="inputGroupSelectEmpresa" class="form-select" v-model="empresa">
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
        <div class="row mb-2">
          <div class="col">
            <span class="fw-bold fs-5">Dados Gerais</span>
            <span v-if="enviadoEmpresa" class="ms-3 fs-6 fst-italic text-danger">O pedido encontra-se bloqueado para alteração no cabeçalho.</span>
          </div>
          <div class="col-2">
            <div class="float-end">
              <button id="btnSalvar" class="btn btn-secondary btn-sm" :disabled="enviadoEmpresa" data-bs-toggle="modal" data-bs-target="#confirmaPedidoModal">Salvar</button>
            </div>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Nº Pedido</span>
              <input id="numPed" class="form-control" type="text" disabled v-model="numPed">
              <button id="btnBuscaPedidos" class="btn btn-secondary input-group-btn btn-busca" @click="buscaPedidos" data-bs-toggle="modal" data-bs-target="#pedidosModal">...</button>
            </div>
          </div>
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Transportadora</span>
              <input id="transportadora" class="form-control" type="text" disabled v-model="transportadora">
              <button id="btnBuscaTransportadoras" :disabled="enviadoEmpresa || cliente === ''" class="btn btn-secondary input-group-btn btn-busca" @click="buscaTransportadoras" data-bs-toggle="modal" data-bs-target="#transportadorasModal">...</button>
            </div>
          </div>
          <div class="col-2">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Frete</span>
              <input id="frete" class="form-control" type="text" disabled v-model="frete">
              <button id="btnBuscaFretes" :disabled="enviadoEmpresa || cliente === ''" class="btn btn-secondary input-group-btn btn-busca" @click="buscaFretes" data-bs-toggle="modal" data-bs-target="#fretesModal">...</button>
            </div>
          </div>
          <div class="col">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Previsão faturamento</span>
              <input id="prevFaturamento" class="form-control" type="text" disabled v-model="prevFaturamento">
            </div>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Cliente</span>
              <input id="nomCli" class="form-control" type="text" disabled v-bind:class="{ 'white-bg': (!enviadoEmpresa) }" v-model="nomCli" placeholder="Clique ao lado para selecionar">
              <button id="btnBuscaClientes" class="btn btn-secondary input-group-btn btn-busca" :disabled="enviadoEmpresa" @click="buscaClientes" data-bs-toggle="modal" data-bs-target="#clientesModal">...</button>
            </div>
          </div>
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Pedido Cliente</span>
              <input id="pedCli" class="form-control" :disabled="enviadoEmpresa"
              oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
              maxlength="20" type="text" v-model="pedCli" v-on:keyup="normalizarPedidoCliente">
              <button id="btnBuscaPedidosCliente" :disabled="enviadoEmpresa" class="btn btn-secondary input-group-btn btn-busca" @click="buscaPedidosCliente" data-bs-toggle="modal" data-bs-target="#pedidosClienteModal">...</button>
            </div>
          </div>
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Pedido Representante</span>
              <input id="pedRep" class="form-control" :disabled="enviadoEmpresa"
              oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
              maxlength="30" type="text" v-model="pedRep" v-on:keyup="normalizarPedidoRepresentante">
            </div>
          </div>
          <div class="col-3">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Transação</span>
              <input id="frete" class="form-control" type="text" disabled v-bind:class="{ 'white-bg': (!enviadoEmpresa) }" v-model="transacao" placeholder="Clique ao lado para selecionar">
              <button id="btnBuscaTransacoes" :disabled="enviadoEmpresa || empresa === ''" class="btn btn-secondary input-group-btn btn-busca" @click="buscaTransacoes" data-bs-toggle="modal" data-bs-target="#transacoesModal">...</button>
            </div>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-4">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Condição de pagamento</span>
              <input class="form-control" type="text" disabled v-bind:class="{ 'white-bg': (!enviadoEmpresa) }" v-model="condPagamento" placeholder="Clique ao lado para selecionar">
              <button id="btnBuscaCondicoesPagto" :disabled="enviadoEmpresa" class="btn btn-secondary input-group-btn btn-busca" @click="buscaCondicoesPagto" data-bs-toggle="modal" data-bs-target="#condicoesPagtoModal">...</button>
            </div>
          </div>
          <div class="col-6">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Representada</span>
              <input id="representada" class="form-control" type="text" disabled v-model="representada">
            </div>
          </div>
          <div class="col-2">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Feira</span>
              <select :disabled="enviadoEmpresa" id="inputGroupSelectFeira" class="form-select" v-model="feira">
                  <option selected value="N">Não</option>
                  <option value="S">Sim</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-5">
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
          <div class="col-4">
            <div class="input-group input-group-sm">
              <span class="input-group-text">CNPJ</span>
              <input id="cnpj" class="form-control" type="text" disabled v-model="cnpj">
            </div>
          </div>
        </div>
        <div class="row mb-2">
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
        <div class="row">
          <div class="col-12">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Observações</span>
              <input id="observacoesPedido" class="form-control" :disabled="enviadoEmpresa"
              oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
              maxlength="200" type="text" v-model="observacoesPedido">
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Enviar a Empresa -->
      <div class="modal fade" id="confirmaEnviarEmpresaModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirma envio à empresa</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalEnviarEmpresa"></button>
            </div>
            <div class="modal-body">
              <p>Ao enviar à empresa, o pedido será gerado no sistema da Feeling e não constará mais para alteração ou consulta. Para realizar quaisquer alterações, será preciso entrar em contato com o comercial Feeling. O processo pode demorar alguns instantes, pois irá verificar se existe pendências na estrutura. Deseja continuar?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="enviarEmpresa">Sim</button>
              <button type="button" class="btn btn-dismiss" data-bs-dismiss="modal">Não</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Clientes -->
      <div class="modal fade" id="clientesModal" tabindex="-1" aria-labelledby="clientesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="clientesModalLabel">Busca de Clientes</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalClientes"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" v-if="clientes != null">
                <span>Buscar por: </span>
                <input type="radio" id="filtroDesc" checked v-model="clientesOpcaoFiltro" name="opcaoFiltroCliente" value="desc">
                <label class="ps-1 pe-2" for="filtroDesc">Descrição</label>
                <input type="radio" id="filtroCnpj" v-model="clientesOpcaoFiltro" name="opcaoFiltroCliente" value="cnpj">
                <label class="ps-1" for="filtroCnpj">CNPJ (apenas números)</label>
                <input type="text" class="form-control mb-3" v-on:keyup="filtrarClientes" v-model="clientesFiltro" placeholder="Digite para buscar na tabela abaixo">
                <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                  <thead>
                    <tr>
                      <th scope="col">CNPJ</th>
                      <th scope="col">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="clienteRow in clientesFiltrados" :key="clienteRow.CODCLI" class="mouseHover" @click="selectCliente(clienteRow)">
                      <th class="fw-normal" scope="row">{{ clienteRow.CNPJ }}</th>
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

      <!-- Modal Transportadoras -->
      <div class="modal fade" id="transportadorasModal" tabindex="-1" aria-labelledby="transportadorasModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="transportadorasModalLabel">Busca de Transportadoras</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalTransportadoras"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" v-if="transportadoras != null">
                <input type="text" class="form-control mb-3" v-on:keyup="filtrarTransportadoras" v-model="transportadorasFiltro" placeholder="Digite para buscar a transportadora na tabela abaixo">
                <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                  <thead>
                    <tr>
                      <th class="sm-header" scope="col">Código</th>
                      <th class="sm-header" scope="col">Transportadora</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="transportadoraRow in transportadorasFiltradas" :key="transportadoraRow.CODTRA" class="mouseHover" @click="selectTransportadora(transportadoraRow)">
                      <th class="fw-normal sm" scope="row">{{ transportadoraRow.CODTRA }}</th>
                      <th class="fw-normal sm">{{ transportadoraRow.NOMTRA }}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <label>Buscando transportadoras ...</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Fretes -->
      <div class="modal fade" id="fretesModal" tabindex="-1" aria-labelledby="fretesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="fretesModalLabel">Seleção de Frete</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalFretes"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" v-if="fretes != null">
                <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                  <thead>
                    <tr>
                      <th class="sm-header" scope="col">Código</th>
                      <th class="sm-header" scope="col">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="freteRow in fretes" :key="freteRow.CIFFOB" class="mouseHover" @click="selectFrete(freteRow)">
                      <th class="fw-normal" scope="row">{{ freteRow.CIFFOB }}</th>
                      <th class="fw-normal">{{ freteRow.DESFRE }}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <label>Buscando fretes ...</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Transacoes -->
      <div class="modal fade" id="transacoesModal" tabindex="-1" aria-labelledby="transacoesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="fretesModalLabel">Seleção de Transação</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalTransacoes"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" v-if="transacoes != null">
                <input type="text" class="form-control mb-3" v-on:keyup="filtrarTransacoes" v-model="transacoesFiltro" placeholder="Digite para buscar a transação na tabela abaixo">
                <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                  <thead>
                    <tr>
                      <th class="sm-header" scope="col">Código</th>
                      <th class="sm-header" scope="col">Descrição</th>
                      <th class="sm-header" scope="col">Detalhamento</th>
                      <th class="sm-header" scope="col">Isento de IPI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="transacaoRow in transacoesFiltrados" :key="transacaoRow.CODTNS" class="mouseHover" @click="selectTransacao(transacaoRow)">
                      <th class="fw-normal" scope="row">{{ transacaoRow.CODTNS }}</th>
                      <th class="fw-normal">{{ transacaoRow.DESTNS }}</th>
                      <th class="fw-normal">{{ transacaoRow.DETTNS }}</th>
                      <th class="fw-normal">{{ transacaoRow.VENIPI }}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <label>Buscando transações ...</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Pedidos -->
      <div class="modal fade" id="pedidosModal" tabindex="-1" aria-labelledby="pedidosModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="pedidosModalLabel">Busca de Pedidos do Usuário</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalPedidos"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" v-if="pedidos != null">
                <input type="text" class="form-control mb-3" v-on:keyup="filtrarPedidos" v-model="pedidosFiltro" placeholder="Digite para buscar o pedido na tabela abaixo">
                <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                  <thead>
                    <tr>
                      <th class="sm-header" scope="col">Empresa</th>
                      <th class="sm-header" scope="col">Pedido Cliente</th>
                      <th class="sm-header" scope="col">Pedido Feeling</th>
                      <th class="sm-header" scope="col">Emissão</th>
                      <th class="sm-header" scope="col">Cliente</th>
                      <th class="sm-header" scope="col">Representada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="pedidoRow in pedidosFiltrados" :key="pedidoRow.NUMPED" class="mouseHover" @click="selectPedido(pedidoRow)">
                      <th class="fw-normal sm" scope="row">{{ pedidoRow.CODEMP }}</th>
                      <th class="fw-normal sm">{{ pedidoRow.PEDCLI }}</th>
                      <th class="fw-normal sm">{{ pedidoRow.NUMPED }}</th>
                      <th class="fw-normal sm">{{ pedidoRow.DATEMI }}</th>
                      <th class="fw-normal sm">{{ pedidoRow.NOMCLI }}</th>
                      <th class="fw-normal sm">{{ pedidoRow.NOMREP }}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else>
                <label>Buscando pedidos ...</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Pedidos Clientes -->
      <div class="modal fade" id="pedidosClienteModal" tabindex="-1" aria-labelledby="pedidosClientesModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="pedidosClientesModalLabel">Busca de Pedidos de Clientes</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalPedidosCliente"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" v-if="cliente !== ''">
                <div class="mb-3" v-if="pedidosCliente != null">
                  <input type="text" class="form-control mb-3" v-on:keyup="filtrarPedidosCliente" v-model="pedidosClienteFiltro" placeholder="Digite para buscar o pedido do cliente na tabela abaixo">
                  <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                    <thead>
                      <tr>
                        <th class="sm-header" scope="col">Empresa</th>
                        <th class="sm-header" scope="col">Pedido Cliente</th>
                        <th class="sm-header" scope="col">Pedido Feeling</th>
                        <th class="sm-header" scope="col">Emissão</th>
                        <th class="sm-header" scope="col">Cliente</th>
                        <th class="sm-header" scope="col">Representada</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="pedidoClienteRow in pedidosClienteFiltrados" :key="pedidoClienteRow.NUMPED" class="mouseHover" @click="selectPedidoCliente(pedidoClienteRow)">
                        <th class="fw-normal sm" scope="row">{{ pedidoClienteRow.CODEMP }}</th>
                        <th class="fw-normal sm">{{ pedidoClienteRow.PEDCLI }}</th>
                        <th class="fw-normal sm">{{ pedidoClienteRow.NUMPED }}</th>
                        <th class="fw-normal sm">{{ pedidoClienteRow.DATEMI }}</th>
                        <th class="fw-normal sm">{{ pedidoClienteRow.NOMCLI }}</th>
                        <th class="fw-normal sm">{{ pedidoClienteRow.NOMREP }}</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else>
                  <label>Buscando pedidos ...</label>
                </div>
              </div>
              <div v-else>
                <label>Favor selecionar um cliente!</label>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Fechar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Condições de Pagto -->
      <div class="modal fade" id="condicoesPagtoModal" tabindex="-1" aria-labelledby="condicoesPagtoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="condicoesPagtoModalLabel">Busca de Condições de Pagamento</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalCondicoesPagto"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3" v-if="empresa !== ''">
                <div class="mb-3" v-if="condicoesPagto != null">
                  <input type="text" class="form-control mb-3" v-on:keyup="filtrarCondicoesPagto" v-model="condicoesPagtoFiltro" placeholder="Digite para buscar a condição na tabela abaixo">
                  <table class="table table-striped table-hover table-bordered table-sm table-responsive">
                    <thead>
                      <tr>
                        <th class="sm-header" scope="col">Código</th>
                        <th class="sm-header" scope="col">Descrição Condição</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="condicaoPagtoRow in condicoesPagtoFiltrados" :key="condicaoPagtoRow.CODCPG" class="mouseHover" @click="selectCondicaoPagto(condicaoPagtoRow)">
                        <th class="fw-normal sm" scope="row">{{ condicaoPagtoRow.CODCPG }}</th>
                        <th class="fw-normal sm">{{ condicaoPagtoRow.DESCPG }}</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else>
                  <label>Buscando condições de pagamento ...</label>
                </div>
              </div>
              <div v-else>
                <label>Favor selecionar uma empresa!</label>
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
      <div v-if="numPed" class="border border-2 mt-3 rounded-3 px-2 py-2">
        <div class="row mb-2">
          <div class="col-6">
            <span class="fw-bold fs-5">Itens do pedido</span>
          </div>
          <div class="col-6">
            <div class="float-end">
              <button class="btn btn-secondary btn-sm" :disabled="bloqueado" @click="addItemVazio">Adicionar item</button>
              <button id="btnSalvarItens" class="btn btn-secondary btn-sm ms-2" :disabled="bloqueado" data-bs-toggle="modal" data-bs-target="#confirmaSalvarItensModal">Salvar itens</button>
            </div>
          </div>
        </div>
        <div class="row mx-0">
          <table class="table table-striped table-bordered table-sm table-responsive">
            <thead>
              <tr class="table-dark">
                <th class="fw-normal sm-header" style="width: 2%;"><small><font-awesome-icon icon="edit"/></small></th>
                <th class="fw-normal sm-header" style="width: 4%;"><small>Cnj.</small></th>
                <th class="fw-normal sm-header" style="width: 12%;"><small>Estilo</small></th>
                <th class="fw-normal sm-header" style="width: 18%;"><small>Configuração</small></th>
                <th class="fw-normal sm-header" style="width: 8%;"><small>Comp. (cm)</small></th>
                <th class="fw-normal sm-header" style="width: 4%"><small>UN</small></th>
                <th class="fw-normal sm-header" style="width: 6%;"><small>Cond. Especial</small></th>
                <th class="fw-normal sm-header" style="width: 20%;"><small>Observações</small></th>
                <th class="fw-normal sm-header" style="width: 2%;"><small>%</small></th>
                <th class="fw-normal sm-header" style="width: 7%;"><small>Vlr. Unit. (R$)</small></th>
                <th class="fw-normal sm-header" style="width: 7%;"><small>Vlr. Final (R$)</small></th>
                <th class="fw-normal sm-header" style="width: 10%;"><small>Ação</small></th>
              </tr>
            </thead>
            <tbody v-for="item in itens" :key="item.codPro">
              <tr v-if="item.sitIpd !== '5'">
                <td class="fw-normal">
                  <button class="btn btn-sm btn-secondary sm" @click="setManipular(item)" :disabled="!item.seqIpd || bloqueado || item.temOrp || item.ipdEnv" data-bs-toggle="tooltip" data-bs-placement="top" title="Manipular estrutura">
                    <font-awesome-icon icon="edit"/>
                  </button>
                </td>
                <td class="fw-normal">
                  <div class="input-group input-group-sm">
                    <input class="form-control sm" :disabled="bloqueado || item.temOrp || item.ipdEnv"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    maxlength="2" type="number" v-model="item.cnj">
                  </div>
                </td>
                <td class="fw-normal">
                  <div class="input-group input-group-sm">
                    <input class="form-control sm" type="text" disabled v-model="item.estilo">
                    <button :id="`btnBuscaEstilos`+item.hash" :disabled="bloqueado || item.temOrp || item.ipdEnv" class="btn btn-secondary input-group-btn sm btn-busca" @click="buscaEstilos(item)" data-bs-toggle="modal" data-bs-target="#estilosModal">...</button>
                  </div>
                </td>
                <td class="fw-normal">
                  <div class="input-group input-group-sm">
                    <input class="form-control sm" type="text" disabled v-model="item.config">
                    <button :id="`btnBuscaConfigs`+item.hash" disabled class="btn btn-secondary input-group-btn sm btn-busca" @click="buscaConfigs(item, item.codEstilo)" data-bs-toggle="modal" data-bs-target="#configsModal">...</button>
                  </div>
                </td>
                <td class="fw-normal">
                  <div class="input-group input-group-sm">
                    <input :id="'inputComp'+item.hash" class="form-control sm"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    maxlength="3" type="number" :disabled="!item.cMed || item.temOrp" v-model="item.comp">
                    <button :id="`btnBuscaComps`+item.hash" disabled class="btn btn-secondary input-group-btn sm btn-busca" @click="buscaComps(item, item.codConfig)" data-bs-toggle="modal" data-bs-target="#compsModal">...</button>
                  </div>
                </td>
                <td class="fw-normal"><input class="form-control form-control-sm sm" :disabled="item.temOrp"
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                  maxlength="2" type="number" v-model="item.un"></td>
                <td class="fw-normal" data-bs-toggle="tooltip" data-bs-placement="top" title="Condições especiais">
                  <button class="btn btn-secondary dropdown-toggle sm btn-sm" :disabled="bloqueado || item.temOrp || item.ipdEnv" type="button" data-bs-toggle="dropdown"
                          aria-haspopup="true" aria-expanded="false">Selecione</button>
                  <div class="dropdown-menu">
                    <a class="dropdown-item">
                      <div class="custom-control custom-checkbox sm">
                        <input type="checkbox" class="custom-control-input" :id="'cbMedida'+item.hash" @change="checkMedida(item)" v-model="item.cMed">
                        <label class="custom-control-label ps-1" :for="'cbMedida'+item.hash">Medida Especial</label>
                      </div>
                    </a>
                    <!-- <a class="dropdown-item" href="#">
                      <div class="custom-control custom-checkbox sm">
                        <input type="checkbox" class="custom-control-input" :id="'cbDesconto'+item.hash" @change="checkDesconto(item)" v-model="item.cDes">
                        <label class="custom-control-label ps-1" :for="'cbDesconto'+item.hash">Desconto Especial</label>
                      </div>
                    </a>
                    <a class="dropdown-item" href="#">
                      <div class="custom-control custom-checkbox sm">
                        <input type="checkbox" class="custom-control-input" :id="'cbCondicao'+item.hash" @change="checkCondicao(item)" v-model="item.cCon">
                        <label class="custom-control-label ps-1" :for="'cbCondicao'+item.hash">Condição de Pagto</label>
                      </div>
                    </a>
                    <a class="dropdown-item" href="#">
                      <div class="custom-control custom-checkbox sm">
                        <input type="checkbox" class="custom-control-input" :id="'cbPrazo'+item.hash" @change="checkPrazo(item)" v-model="item.cPra">
                        <label class="custom-control-label ps-1" :for="'cbPrazo'+item.hash">Prazo Especial</label>
                      </div>
                    </a> -->
                    <a class="dropdown-item" href="#">
                      <div class="custom-control custom-checkbox sm">
                        <input type="checkbox" class="custom-control-input" :id="'cbOutras'+item.hash" @change="checkOutras(item)" v-model="item.cOut">
                        <label class="custom-control-label ps-1" :for="'cbOutras'+item.hash">Outras Esppeciais</label>
                      </div>
                    </a>
                  </div>
                </td>
                <td class="fw-normal"><small><input class="form-control form-control-sm sm" :disabled="bloqueado || item.temOrp || item.ipdEnv" type="text" v-model="item.obs"></small></td>
                <td data-bs-toggle="tooltip" data-bs-placement="top" title="Parâmetros comerciais">
                  <button class="btn btn-sm btn-secondary sm" :disabled="bloqueado || item.temOrp || item.ipdEnv" data-bs-toggle="modal" :data-bs-target="`#paramsModal-`+item.hash">
                    <font-awesome-icon icon="percentage"/>
                  </button>
                  <!-- Modal Params -->
                  <div class="modal fade" :id="`paramsModal-`+item.hash" tabindex="-1" aria-labelledby="paramsModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable modal-sm">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="paramsModalLabel">Parâmetros Comerciais</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <div class="row mb-3">
                            <div class="input-group input-group-sm">
                              <span class="input-group-text param-comercial ps-4">1º Desc. (%)</span>
                              <vue-mask class="form-control form-control-sm sm" mask="00,00" :raw="false" :options="options" v-model="item.desc1"></vue-mask>
                            </div>
                          </div>
                          <div class="row mb-3">
                            <div class="input-group input-group-sm">
                              <span class="input-group-text param-comercial ps-4">2º Desc. (%)</span>
                              <vue-mask class="form-control form-control-sm sm" mask="00,00" :raw="false" :options="options" v-model="item.desc2"></vue-mask>
                            </div>
                          </div>
                          <div class="row mb-3">
                            <div class="input-group input-group-sm">
                              <span class="input-group-text param-comercial ps-4">3º Desc. (%)</span>
                              <vue-mask class="form-control form-control-sm sm" mask="00,00" :raw="false" :options="options" v-model="item.desc3"></vue-mask>
                            </div>
                          </div>
                          <div class="row mb-3">
                            <div class="input-group input-group-sm">
                              <span class="input-group-text param-comercial ps-4">4º Desc. (%)</span>
                              <vue-mask class="form-control form-control-sm sm" mask="00,00" :raw="false" :options="options" v-model="item.desc4"></vue-mask>
                            </div>
                          </div>
                          <div class="row mb-3">
                            <div class="input-group input-group-sm">
                              <span class="input-group-text param-comercial ps-4">5º Desc. (%)</span>
                              <vue-mask class="form-control form-control-sm sm" mask="00,00" :raw="false" :options="options" v-model="item.desc5"></vue-mask>
                            </div>
                          </div>
                          <div class="row mb-3">
                            <div class="input-group input-group-sm">
                              <span class="input-group-text param-comercial param-guelta">Guelta (%)</span>
                              <vue-mask class="form-control form-control-sm sm" mask="00,00" :raw="false" :options="options" v-model="item.guelta"></vue-mask>
                            </div>
                          </div>
                          <div class="row mb-3">
                            <div class="input-group input-group-sm">
                              <span class="input-group-text param-comercial param-rt">RT (R$)</span>
                              <vue-mask class="form-control form-control-sm sm" mask="000.000,00" :raw="false" :options="options" v-model="item.rt"></vue-mask>
                            </div>
                          </div>
                          <div class="row mb-3">
                            <div class="input-group input-group-sm">
                              <span class="input-group-text param-comercial ps-3">Comissão (%)</span>
                              <vue-mask class="form-control form-control-sm sm" mask="00,00" :raw="false" :options="options" v-model="item.comiss"></vue-mask>
                            </div>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Confirmar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="fw-normal">
                  <small class="sm">
                    <vue-mask class="form-control form-control-sm sm" :disabled="bloqueado || item.temOrp || item.ipdEnv" mask="000.000,00" :raw="false" :options="options" v-model="item.vlrUnit"></vue-mask>
                  </small>
                </td>
                <td class="fw-normal">
                  <small class="sm vlr-final">
                    {{ item.vlrFinal }}
                  </small>
                </td>

                <td class="d-flex justify-content-around">
                  <label class="btn btn-sm btn-action btn-secondary sm" v-bind:class="{ disabled: (!item.seqIpd || !item.ipdEnv) }" data-bs-toggle="tooltip" data-bs-placement="top" title="Upload de anexo(s)">
                    <font-awesome-icon icon="file-upload"/><input type="file" ref="uploadArquivo" style="display: none;" @change="onUploadArquivo(item)"/>
                  </label>
                  <button class="btn btn-sm btn-action btn-secondary sm" :disabled="item.temAnx === 'N'" @click="download(item)" data-bs-toggle="tooltip" data-bs-placement="top" title="Download de anexo(s)">
                    <font-awesome-icon icon="download"/>
                  </button>
                  <button class="btn btn-sm btn-action btn-danger sm" :disabled="bloqueado || item.temOrp || item.ipdEnv" @click="deleteItem(item)" data-bs-toggle="tooltip" data-bs-placement="top" title="Excluir item">
                    <font-awesome-icon icon="trash-alt"/>
                  </button>
                </td>
              </tr>
              <tr v-if="item.MANIPULAR">
                <td colspan="8">
                  <ManipularPedido ref="manipularPedido" :numPed="numPed" :seqIpd="{
                                                                              CODEMP: empresa,
                                                                              NUMPED: numPed,
                                                                              SEQIPD: item.seqIpd,
                                                                              CODPRO: item.codConfig,
                                                                              CODDER: item.codComp,
                                                                              MANIPULAR: false
                                                                            }"/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="row">
          <div class="col">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Total (Kg - Bru. | Líq.)</span>
              <input id="totalKg" class="form-control" type="text" disabled v-model="totalKg">
            </div>
          </div>
          <div class="col-2">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Total (m³)</span>
              <input id="totalM3" class="form-control" type="text" disabled v-model="totalM3">
            </div>
          </div>
          <div class="col-2">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Total (R$)</span>
              <input id="totalValor" class="form-control" type="text" disabled v-model="totalValor">
            </div>
          </div>
          <div class="col-2">
            <div class="input-group input-group-sm">
              <span class="input-group-text">IPI (R$)</span>
              <input id="ipiValor" class="form-control" type="text" disabled v-model="ipiValor">
            </div>
          </div>
          <div class="col-2">
            <div class="input-group input-group-sm">
              <span class="input-group-text">NF (R$)</span>
              <input id="nfValor" class="form-control" type="text" disabled v-model="nfValor">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <span class="sm fw-bold fst-italic">* O total em peso e cubagem serão carregados ao enviar o pedido à empresa.</span>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <span class="sm fw-bold fst-italic">** Caso o item do pedido já tiver ordem de produção gerada, o mesmo estará desabilitado para edição.</span>
          </div>
        </div>
      </div>

      <!-- Modal Estilos -->
      <div class="modal fade" id="estilosModal" tabindex="-1" aria-labelledby="estilosModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="estilosModalLabel">Busca de Estilos</h5>
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

      <!-- Modal Salvar Itens -->
      <div class="modal fade" id="confirmaSalvarItensModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirma itens</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalSalvarItens"></button>
            </div>
            <div class="modal-body">
              <p>Este processo adiciona os produtos ao pedido, permitindo a manipulação da estrutura. Tem certeza que deseja salvar os itens?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="salvarItens">Sim</button>
              <button type="button" class="btn btn-dismiss" data-bs-dismiss="modal">Não</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue'
import ManipularPedido from './ManipularPedido.vue'
import vueMask from 'vue-jquery-mask'
import axios from 'axios'
import StringMask from 'string-mask'
export default {
  name: 'GerarPedido',
  components: { Navbar, ManipularPedido, vueMask },
  data () {
    return {
      api_url: '',
      token: '',
      clientes: null,
      transportadoras: null,
      fretes: null,
      transacoes: null,
      estilos: null,
      configs: null,
      comps: null,
      condicoesPagto: null,
      clientesFiltrados: null,
      transportadorasFiltradas: null,
      pedidosClienteFiltrados: null,
      pedidosFiltrados: null,
      estilosFiltrados: null,
      configsFiltrados: null,
      compsFiltrados: null,
      condicoesPagtoFiltrados: null,
      transacoesFiltrados: null,
      cliente: '',
      pedidos: null,
      pedidosCliente: null,
      codCondPagamento: '',
      condPagamento: '',
      clientesFiltro: '',
      transportadorasFiltro: '',
      clientesOpcaoFiltro: 'desc',
      pedidosClienteFiltro: '',
      pedidosFiltro: '',
      estilosFiltro: '',
      configsFiltro: '',
      compsFiltro: '',
      condicoesPagtoFiltro: '',
      transacoesFiltro: '',
      nomCli: '',
      email: '',
      telefone: '',
      cnpj: '',
      endereco: '',
      cidadeUF: '',
      inscrEst: '',
      frete: '',
      transacao: '',
      isentoIpi: '',
      codTransportadora: '',
      transportadora: '',
      codRepresentada: '',
      representada: '',
      comissao: '',
      desc1: '',
      desc2: '',
      desc3: '',
      desc4: '',
      desc5: '',
      guelta: '',
      empresa: '',
      observacoesPedido: '',
      empresasCliente: [],
      addingProduct: false,
      itens: [],
      itemSelecionado: null,
      numPed: '',
      pedCli: '',
      pedRep: '',
      enviadoEmpresa: false,
      itemAbe: false,
      bloqueado: false,
      totalKg: '',
      totalM3: 0,
      totalPesLiq: 0,
      totalPesBru: 0,
      totalVolDer: 0,
      totalValor: 0,
      ipiValor: 0,
      nfValor: 0,
      manipulando: false,
      formData: null,
      options: {
        reverse: true
      },
      feira: 'N'
    }
  },
  created () {
    this.api_url = process.env.VUE_APP_API_URL
    this.token = sessionStorage.getItem('token')
  },
  mounted () {
    if (!sessionStorage.getItem('token')) {
      this.$router.push({ name: 'Login' })
    }
    this.excluirRascunho()
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
      this.clientesFiltro = ''
      if (this.clientes === null) {
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnBuscaClientes').disabled = 
        axios.get(this.api_url + '/clientes?token=' + this.token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            this.clientes = response.data.clientes
            this.clientes.forEach(cliente => {
              const formatter = new StringMask('00.000.000/0000-00')
              cliente.CGCCPF = cliente.CGCCPF.replace('.', '').replace('-', '').replace('/', '')
              for (let i = cliente.CGCCPF.length; i < 14; i++) {
                cliente.CGCCPF = '0' + cliente.CGCCPF
              }
              cliente.CNPJ = formatter.apply(cliente.CGCCPF)
            })
            this.clientesFiltrados = response.data.clientes
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaClientes').disabled = false
          })
          .catch((err) => {
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaClientes').disabled = false
            console.log(err)
          })
      }
    },
    buscaTransportadoras () {
      this.transportadorasFiltro = ''
      if (this.transportadoras === null) {
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnBuscaTransportadoras').disabled = true
        axios.get(this.api_url + '/transportadoras?token=' + this.token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            this.transportadoras = response.data.transportadoras
            this.transportadorasFiltradas = response.data.transportadoras
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaTransportadoras').disabled = false
          })
      }
    },
    buscaFretes () {
      if (this.fretes === null) {
        this.fretes = [
          { CIFFOB: 'C', DESFRE: 'Por conta do emitente (PAGO)' },
          { CIFFOB: 'F', DESFRE: 'Por conta do destinatário (A PAGAR)' },
          { CIFFOB: 'T', DESFRE: 'Por conta de terceiros' },
          { CIFFOB: 'X', DESFRE: 'Sem frete' }
        ]
      }
    },
    buscaPedidosCliente () {
      if (this.cliente !== '') {
        this.pedidosCliente = null
        this.pedidosClienteFiltro = ''
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnBuscaPedidosCliente').disabled = true
        axios.get(this.api_url + '/pedidosCliente?cli=' + this.cliente + '&token=' + this.token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            this.pedidosCliente = response.data.pedidos
            this.pedidosClienteFiltrados = response.data.pedidos
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaPedidosCliente').disabled = false
          })
          .catch((err) => {
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaPedidosCliente').disabled = false
            console.log(err)
          })
      }
    },
    buscaPedidos () {
      this.pedidos = null
      this.pedidosFiltro = ''
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      document.getElementById('btnBuscaPedidos').disabled = true
      axios.get(this.api_url + '/pedidos?token=' + this.token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          this.pedidos = response.data.pedidos
          this.pedidosFiltrados = response.data.pedidos
          document.getElementsByTagName('body')[0].style.cursor = 'auto'
          document.getElementById('btnBuscaPedidos').disabled = false
        })
        .catch((err) => {
          document.getElementsByTagName('body')[0].style.cursor = 'auto'
          document.getElementById('btnBuscaPedidos').disabled = false
          console.log(err)
        })
    },
    buscaCondicoesPagto () {
      if (this.empresa !== '') {
        this.condicoesPagto = null
        this.condicoesPagtoFiltro = ''
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnBuscaCondicoesPagto').disabled = true
        axios.get(this.api_url + '/condicoesPagto?emp=' + this.empresa + '&token=' + this.token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            this.condicoesPagto = response.data.condicoes
            this.condicoesPagtoFiltrados = response.data.condicoes
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaCondicoesPagto').disabled = false
          })
          .catch((err) => {
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaCondicoesPagto').disabled = false
            console.log(err)
          })
      }
    },
    buscaTransacoes () {
      if (this.empresa !== '') {
        this.transacoes = null
        this.transacoesFiltro = ''
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnBuscaTransacoes').disabled = true
        axios.get(this.api_url + '/transacoes?emp=' + this.empresa + '&token=' + this.token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            this.transacoes = response.data.transacoes
            this.transacoesFiltrados = response.data.transacoes
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaTransacoes').disabled = false
          })
          .catch((err) => {
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            document.getElementById('btnBuscaTransacoes').disabled = false
            console.log(err)
          })
      }
    },
    buscaEstilos (item) {
      this.itemSelecionado = item
      this.estilos = null
      this.estilosFiltro = ''
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      document.getElementById('btnBuscaEstilos' + item.hash).disabled = true
      document.getElementById('btnBuscaConfigs' + item.hash).disabled = true
      document.getElementById('btnBuscaComps' + item.hash).disabled = true
      axios.get(this.api_url + '/estilos?emp=1&token=' + this.token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          this.estilos = response.data.estilos
          if (item.cnj !== '' && item.cnj !== ' ') {
            this.itens.forEach(ipd => {
              if (ipd.hash !== item.hash && ipd.cnj === item.cnj && ipd.codEstilo) {
                this.estilos = this.estilos.filter(estilo => estilo.CODCPR === ipd.codEstilo)
              }
            })
          }
          this.estilosFiltrados = this.estilos
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
        axios.get(this.api_url + '/produtosPorEstilo?emp=1&estilo=' + estilo + '&token=' + this.token)
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
        axios.get(this.api_url + '/derivacoesPorProduto?emp=1&produto=' + config + '&token=' + this.token)
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
      this.empresasCliente = []
      this.empresasCliente.splice(0)
      while (this.empresasCliente.length > 0) {
        this.empresasCliente.pop()
      }
      this.empresasCliente.length = 0
      this.transacao = '90100'
      this.isentoIpi = 'N'
      document.getElementById('closeModalClientes').click()
      this.buscarDadosCliente(this.cliente, false)
    },
    selectTransportadora (transportadoraClicked) {
      this.codTransportadora = transportadoraClicked.CODTRA
      this.transportadora = transportadoraClicked.NOMTRA
      document.getElementById('closeModalTransportadoras').click()
    },
    selectFrete (freteClicked) {
      this.frete = freteClicked.CIFFOB
      document.getElementById('closeModalFretes').click()
    },
    selectTransacao (transClicked) {
      this.transacao = transClicked.CODTNS
      this.isentoIpi = transClicked.VENIPI
      document.getElementById('closeModalTransacoes').click()
    },
    selectPedidoCliente (pedidoClienteClicked) {
      this.numPed = pedidoClienteClicked.NUMPED
      this.pedCli = pedidoClienteClicked.PEDCLI
      this.empresa = pedidoClienteClicked.CODEMP
      this.carregarCabecalho()
      this.carregarItens()
      document.getElementById('closeModalPedidosCliente').click()
    },
    selectPedido (pedidoClicked) {
      const formatter = new StringMask('99.999.999/0000-00')
      this.numPed = pedidoClicked.NUMPED
      this.pedCli = pedidoClicked.PEDCLI
      this.pedRep = pedidoClicked.PEDREP
      this.empresa = pedidoClicked.CODEMP
      this.cliente = pedidoClicked.CODCLI
      this.nomCli = pedidoClicked.NOMCLI
      this.email = pedidoClicked.INTNET
      this.telefone = pedidoClicked.FONCLI
      this.cnpj = formatter.apply(pedidoClicked.CGCCPF)
      this.endereco = pedidoClicked.ENDCPL
      this.cidadeUF = pedidoClicked.CIDEST
      this.inscrEst = pedidoClicked.INSEST
      this.transportadora = pedidoClicked.NOMTRA
      this.representada = pedidoClicked.NOMREP
      this.transacao = pedidoClicked.CODTNS
      this.isentoIpi = pedidoClicked.VENIPI
      this.buscarDadosCliente(this.cliente, true)
      this.carregarCabecalho()
      this.carregarItens()
      document.getElementById('closeModalPedidos').click()
    },
    selectCondicaoPagto (condicaoClicked) {
      this.codCondPagamento = condicaoClicked.CODCPG
      this.condPagamento = condicaoClicked.DESCPG
      document.getElementById('closeModalCondicoesPagto').click()
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
      this.itemSelecionado.medMin = parseInt(Number(configClicked.MEDMIN) * 100)
      this.itemSelecionado.medMax = parseInt(Number(configClicked.MEDMAX) * 100)
      document.getElementById('closeModalConfigs').click()
      document.getElementById('btnBuscaComps' + this.itemSelecionado.hash).disabled = false
      this.itemSelecionado.comp = ''
      this.itemSelecionado.codComp = ''
      this.buscarDerivacoes(configClicked.CODPRO)
        .then((response) => {
          this.itemSelecionado.derivacoesPossiveis = response.data.derivacoes
          this.itemSelecionado = null
        })
    },
    selectComp (compClicked) {
      this.itemSelecionado.comp = compClicked.CODDER
      this.itemSelecionado.codComp = compClicked.CODDER
      document.getElementById('closeModalComps').click()
      this.itemSelecionado = null
    },
    buscarDadosCliente (codCli, apenasEmpresas) {
      axios.get(this.api_url + '/dadosCliente?token=' + this.token + '&codCli=' + codCli)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          this.dadosCliente = response.data.dadosCliente
          if (this.dadosCliente.length > 0) {
            this.frete = this.dadosCliente[0].CIFFOB
            this.desc1 = Number(this.dadosCliente[0].PERDS1).toFixed(2).toLocaleString()
            this.desc2 = Number(this.dadosCliente[0].PERDS2).toFixed(2).toLocaleString()
            this.desc3 = Number(this.dadosCliente[0].PERDS3).toFixed(2).toLocaleString()
            this.desc4 = Number(this.dadosCliente[0].PERDS4).toFixed(2).toLocaleString()
            this.desc5 = Number(this.dadosCliente[0].PERDS5).toFixed(2).toLocaleString()
            this.guelta = Number(this.dadosCliente[0].PERGUE).toFixed(2).toLocaleString()
            this.comissao = Number(this.dadosCliente[0].PERCOM).toFixed(2).toLocaleString()
            this.codCondPagamento = this.dadosCliente[0].CODCPG
            this.condPagamento = this.dadosCliente[0].DESCPG
            if (!apenasEmpresas) {
              this.codTransportadora = this.dadosCliente[0].CODTRA
              this.transportadora = this.dadosCliente[0].NOMTRA
              this.codRepresentada = this.dadosCliente[0].CODREP
              this.representada = this.dadosCliente[0].NOMREP
            }
            this.dadosCliente.forEach(empresa => {
              this.empresasCliente.push({
                CODEMP: empresa.CODEMP, NOMEMP: empresa.NOMEMP
              })
            })

            axios.get(this.api_url + '/pedidosCliente?cli=' + this.cliente + '&token=' + this.token)
              .then((response) => {
                this.checkInvalidLoginResponse(response.data)
                this.pedidosCliente = response.data.pedidos
              })
              .catch((err) => {
                console.log(err)
              })
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
        comp: '',
        un: '',
        desc: 0,
        desc1: this.desc1,
        desc2: this.desc2,
        desc3: this.desc3,
        desc4: this.desc4,
        desc5: this.desc5,
        guelta: this.guelta,
        rt: Number(0).toFixed(2).toLocaleString(),
        comiss: this.comissao,
        tnsPro: this.transacao,
        isentoIpi: this.isentoIpi,
        cMed: false,
        cDes: false,
        cCon: false,
        cPra: false,
        cOut: false,
        obs: '',
        vlrUnit: '',
        vlrFinal: '',
        temAnx: 'N',
        ipdEnv: false,
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
        alert('Favor preencher o Cliente!')
      } else if (this.empresa === '') {
        alert('Favor escolher uma empresa!')
      } else if (this.condPagamento === '') {
        alert('Favor selecionar uma Condição de Pagamento!')
      } else {
        this.enviarRequestPedido()
      }
    },
    enviarRequestPedido () {
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      var parseString = require('xml2js').parseString
      var respostaPedido = null
      const body = JSON.stringify(
        {
          pedido: {
            codEmp: this.empresa,
            codFil: 1,
            numPed: this.numPed > 0 ? this.numPed : 0,
            codCli: this.cliente,
            pedCli: this.pedCli !== '' ? this.pedCli : ' ',
            pedRep: this.pedRep !== '' ? this.pedRep : ' ',
            codRep: this.codRepresentada,
            codTra: this.codTransportadora,
            cifFob: this.frete,
            obsPed: this.observacoesPedido,
            codCpg: this.codCondPagamento,
            tnsPro: this.transacao,
            pedFei: this.feira === 'S' ? 'S' : 'N'
          },
          itens: []
        }
      )
      const headers = { headers: { 'Content-Type': 'application/json' } }
      axios.put(this.api_url + '/pedido?token=' + this.token, body, headers)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          parseString(response.data, { explicitArray: false }, (err, result) => {
            if (err) {
              console.log(err)
            }
            respostaPedido = result['S:Envelope']['S:Body']['ns2:GravarPedidos_13Response'].result.respostaPedido
            if (parseInt(respostaPedido.numPed) === 0) {
              alert(respostaPedido.retorno)
            } else {
              this.numPed = respostaPedido.numPed
              alert('Pedido ' + this.numPed + ' gerado/atualizado com sucesso!')
              this.carregarItens()
            }
          })
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          document.getElementsByTagName('body')[0].style.cursor = 'auto'
        })
    },
    filtrarClientes () {
      if (this.clientesOpcaoFiltro === 'desc') {
        this.clientesFiltrados = this.clientes.filter(cliente => cliente.NOMCLI.toUpperCase().startsWith(this.clientesFiltro.toUpperCase()))
      } else {
        this.clientesFiltrados = this.clientes.filter(cliente => cliente.CNPJ.replace('.', '').replace('-', '').replace('/', '').toUpperCase()
          .startsWith(this.clientesFiltro.replace('.', '').replace('-', '').replace('/', '').toUpperCase()))
      }
    },
    filtrarPedidosCliente () {
      this.pedidosClienteFiltrados = this.pedidosCliente.filter(pedido => pedido.PEDCLI.toUpperCase().startsWith(this.pedidosClienteFiltro.toUpperCase()))
    },
    filtrarTransportadoras () {
      this.transportadorasFiltradas = this.transportadoras.filter(transp => transp.NOMTRA.toUpperCase().startsWith(this.transportadorasFiltro.toUpperCase()))
    },
    filtrarPedidos () {
      this.pedidosFiltrados = this.pedidos.filter(pedido => pedido.NUMPED.toUpperCase().startsWith(this.pedidosFiltro.toUpperCase()))
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
    filtrarCondicoesPagto () {
      this.condicoesPagtoFiltrados = this.condicoesPagto.filter(cond => cond.DESCPG.toUpperCase().startsWith(this.condicoesPagtoFiltro.toUpperCase()))
    },
    filtrarTransacoes () {
      this.transacoesFiltrados = this.transacoes.filter(trans => trans.CODTNS.toUpperCase().startsWith(this.transacoesFiltro.toUpperCase()))
    },
    normalizarPedidoCliente () {
      this.pedCli = this.pedCli.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    },
    normalizarPedidoRepresentante () {
      this.pedRep = this.pedRep.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
      this.empresasCliente.splice(0)
      while (this.empresasCliente.length > 0) {
        this.empresasCliente.pop()
      }
      this.empresasCliente.length = 0
      this.numPed = ''
      this.itens = []
      this.itens.splice(0)
      while (this.itens.length > 0) {
        this.itens.pop()
      }
      this.itens.length = 0
      this.pedCli = ''
      this.pedRep = ''
      this.enviadoEmpresa = false
      this.itemAbe = false
      this.bloqueado = false
      this.prevFaturamento = ''
      this.condPagamento = ''
      this.comissao = ''
      this.desc1 = ''
      this.desc2 = ''
      this.desc3 = ''
      this.desc4 = ''
      this.desc5 = ''
      this.guelta = ''
      this.transacao = ''
      this.isentoIpi = ''
      this.manipulando = false
      this.observacoesPedido = ''
      this.totalKg = ''
      this.totalM3 = 0
      this.totalValor = 0
      this.ipiValor = 0
      this.nfValor = 0
      this.feira = 'N'
    },
    salvarItens () {
      document.getElementById('closeModalSalvarItens').click()
      let temErro = false
      let BreakException
      try {
        this.itens.forEach(item => {
          if (item.un === '' || item.un < 1 || item.un > 99) {
            alert('Erro: Existe(m) produto(s) com quantidade sem preencher, ou menor que zero, ou maior que 99. Verifique!')
            temErro = true
          }
          if (!item.codEstilo || !item.codConfig || (!item.cMed && !item.codComp)) {
            alert('Erro: Existe(m) produto(s) faltando definir estilo, configuração ou comprimento. Verifique!')
            temErro = true
          }
          if (item.cnj !== '' && item.cnj !== ' ' && item.cnj < 1) {
            alert('Erro: Existe(m) produto(s) com número de conjunto menor que 1. Verifique!')
            temErro = true
          }
          if ((item.cDes || item.cCon || item.cPra || item.cOut === 'O') && (!item.obs)) {
            alert('Erro: Existe(m) produto(s) com condição especial que requer preenchimento de observação. Verifique!')
            temErro = true
          }
          if (item.desc === '') {
            alert('Erro: Existe(m) produto(s) com desconto em branco. Verifique!')
            temErro = true
          }
          if (Number(item.vlrUnit) === 0 || item.vlrUnit === '') {
            alert('Erro: Existe(m) produto(s) com valor unitário zerado. Verifique!')
            temErro = true
          }
          if (item.cMed) {
            if (!item.comp) {
              alert('Erro: Existe(m) produto(s) com medida especial sem o comprimento preenchido. Verifique!')
              temErro = true
            } else if ((Number(item.comp) < Number(item.medMin)) || (Number(item.comp) > Number(item.medMax))) {
              alert('Aviso: O produto "' + item.config + '" está com medida especial fora do mínimo (' + item.medMin + ' cm) e máximo (' + item.medMax + ' cm), mas será incluído no pedido normalmente.')
            } else {
              let compMaisProximo = ''
              let menorDistancia = 1000000
              compMaisProximo = item.derivacoesPossiveis[0].CODDER
              let achou = false
              item.derivacoesPossiveis.forEach(comp => {
                if (Number(comp.CODDER) === Number(item.comp)) {
                  compMaisProximo = comp.CODDER
                  achou = true
                }
              })

              if (!achou) {
                item.derivacoesPossiveis.forEach(comp => {
                  if (comp.CODDER !== compMaisProximo) {
                    let distancia = Number(comp.CODDER) - Number(item.comp)
                    if (distancia < 0) distancia *= -1
                    if (distancia <= menorDistancia) {
                      menorDistancia = distancia
                      compMaisProximo = comp.CODDER
                    }
                  }
                })
              }
              item.codComp = compMaisProximo
            }
          }
          if (temErro) {
            throw BreakException
          }
        })
      } catch (e) {
        if (e !== BreakException) throw e
      }
      if (!temErro) {
        this.enviarItens()
      }
    },
    enviarItens () {
      const itensPedido = []
      const itensChecarCnj = [...this.itens]
      itensChecarCnj.sort(this.compare)
      let cnjIni = itensChecarCnj[0].cnj
      let estiloIni = itensChecarCnj[0].codEstilo
      let temErro = false
      itensChecarCnj.forEach(item => {
        if (item.cnj !== '' && item.cnj !== ' ' && item.cnj === cnjIni && item.codEstilo !== estiloIni) {
          alert('Erro: Existe(m) produto(s) com o mesmo número do conjunto (conj. ' + item.cnj + ') mas com estilos diferentes. Verifique!')
          temErro = true
        }
        if (item.cnj !== '' && item.cnj !== cnjIni) {
          cnjIni = item.cnj
          estiloIni = item.codEstilo
        }
      })
      if (!temErro) {
        // var hoje45 = new Date()
        // var datEnt45 = hoje45.setDate(hoje45.getDate() + 75)
        // var dia45 = new Date(datEnt45).getDate().toString().padStart(2, '0')
        // var mes45 = (new Date(datEnt45).getMonth() + 1).toString().padStart(2, '0') // +1 pois no getMonth Janeiro começa com zero.
        // var ano45 = new Date(datEnt45).getFullYear()
        // var datEntFmt45 = dia45 + '/' + mes45 + '/' + ano45
        // var hoje60 = new Date()
        // var datEnt60 = hoje60.setDate(hoje60.getDate() + 60)
        // var dia60 = new Date(datEnt60).getDate().toString().padStart(2, '0')
        // var mes60 = (new Date(datEnt60).getMonth() + 1).toString().padStart(2, '0') // +1 pois no getMonth Janeiro começa com zero.
        // var ano60 = new Date(datEnt60).getFullYear()
        // var datEntFmt60 = dia60 + '/' + mes60 + '/' + ano60
        var hoje = new Date()
        var diaHoje = new Date(hoje).getDate().toString().padStart(2, '0')
        var mesHoje = (new Date(hoje).getMonth() + 1).toString().padStart(2, '0') // +1 pois no getMonth Janeiro começa com zero.
        var anoHoje = new Date(hoje).getFullYear()
        var datEntFmtHoje = diaHoje + '/' + mesHoje + '/' + anoHoje
        itensPedido.splice(0)
        while (itensPedido.length > 0) {
          itensPedido.pop()
        }
        itensPedido.length = 0
        this.itens.forEach(item => {
          itensPedido.push(
            {
              numCnj: item.cnj === '' ? ' ' : item.cnj,
              codPro: item.codConfig,
              desPro: (item.config + ' ' + item.comp),
              codDer: item.codComp,
              derEsp: item.cMed ? item.comp : '',
              seqIpd: item.seqIpd ? Number(item.seqIpd) : 0,
              qtdPed: item.un,
              preUni: Number(item.vlrUnit.replace('.', '').replace(',', '')) / 100,
              perDs1: Number(item.desc1.toString().replace(',', '.')),
              perDs2: Number(item.desc2.toString().replace(',', '.')),
              perDs3: Number(item.desc3.toString().replace(',', '.')),
              perDs4: Number(item.desc4.toString().replace(',', '.')),
              perDs5: Number(item.desc5.toString().replace(',', '.')),
              perGue: Number(item.guelta.toString().replace(',', '.')),
              vlrRet: Number(item.rt.replace('.', '').replace(',', '')) / 100,
              perCom: Number(item.comiss.toString().replace(',', '.')),
              // datEnt: (item.cMed === true || item.cOut === true) ? datEntFmt60 : datEntFmt45,
              datEnt: datEntFmtHoje,
              medEsp: item.cMed === true ? 'S' : 'N',
              desEsp: item.cDes === true ? 'S' : 'N',
              conEsp: item.cCon === true ? 'S' : 'N',
              praEsp: item.cPra === true ? 'S' : 'N',
              outEsp: item.cOut === true ? 'S' : 'N',
              obsIpd: item.obs,
              tnsPro: item.tnsPro
            }
          )
        })
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnSalvarItens').disabled = true
        var parseString = require('xml2js').parseString
        var respostaPedido = null
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
        axios.post(this.api_url + '/pedido/itens?token=' + this.token, body, headers)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            if (response.data.includes('<erroExecucao>')) {
              const index1 = response.data.indexOf("<erroExecucao>");
              const index2 = response.data.indexOf("</erroExecucao>");

              alert('Ocorreu um erro: ' + response.data.substring((index1 + 14), index2))
            } else {
              parseString(response.data, { explicitArray: false }, (err, result) => {
                if (err) {
                  console.log(err)
                }
                respostaPedido = result['S:Envelope']['S:Body']['ns2:GravarPedidos_13Response'].result.respostaPedido
                if (respostaPedido.retorno === 'OK') {
                  alert('Itens salvos com sucesso!')
                  this.manipulando = false
                  this.carregarCabecalho()
                  this.carregarItens()
                // } else if (respostaPedido.gridPro.retorno.length) {
                //   alert(respostaPedido.gridPro.retorno)
                } else {
                  alert(respostaPedido.retorno)
                }
              })
            }
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
    buscarDerivacoes (config) {
      return axios.get(this.api_url + '/derivacoesPorProduto?emp=1&produto=' + config + '&token=' + this.token)
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
    carregarCabecalho () {
      axios.get(this.api_url + '/pedido?emp=' + this.empresa + '&fil=1&ped=' + this.numPed + '&token=' + this.token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data.pedido)
          this.prevFaturamento = response.data.pedido[0].DATENT
          this.condPagamento = response.data.pedido[0].DESCPG
          this.frete = response.data.pedido[0].CIFFOB
          this.codTransportadora = response.data.pedido[0].CODTRA
          this.codRepresentada = response.data.pedido[0].CODREP
          this.enviadoEmpresa = (response.data.pedido[0].PEDENV === 'S')
          this.itemAbe = (response.data.pedido[0].PEDABE === 'S')
          this.bloqeado = (response.data.pedido[0].SITPED === '4' || response.data.pedido[0].SITPED === '5')
          this.observacoesPedido = response.data.pedido[0].OBSPED
          this.transacao = response.data.pedido[0].TNSPRO
          this.isentoIpi = response.data.pedido[0].VENIPI
          this.feira = response.data.pedido[0].PEDFEI === 'S' ? 'S' : 'N'
        })
        .catch((err) => {
          console.log(err)
        })
    },
    carregarItens () {
      this.itens = []
      this.itens.splice(0)
      while (this.itens.length > 0) {
        this.itens.pop()
      }
      this.itens.length = 0
      this.totalKg = parseFloat(0)
      this.totalM3 = parseFloat(0)
      this.totalValor = parseFloat(0)
      this.ipiValor = parseFloat(0)
      this.nfValor = parseFloat(0)
      axios.get(this.api_url + '/itensPedido?emp=' + this.empresa + '&fil=1&ped=' + this.numPed + '&token=' + this.token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          response.data.itens.forEach(item => {
            this.buscarDerivacoes(item.CODPRO)
              .then((response) => {
                const derivacoesPossiveis = response.data.derivacoes
                this.itemSelecionado = null
                this.itens.push(
                  {
                    MANIPULAR: false,
                    seqIpd: item.SEQIPD,
                    cnj: item.SEQPCL === 'null' ? '' : item.SEQPCL,
                    codEstilo: item.CODCPR,
                    estilo: item.DESCPR,
                    codConfig: item.CODPRO,
                    config: item.DESPRO,
                    codComp: item.CODDER,
                    comp: item.CMED === 'S' ? item.LARDER : item.CODDER,
                    un: item.QTDPED,
                    medMin: parseInt(Number(item.MEDMIN) * 100),
                    medMax: parseInt(Number(item.MEDMAX) * 100),
                    desc: Number(item.PERDSC).toFixed(2).toLocaleString(),
                    desc1: Number(item.PERDS1).toFixed(2).toLocaleString(),
                    desc2: Number(item.PERDS2).toFixed(2).toLocaleString(),
                    desc3: Number(item.PERDS3).toFixed(2).toLocaleString(),
                    desc4: Number(item.PERDS4).toFixed(2).toLocaleString(),
                    desc5: Number(item.PERDS5).toFixed(2).toLocaleString(),
                    guelta: Number(item.PERGUE).toFixed(2).toLocaleString(),
                    rt: Number(item.VLRRET).toFixed(2).toLocaleString(),
                    comiss: Number(item.PERCOM).toFixed(2).toLocaleString(),
                    // eslint-disable-next-line no-unneeded-ternary
                    cMed: item.CMED === 'S' ? true : false,
                    // eslint-disable-next-line no-unneeded-ternary
                    cDes: item.CDES === 'S' ? true : false,
                    // eslint-disable-next-line no-unneeded-ternary
                    cCon: item.CCON === 'S' ? true : false,
                    // eslint-disable-next-line no-unneeded-ternary
                    cPra: item.CPRA === 'S' ? true : false,
                    // eslint-disable-next-line no-unneeded-ternary
                    cOut: item.COUT === 'S' ? true : false,
                    datEnt: item.DATENT,
                    obs: item.OBSIPD,
                    vlrUnit: Number(item.VLRIPD).toFixed(2).toLocaleString(),
                    vlrFinal: Number(Number(item.QTDPED) * Number(item.VLRIPD) *
                      (Number(item.PERDS1) > 0 ? ((100 - Number(item.PERDS1)) / 100) : 1) *
                      (Number(item.PERDS2) > 0 ? ((100 - Number(item.PERDS2)) / 100) : 1) *
                      (Number(item.PERDS3) > 0 ? ((100 - Number(item.PERDS3)) / 100) : 1) *
                      (Number(item.PERDS4) > 0 ? ((100 - Number(item.PERDS4)) / 100) : 1) *
                      (Number(item.PERDS5) > 0 ? ((100 - Number(item.PERDS5)) / 100) : 1)).toFixed(2).toLocaleString(),
                    temAnx: item.TEMANX,
                    hash: Math.floor(Math.random() * ((this.itens.length + 1) * 1000)),
                    derivacoesPossiveis: derivacoesPossiveis,
                    tnsPro: item.TNSPRO,
                    isentoIpi: item.VENIPI,
                    temOrp: item.TEMORP === 'S' ? true : false,
                    sitIpd: item.SITIPD,
                    ipdEnv: item.IPDENV === 'S' ? true : false
                  }
                )
                this.itens.sort(this.compareSeqIpd)
                this.totalPesLiq = parseFloat(parseFloat(this.totalPesLiq) + parseFloat(item.PESLIQ)).toFixed(2)
                this.totalPesBru = parseFloat(parseFloat(this.totalPesBru) + parseFloat(item.PESBRU)).toFixed(2)
                this.totalVolDer = parseFloat(parseFloat(this.totalVolDer) + parseFloat(item.VOLDER)).toFixed(2)
                this.totalKg = this.totalPesLiq + ' | ' + this.totalPesBru
                this.totalM3 = this.totalVolDer
                this.totalValor = parseFloat(parseFloat(this.totalValor) + parseFloat(parseInt(item.QTDPED) * parseFloat(
                  Number(Number(item.VLRIPD) *
                  (Number(item.PERDS1) > 0 ? ((100 - Number(item.PERDS1)) / 100) : 1) *
                  (Number(item.PERDS2) > 0 ? ((100 - Number(item.PERDS2)) / 100) : 1) *
                  (Number(item.PERDS3) > 0 ? ((100 - Number(item.PERDS3)) / 100) : 1) *
                  (Number(item.PERDS4) > 0 ? ((100 - Number(item.PERDS4)) / 100) : 1) *
                  (Number(item.PERDS5) > 0 ? ((100 - Number(item.PERDS5)) / 100) : 1))
                ))).toFixed(2)
                this.ipiValor = parseFloat(parseFloat(this.ipiValor) + parseFloat(item.IPIIPD)).toFixed(2)
                this.nfValor = parseFloat(parseFloat(this.totalValor) + parseFloat(this.ipiValor)).toFixed(2)
              })
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    compareSeqIpd (a, b) {
      if (Number(a.seqIpd) < Number(b.seqIpd)) {
        return -1
      }
      if (Number(a.seqIpd) > Number(b.seqIpd)) {
        return 1
      }
      return 0
    },
    enviarEmpresa () {
      document.getElementById('closeModalEnviarEmpresa').click()
      if (!this.itens.length) {
        alert('O pedido não possui itens. Verifique!')
      } else {
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        axios.post(this.api_url + '/enviarPedido?emp=' + this.empresa + '&fil=1&ped=' + this.numPed + '&token=' + this.token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            if (response.data.pesoTotalBruto) {
              alert('Pedido enviado à empresa com sucesso!')
              this.enviadoEmpresa = true
              this.itemAbe = false
              this.totalKg = parseFloat(response.data.pesoTotalBruto).toFixed(2) + ' | ' + parseFloat(response.data.pesoTotalLiq).toFixed(2)
              this.totalM3 = parseFloat(response.data.volumeTotal).toFixed(2)
              this.itens.forEach(ipd => {
                ipd.ipdEnv = true
              })
            } else {
              alert(response.data)
            }
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
          })
          .catch((err) => {
            document.getElementsByTagName('body')[0].style.cursor = 'auto'
            console.log(err)
          })
      }
    },
    setManipular (item) {
      item.MANIPULAR = !item.MANIPULAR

      this.manipulando = false
      this.itens.forEach(item => {
        if (item.MANIPULAR) {
          this.manipulando = true
        }
      })
    },
    onUploadArquivo (item) {
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      // const file = this.$refs.uploadArquivo.files[0]
      const file = event.target.files[0]
      this.formData = new FormData()
      this.formData.append('file', file)
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
      axios.post(this.api_url + '/uploadArquivo?emp=' + this.empresa + '&fil=1&ped=' + this.numPed + '&ipd=' + item.seqIpd + '&token=' + this.token, this.formData, { headers: headers })
        .then((response) => {
          if (response.data === 'OK') {
            item.temAnx = 'S'
            alert('Arquivo enviado com sucesso!')
          } else {
            alert(response.data)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          document.getElementsByTagName('body')[0].style.cursor = 'auto'
        })
    },
    download (item) {
      document.getElementsByTagName('body')[0].style.cursor = 'wait'
      axios.get(this.api_url + '/downloadArquivo?emp=' + this.empresa + '&fil=1&ped=' + this.numPed + '&ipd=' + item.seqIpd + '&token=' + this.token)
      axios({
        url: this.api_url + '/downloadArquivo?emp=' + this.empresa + '&fil=1&ped=' + this.numPed + '&ipd=' + item.seqIpd + '&token=' + this.token, // your url
        method: 'GET',
        responseType: 'blob'
      })
        .then((response) => {
          if (response.status === 204) {
            alert('Nenhum arquivo disponível para download.')
          } else {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', this.numPed + '-' + item.seqIpd + '.zip')
            document.body.appendChild(link)
            link.click()
          }
        })
        .finally(() => {
          document.getElementsByTagName('body')[0].style.cursor = 'auto'
        })
    },
    checkMedida (item) {
      if (document.getElementById('cbMedida' + item.hash).checked) {
        alert('Informe o novo comprimento, em centímetros, para o produto. Produtos de medida especial tem acréscimo no valor de tabela.')
        document.getElementById('cbOutras' + item.hash).checked = false
        this.buscarDerivacoes(item.codConfig)
          .then(response => {
            item.derivacoesPossiveis = response.data.derivacoes
          })
      }
    },
    // checkDesconto (item) {
    //   if (document.getElementById('cbDesconto' + item.hash).checked) {
    //     alert('Descreva o critério e desconto aplicado para a condição especial nas observações do item.')
    //   }
    // },
    // checkCondicao (item) {
    //   if (document.getElementById('cbCondicao' + item.hash).checked) {
    //     alert('Descreva o critério e a condição de pagamento aplicado para a condição especial nas observações do item.')
    //   }
    // },
    // checkPrazo (item) {
    //   if (document.getElementById('cbPrazo' + item.hash).checked) {
    //     alert('Em dias corridos, descreva o prazo especial desejado nas observações do item.')
    //   }
    // },
    checkOutras (item) {
      if (document.getElementById('cbOutras' + item.hash).checked) {
        if (document.getElementById('cbMedida' + item.hash).checked) {
          alert('Descreva a condição especial nas observações do item, e selecione novamente o comprimento do produto, pois a opção de Medida Especial estava selecionada.')
          document.getElementById('cbMedida' + item.hash).checked = false
          item.comp = ''
          item.codComp = ''
        } else {
          alert('Descreva a condição especial nas observações do item.')
        }
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
  .btn-action {
    width: 2rem;
    margin-left: 1px;
    margin-right: 1px;
  }
  .btn-busca {
    width: 1.75rem !important;
  }
  .sm {
    font-size: 0.8rem !important;
  }
  .sm-header {
    font-size: 0.9rem !important;
  }
  .modal:nth-of-type(even) {
    z-index: 1062 !important;
  }
  .modal-backdrop.show:nth-of-type(even) {
    z-index: 1061 !important;
  }
  .white-bg {
    background-color: white !important;
  }
  .param-comercial {
    width: 7rem;
  }
  .param-guelta {
    padding-left: 2.2rem !important;
  }
  .param-rt {
    padding-left: 3.3rem !important;
  }
  .vlr-final {
    position: absolute;
    padding-top: 6px;
  }
</style>
