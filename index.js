const express = require('express') 
const app = express()
const path = require('path')
const bodyParser = require('body-parser') 
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')
require('dotenv').config () // hidden API KEY



const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

//configuracoes 
const port = process.env.port
const docId = process.env.docId
const worksheetIndex = 0
const sendGridKey = process.env.SENDGRID_API_KEY


app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname,'views'))

app.use(bodyParser.urlencoded ({ extended:true }))
// app.use, vai passar por ele todas as vezes para que ele seja chamado
// extended:true - faz ele considerar tambem objetos ou vetores
// body parser pega o corpo da requisicao e transforma em uma maneira que possamos ler esse dados


app.get('/', (request, response) => {
  response.render('home')  
})



//forma de entregar os dados do formulario
app.post('/', async(request, response) => {
  try{
  const doc = new GoogleSpreadsheet(docId) //id da planilha
  await promisify(doc.useServiceAccountAuth)(credentials)
  const info = await promisify(doc.getInfo)()
  const worksheet = info.worksheets[worksheetIndex]
  await promisify(worksheet.addRow)( {
    name: request.body.name, 
    store: request.body.store, 
    day: request.body.day, 
    product: request.body.product, 
    brand: request.body.brand, 
    size: request.body.size, 
    restantes: request.body.restantes,
    userAgent: request.body.userAgent,
    userDate: request.body.userDate
    
   })

   //se estoque zerou
   console.log(request.body.name)
   console.log(request.body.product)
   console.log(request.body.brand)
   console.log(request.body.size)
   console.log(request.body.store)
   
  if(request.body.restantes === 'zero') {
    sgMail.setApiKey(sendGridKey)
    const msg = {
    to: 'cirurgicaclinical@yahoo.com.br',
    from: 'marcusungarette@gmail.com',
    subject: 'Produto em falta total no estoque',
    html: `<strong>O colaborador ${request.body.name} acaba de reportar que o(a) ${request.body.product} / ${request.body.brand} / ${request.body.size} zerou no estoque da(do) ${request.body.store}.</strong>`,
    }
    await sgMail.send(msg);
  }


    response.render('sucesso')
} catch (err){
  response.send('Erro ao enviar!')
  console.log(err)

}
})

app.listen(3000, (err) => {
  if (err) {
    console.log ('aconteceu um erro', err)
  } else {
    console.log ('bugtracker rodando na porta 3000')
  }
})
