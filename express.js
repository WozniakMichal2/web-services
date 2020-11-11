const express = require('express')
const helmet = require("helmet")
var bodyParser = require('body-parser')
const soapRequest = require('easy-soap-request')
const app = express()
const port = 3000

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

app.use(helmet())