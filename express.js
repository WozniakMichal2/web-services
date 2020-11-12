const express = require('express')
const helmet = require("helmet")
var bodyParser = require('body-parser')
let yup = require('yup')

const soapRequest = require('easy-soap-request')
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended:false}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.post('/soap', function (req, res) {
  res.send('Got a POST-SOAP')
})

app.post('/rest', function (req, res) {
  res.send('Got a POST-REST')
})

app.get('/info', (req, res) => {
  var author=require('./package.json')
  res.json({'author':author.author})
  res.status(200)
})



let schema = yup.object().shape({
  name: yup.string().trim().max(10).matches(/^[a-zA-Z]+$/).required()
});

app.get('/hello/:name', (req, res) => {
  schema.isValid(req.params).then(function (valid) {
      if (valid) {
          res.status(200);
          res.send('Hi: ' + req.params.name);
      } else {
          res.send('Error 400');
          res.status(400);
      }
  })
})

let tab = [];
app.post('/store', function(req, res) {
  tab.push(req.body.input)
  console.log(req.body)
  res.status(201)
  res.json({stored_data:tab})
  
})

app.use(helmet())