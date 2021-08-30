<template>
  <div class="home">
    <h1>Feeling Estofados</h1>
    <form class="formHome" @submit.prevent="handleSubmit">
      <label>Produto:</label>
      <input type="text" required v-model="product" ref="inputProduct">
      <button>Buscar</button>
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
    </div>
  </div>
</template>

<script>
import TreeItem from '../components/TreeItem.vue'
import axios from 'axios'
// import xml2js from 'xml2js'
export default {
  name: 'Home',
  components: { TreeItem },
  data () {
    return {
      hasSearched: false,
      product: '',
      productFound: true,
      fullProduct: ''
    }
  },
  mounted () {
    if (!sessionStorage.getItem('user')) {
      this.$router.push({ name: 'Login' })
    }
    this.$refs.inputProduct.focus()
    this.productFound = false
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
          // console.log(json)
          this.fullProduct = json['S:Envelope']['S:Body']['ns2:EstruturaResponse'].result.componentes
          console.log(this.fullProduct)
        })
        // USANDO POR ENQUANTO COMO BASE
        // ...
        // const response = await fetch('http://localhost:3000/produtos/' + this.product)
        // if (!response.ok) {
        //   this.productFound = false
        //   throw Error('Produto não encontrado!')
        // }
        // this.productFound = true
        // this.fullProduct = await response.json()
        // console.log(this.fullProduct)
      } catch (err) {
        console.log(err.message)
      }
    }
  }
}

</script>

<style>
  ul {
    padding-left: 1em;
    line-height: 1.5em;
    list-style-type: dot;
    cursor: pointer;
  }
</style>
