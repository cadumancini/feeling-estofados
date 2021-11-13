<template>
  <div class="home">
    <h1>Feeling Estofados</h1>
    <div id="nav">
      <router-link :to="{ name: 'GerarPedido' }">Gerar Pedido</router-link>
    </div>
    <router-view/>
    <!-- <form class="formHome" @submit.prevent="handleSubmit">
    </form>
    <div v-if="hasSearched">
      <div v-if="productFound">
        <ul>
          <TreeItem
            v-show="productFound"
            :item="fullProduct"></TreeItem>
        </ul>
      </div>
      <div v-else>
        <p>Produto não encontrado!</p>
      </div>
    </div> -->
  </div>
</template>

<script>
// import TreeItem from '../components/TreeItem.vue'
import axios from 'axios'
// import xml2js from 'xml2js'
export default {
  name: 'Home',
  // components: { TreeItem },
  data () {
    return {
      hasSearched: false,
      product: '',
      productFound: true,
      fullProduct: '',
      allComponents: ''
    }
  },
  mounted () {
    if (!sessionStorage.getItem('token')) {
      this.$router.push({ name: 'Login' })
    }
    // this.$refs.inputProduct.focus()
    // this.productFound = false
  },
  methods: {
    async handleSubmit () {
      this.productFound = false
      this.hasSearched = true
      try {
        // VOLTAR AQUI DEPOIS DE RESOLVER PROBLEMA DO CORS
        // ...
        // const xmlBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.senior.com.br">
        //                   <soapenv:Header/>
        //                   <soapenv:Body>
        //                       <ser:Estrutura>
        //                           <user>heintje</user>
        //                           <password>Mercedes3#</password>
        //                           <encryption>0</encryption>
        //                           <parameters>
        //                               <codEmp>1</codEmp>
        //                               <codFil>1</codFil>
        //                               <codPro>110088002</codPro>
        //                               <codDer>138</codDer>
        //                               <flowInstanceID>?</flowInstanceID>
        //                               <flowName>?</flowName>
        //                               <numPed>33022</numPed>
        //                               <seqIpd>1</seqIpd>
        //                           </parameters>
        //                       </ser:Estrutura>
        //                   </soapenv:Body>
        //               </soapenv:Envelope>`
        // const config = {
        //   headers: { 'Content-Type': 'text/xml' }
        // }
        // axios
        //   .post(
        //     'http://baseteste.feelingestofados.com.br/g5-senior-services/sapiens_Synccustomizado?wsdl',
        //     xmlBody,
        //     config
        //   )
        //   .then((response) => console.log(response))
        //   .catch((err) => console.log(err))
        this.productFound = true
        var parseString = require('xml2js').parseString
        var json = null
        const response = await axios.get('assets/retornoExemplo.xml')
        parseString(response.data, { explicitArray: false }, (err, result) => {
          if (err) {
            console.log(err)
          }
          json = result
          this.allComponents = json['S:Envelope']['S:Body']['ns2:EstruturaResponse'].result.componentes
        })
        this.parseAllComponentsIntoFullProduct(this.allComponents)
      } catch (err) {
        console.log(err.message)
      }
    },
    parseAllComponentsIntoFullProduct (allComponents) {
      this.fullProduct = allComponents[0] // inserindo primeiro (produto pai) no objeto
      allComponents.shift() // removendo produto pai do array
      allComponents.forEach(component => {
        // percorrer objeto completo
        this.checkNodeChildren(this.fullProduct, component)
      })
      console.log(this.fullProduct)
    },
    checkNodeChildren (node, component) {
      // comparar niveis
      if ((node.codNiv === component.codNiv.substring(0, node.codNiv.length)) &&
          (/^\.\d+$/.test(component.codNiv.substring(node.codNiv.length)))) {
        if (node.filhos) {
          node.filhos.push(component)
        } else {
          node.filhos = [component]
        }
      } else {
        if (node.filhos) {
          node.filhos.forEach(filho => this.checkNodeChildren(filho, component))
        }
      }
    }
  }
}

</script>

<style>
  ul {
    padding-left: 1em;
    line-height: 1.5em;
    list-style-type: none;
    cursor: pointer;
  }
</style>
