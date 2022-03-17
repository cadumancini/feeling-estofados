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
            <button class="btn btn-sm btn-secondary ms-2" :disabled="numPed == '' || (numPed != '' && enviadoEmpresa)" data-bs-toggle="modal" data-bs-target="#confirmaEnviarEmpresaModal">Enviar à empresa</button>
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
          <div class="col-6">
            <span class="fw-bold fs-5">Dados Gerais</span>
            <span v-if="enviadoEmpresa" class="ms-3 fs-6 fst-italic text-danger">O pedido encontra-se bloqueado para alteração.</span>
          </div>
          <div class="col-6">
            <div class="float-end">
              <button id="btnSalvar" class="btn btn-secondary btn-sm" :disabled="numPed !== ''" data-bs-toggle="modal" data-bs-target="#confirmaPedidoModal">Salvar</button>
            </div>
          </div>
        </div>
        <div v-if="!manipulando">
          <div class="row mb-3">
            <div class="col-3">
              <div class="input-group input-group-sm">
                <span class="input-group-text">Nº Pedido</span>
                <input id="numPed" class="form-control" type="text" disabled v-model="numPed">
                <button id="btnBuscaPedidos" class="btn btn-secondary input-group-btn" @click="buscaPedidos" data-bs-toggle="modal" data-bs-target="#pedidosModal">...</button>
              </div>
            </div>
            <div class="col-3">
              <div class="input-group input-group-sm">
                <span class="input-group-text">Transportadora</span>
                <input id="transportadora" class="form-control" type="text" disabled v-model="transportadora">
                <button id="btnBuscaTransportadoras" :disabled="numPed !== '' || cliente === ''" class="btn btn-secondary input-group-btn" @click="buscaTransportadoras" data-bs-toggle="modal" data-bs-target="#transportadorasModal">...</button>
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
                <input id="pedCli" class="form-control" :disabled="numPed !== ''" type="text" v-model="pedCli" v-on:keyup="normalizarPedidoCliente">
                <button id="btnBuscaPedidosCliente" :disabled="numPed !== ''" class="btn btn-secondary input-group-btn" @click="buscaPedidosCliente" data-bs-toggle="modal" data-bs-target="#pedidosClienteModal">...</button>
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
                <!-- <input class="form-control" type="text" disabled v-model="condPagamento"> -->
                <input class="form-control" type="text" disabled v-bind:class="{ 'white-bg': (!numPed) }" v-model="condPagamento" placeholder="Clique ao lado para selecionar">
                <button id="btnBuscaCondicoesPagto" :disabled="numPed !== ''" class="btn btn-secondary input-group-btn" @click="buscaCondicoesPagto" data-bs-toggle="modal" data-bs-target="#condicoesPagtoModal">...</button>
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-3">
              <div class="input-group input-group-sm">
                <span class="input-group-text">Cliente</span>
                <input id="nomCli" class="form-control" type="text" disabled v-bind:class="{ 'white-bg': (!numPed) }" v-model="nomCli" placeholder="Clique ao lado para selecionar">
                <button id="btnBuscaClientes" class="btn btn-secondary input-group-btn" :disabled="numPed !== ''" @click="buscaClientes" data-bs-toggle="modal" data-bs-target="#clientesModal">...</button>
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
          <div class="row">
            <div class="col-12">
              <div class="input-group input-group-sm">
                <span class="input-group-text">Observações</span>
                <input id="observacoesPedido" class="form-control" :disabled="numPed !== ''"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                maxlength="200" type="text" v-model="observacoesPedido">
              </div>
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
              <button class="btn btn-secondary btn-sm" :disabled="enviadoEmpresa" @click="addItemVazio">Adicionar item</button>
              <button id="btnSalvarItens" class="btn btn-secondary btn-sm ms-2" :disabled="enviadoEmpresa" data-bs-toggle="modal" data-bs-target="#confirmaSalvarItensModal">Salvar itens</button>
            </div>
          </div>
        </div>
        <div class="row mx-0">
          <table class="table table-striped table-bordered table-sm table-responsive">
            <thead>
              <tr class="table-dark">
                <th class="fw-normal sm-header" style="width: 2%;"><small><font-awesome-icon icon="edit"/></small></th>
                <th class="fw-normal sm-header" style="width: 4%;"><small>Cnj.</small></th>
                <th class="fw-normal sm-header" style="width: 14%;"><small>Estilo</small></th>
                <th class="fw-normal sm-header" style="width: 18%;"><small>Configuração</small></th>
                <th class="fw-normal sm-header" style="width: 9%;"><small>Comp. (cm)</small></th>
                <th class="fw-normal sm-header" style="width: 4%"><small>UN</small></th>
                <th class="fw-normal sm-header" style="width: 4%;"><small>Desc. (%)</small></th>
                <th class="fw-normal sm-header" style="width: 5%;"><small>Comiss. (%)</small></th>
                <th class="fw-normal sm-header" style="width: 14%;"><small>Cond. Especial</small></th>
                <th class="fw-normal sm-header" style="width: 17%;"><small>Observações</small></th>
                <th class="fw-normal sm-header" style="width: 7%;"><small>Vlr. Unit. (R$)</small></th>
                <th class="fw-normal sm-header" style="width: 4%;"><small>Ação</small></th>
              </tr>
            </thead>
            <tbody v-for="item in itens" :key="item.codPro">
              <tr>
                <td class="fw-normal">
                  <button class="btn btn-sm btn-secondary sm" @click="setManipular(item)" :disabled="!item.seqIpd || enviadoEmpresa"><font-awesome-icon icon="edit"/></button>
                </td>
                <td class="fw-normal">
                  <div class="input-group input-group-sm">
                    <input class="form-control sm" :disabled="enviadoEmpresa"
                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                    maxlength="2" type="number" v-model="item.cnj">
                  </div>
                </td>
                <td class="fw-normal">
                  <div class="input-group input-group-sm">
                    <input class="form-control sm" type="text" disabled v-model="item.estilo">
                    <button :id="`btnBuscaEstilos`+item.hash" :disabled="enviadoEmpresa" class="btn btn-secondary input-group-btn sm" @click="buscaEstilos(item)" data-bs-toggle="modal" data-bs-target="#estilosModal">...</button>
                  </div>
                </td>
                <td class="fw-normal">
                  <div class="input-group input-group-sm">
                    <input class="form-control sm" type="text" disabled v-model="item.config">
                    <button :id="`btnBuscaConfigs`+item.hash" disabled class="btn btn-secondary input-group-btn sm" @click="buscaConfigs(item, item.codEstilo)" data-bs-toggle="modal" data-bs-target="#configsModal">...</button>
                  </div>
                </td>
                <td class="fw-normal">
                  <div class="input-group input-group-sm">
                    <input :id="'inputComp'+item.hash" class="form-control sm" type="text" :disabled="item.condEsp !== 'M'" v-model="item.comp">
                    <button :id="`btnBuscaComps`+item.hash" disabled class="btn btn-secondary input-group-btn sm" @click="buscaComps(item, item.codConfig)" data-bs-toggle="modal" data-bs-target="#compsModal">...</button>
                  </div>
                </td>
                <td class="fw-normal"><input class="form-control form-control-sm sm"
                  oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                  maxlength="2" type="number" v-model="item.un"></td>
                <td class="fw-normal">
                  <small class="sm">
                    <vue-mask class="form-control form-control-sm sm" :disabled="enviadoEmpresa" mask="00,00" :raw="false" :options="options" v-model="item.desc"></vue-mask>
                  </small>
                </td>
                <td class="fw-normal">
                  <small class="sm">
                    <vue-mask class="form-control form-control-sm sm" :disabled="enviadoEmpresa" mask="00,00" :raw="false" :options="options" v-model="item.comiss"></vue-mask>
                  </small>
                </td>
                <td class="fw-normal">
                  <select id="inputGroupSelectCondEsp" :disabled="enviadoEmpresa" class="form-select form-select-sm sm" @change="handleCondicao(item)" v-model="item.condEsp">
                    <option value=" "></option>
                    <option value="M">Medida Especial</option>
                    <option value="D">Desconto Especial</option>
                    <option value="C">Condição de Pagto</option>
                    <option value="P">Prazo Especial</option>
                    <option value="O">Outras</option>
                  </select>
                </td>
                <td class="fw-normal"><small><input class="form-control form-control-sm sm" :disabled="enviadoEmpresa" type="text" v-model="item.obs"></small></td>
                <td class="fw-normal">
                  <small class="sm">
                    <vue-mask class="form-control form-control-sm sm" :disabled="enviadoEmpresa" mask="000.000,00" :raw="false" :options="options" v-model="item.vlrUnit"></vue-mask>
                  </small>
                </td>

                <td><button class="btn btn-sm btn-danger sm" :disabled="enviadoEmpresa" @click="deleteItem(item)">Excluir</button></td>
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
          <div class="col-2">
            <div class="input-group input-group-sm">
              <span class="input-group-text">Total (Kg)</span>
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
              <span class="input-group-text">ICMS (R$)</span>
              <input id="icmsValor" class="form-control" type="text" disabled v-model="icmsValor">
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
      clientes: null,
      transportadoras: null,
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
      comissao: '',
      empresa: '',
      observacoesPedido: '',
      empresasCliente: [],
      addingProduct: false,
      itens: [],
      itemSelecionado: null,
      numPed: '',
      pedCli: '',
      enviadoEmpresa: false,
      totalKg: 0,
      totalM3: 0,
      totalValor: 0,
      ipiValor: 0,
      icmsValor: 0,
      nfValor: 0,
      manipulando: false,
      options: {
        reverse: true
      }
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
      this.clientesFiltro = ''
      if (this.clientes === null) {
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnBuscaClientes').disabled = true
        const token = sessionStorage.getItem('token')
        axios.get('http://localhost:8080/clientes?token=' + token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            this.clientes = response.data.clientes
            this.clientes.forEach(cliente => {
              const formatter = new StringMask('99.999.999/0000-00')
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
        const token = sessionStorage.getItem('token')
        axios.get('http://localhost:8080/transportadoras?token=' + token)
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
    buscaPedidosCliente () {
      if (this.cliente !== '') {
        this.pedidosCliente = null
        this.pedidosClienteFiltro = ''
        document.getElementsByTagName('body')[0].style.cursor = 'wait'
        document.getElementById('btnBuscaPedidosCliente').disabled = true
        const token = sessionStorage.getItem('token')
        axios.get('http://localhost:8080/pedidosCliente?cli=' + this.cliente + '&token=' + token)
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
      const token = sessionStorage.getItem('token')
      axios.get('http://localhost:8080/pedidos?token=' + token)
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
        const token = sessionStorage.getItem('token')
        axios.get('http://localhost:8080/condicoesPagto?emp=' + this.empresa + '&token=' + token)
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
    verificarConjunto () {
      console.log('focus out')
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
      this.buscarDadosCliente(this.cliente, false)
    },
    selectTransportadora (transportadoraClicked) {
      this.codTransportadora = transportadoraClicked.CODTRA
      this.transportadora = transportadoraClicked.NOMTRA
      document.getElementById('closeModalTransportadoras').click()
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
      const token = sessionStorage.getItem('token')
      axios.get('http://localhost:8080/dadosCliente?token=' + token + '&codCli=' + codCli)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data)
          this.dadosCliente = response.data.dadosCliente
          if (this.dadosCliente.length > 0) {
            this.comissao = this.dadosCliente[0].PERCOM
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

            const token = sessionStorage.getItem('token')
            axios.get('http://localhost:8080/pedidosCliente?cli=' + this.cliente + '&token=' + token)
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
        comiss: this.comissao,
        condEsp: ' ',
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
        alert('Favor preencher o Cliente!')
      } else if (this.empresa === '') {
        alert('Favor escolher uma empresa!')
      } else if (this.pedCli === '') {
        alert('Favor preencher o campo Pedido Cliente!')
      } else if (this.condPagamento === '') {
        alert('Favor selecionar uma Condição de Pagamento!')
      } else if (this.pedidosCliente && this.pedidosCliente.some(pedido => pedido.PEDCLI === this.pedCli)) {
        alert('Valor para Pedido Cliente já utilizado. Utilize outro valor.')
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
              pedCli: this.pedCli !== '' ? this.pedCli : 0,
              codRep: this.codRepresentada,
              codTra: this.codTransportadora,
              cifFob: 'F',
              obsPed: this.observacoesPedido,
              codCpg: this.codCondPagamento
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
              respostaPedido = result['S:Envelope']['S:Body']['ns2:GravarPedidos_13Response'].result.respostaPedido
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
    normalizarPedidoCliente () {
      this.pedCli = this.pedCli.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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
      this.enviadoEmpresa = false
      this.prevFaturamento = ''
      this.condPagamento = ''
      this.comissao = ''
      this.manipulando = false
      this.observacoesPedido = ''
    },
    handleCondicao (item) {
      if (item.condEsp === 'M') {
        alert('Informe o novo comprimento, em centímetros, para o produto. Produtos de medida especial tem acréscimo no valor de tabela.')
        this.buscarDerivacoes(item.codConfig)
          .then(response => {
            item.derivacoesPossiveis = response.data.derivacoes
          })
        document.getElementById('inputComp' + item.hash).disabled = false
      } else {
        document.getElementById('inputComp' + item.hash).disabled = true
        if (item.condEsp === 'D') {
          alert('Descreva o critério e desconto aplicado para a condição especial nas observações do item.')
        } else if (item.condEsp === 'C') {
          alert('Descreva o critério e a condição de pagamento aplicado para a condição especial nas observações do item.')
        } else if (item.condEsp === 'P') {
          alert('Em dias corridos, descreva o prazo especial desejado nas observações do item.')
        } else if (item.condEsp === 'O') {
          alert('Descreva a condição especial nas observações do item.')
        }
      }
    },
    salvarItens () {
      document.getElementById('closeModalSalvarItens').click()
      let temErro = false
      this.itens.forEach(item => {
        if (item.un === '' || item.un < 1 || item.un > 99) {
          alert('Erro: Existe(m) produto(s) com quantidade sem preencher, ou menor que zero, ou maior que 99. Verifique!')
          temErro = true
        }
        if (!item.codEstilo || !item.codConfig || (item.condEsp !== 'M' && !item.codComp)) {
          alert('Erro: Existe(m) produto(s) faltando definir estilo, configuração ou comprimento. Verifique!')
          temErro = true
        }
        if (item.cnj !== '' && item.cnj !== ' ' && item.cnj < 1) {
          alert('Erro: Existe(m) produto(s) com número de conjunto menor que 1. Verifique!')
          temErro = true
        }
        if ((item.condEsp === 'D' || item.condEsp === 'C' || item.condEsp === 'P' || item.condEsp === 'O') && (!item.obs)) {
          alert('Erro: Existe(m) produto(s) com condição especial que requer preenchimento de observação. Verifique!')
          temErro = true
        }
        if (item.desc === '') {
          alert('Erro: Existe(m) produto(s) com desconto em branco. Verifique!')
          temErro = true
        }
        if (item.vlrUnit === 0 || item.vlrUnit === '') {
          alert('Erro: Existe(m) produto(s) com valor unitário zerado. Verifique!')
          temErro = true
        }
        if (item.condEsp === 'M') {
          if (!item.comp) {
            alert('Erro: Existe(m) produto(s) com medida especial sem o comprimento preenchido. Verifique!')
            temErro = true
          } else {
            let compMaisProximo = ''
            let menorDistancia = 1000000
            compMaisProximo = item.derivacoesPossiveis[0].CODDER
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
            item.codComp = compMaisProximo
          }
        }
      })
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
        var hoje = new Date()
        var datEnt = hoje.setDate(hoje.getDate() + 75)
        var dia = new Date(datEnt).getDate().toString().padStart(2, '0')
        var mes = (new Date(datEnt).getMonth() + 1).toString().padStart(2, '0') // +1 pois no getMonth Janeiro começa com zero.
        var ano = new Date(datEnt).getFullYear()
        var datEntFmt = dia + '/' + mes + '/' + ano
        this.itens.forEach(item => {
          itensPedido.push(
            {
              numCnj: item.cnj === '' ? ' ' : item.cnj,
              codPro: item.codConfig,
              desPro: (item.config + ' ' + item.comp),
              codDer: item.codComp,
              derEsp: item.condEsp === 'M' ? item.comp : '',
              seqIpd: 0,
              qtdPed: item.un,
              preUni: Number(item.vlrUnit.replace('.', '').replace(',', '')) / 100,
              perDsc: Number(item.desc.toString().replace(',', '.')),
              perCom: Number(item.comiss.toString().replace(',', '.')),
              datEnt: datEntFmt,
              conEsp: item.condEsp,
              obsIpd: item.obs
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
              respostaPedido = result['S:Envelope']['S:Body']['ns2:GravarPedidos_13Response'].result.respostaPedido
              if (respostaPedido.retorno === 'OK') {
                alert('Itens salvos com sucesso!')
                this.carregarCabecalho()
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
    buscarDerivacoes (config) {
      const token = sessionStorage.getItem('token')
      return axios.get('http://localhost:8080/derivacoesPorProduto?emp=1&produto=' + config + '&token=' + token)
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
      const token = sessionStorage.getItem('token')
      axios.get('http://localhost:8080/pedido?emp=' + this.empresa + '&fil=1&ped=' + this.numPed + '&token=' + token)
        .then((response) => {
          this.checkInvalidLoginResponse(response.data.pedido)
          this.prevFaturamento = response.data.pedido[0].DATENT
          this.condPagamento = response.data.pedido[0].DESCPG
          this.frete = response.data.pedido[0].CIFFOB === 'F' ? 'FOB' : 'CIF'
          this.codTransportadora = response.data.pedido[0].CODTRA
          this.codRepresentada = response.data.pedido[0].CODREP
          this.enviadoEmpresa = (response.data.pedido[0].SITPED === '3' || response.data.pedido[0].SITPED === '4' || response.data.pedido[0].SITPED === '5')
          this.observacoesPedido = response.data.pedido[0].OBSPED
        })
        .catch((err) => {
          console.log(err)
        })
    },
    carregarItens () {
      const token = sessionStorage.getItem('token')
      this.itens = []
      this.totalKg = parseFloat(0)
      this.totalM3 = parseFloat(0)
      this.totalValor = parseFloat(0)
      this.ipiValor = parseFloat(0)
      this.icmsValor = parseFloat(0)
      this.nfValor = parseFloat(0)
      axios.get('http://localhost:8080/itensPedido?emp=' + this.empresa + '&fil=1&ped=' + this.numPed + '&token=' + token)
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
                    comp: item.CNDESP === 'M' ? item.LARDER : item.CODDER,
                    un: item.QTDPED,
                    desc: Number(item.PERDSC).toFixed(2).toLocaleString(),
                    comiss: Number(item.PERCOM).toFixed(2).toLocaleString(),
                    condEsp: item.CNDESP,
                    datEnt: item.DATENT,
                    obs: item.OBSIPD,
                    vlrUnit: Number(item.VLRIPD).toFixed(2).toLocaleString(),
                    hash: Math.floor(Math.random() * ((this.itens.length + 1) * 1000)),
                    derivacoesPossiveis: derivacoesPossiveis
                  }
                )
                this.itens.sort(this.compareSeqIpd)
                this.totalKg = parseFloat(parseFloat(this.totalKg) + parseFloat(item.PESIPD)).toFixed(2)
                this.totalM3 = parseFloat(parseFloat(this.totalM3) + parseFloat(item.VOLIPD)).toFixed(2)
                this.totalValor = parseFloat(parseFloat(this.totalValor) + parseFloat(parseInt(item.QTDPED) * parseFloat(item.VLRIPD))).toFixed(2)
                this.ipiValor = parseFloat(parseFloat(this.ipiValor) + parseFloat(item.IPIIPD)).toFixed(2)
                this.icmsValor = parseFloat(parseFloat(this.icmsValor) + parseFloat(item.ICMIPD)).toFixed(2)
                this.nfValor = parseFloat(parseFloat(this.nfValor) + parseFloat(item.NFVIPD)).toFixed(2)
              })
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    compareSeqIpd (a, b) {
      if (a.seqIpd < b.seqIpd) {
        return -1
      }
      if (a.seqIpd > b.seqIpd) {
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
        const token = sessionStorage.getItem('token')
        axios.post('http://localhost:8080/enviarPedido?emp=' + this.empresa + '&fil=1&ped=' + this.numPed + '&token=' + token)
          .then((response) => {
            this.checkInvalidLoginResponse(response.data)
            if (response.data.pesoTotal) {
              alert('Pedido enviado à empresa com sucesso!')
              this.enviadoEmpresa = true
              this.totalKg = parseFloat(response.data.pesoTotal).toFixed(2)
              this.totalM3 = parseFloat(response.data.volumeTotal).toFixed(2)
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
</style>
