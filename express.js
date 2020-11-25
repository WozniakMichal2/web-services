const express = require('express')
const helmet = require("helmet")
const formidable = require('formidable')
const fs = require('fs')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
let yup = require('yup')

const soapRequest = require('easy-soap-request')
const { text } = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
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



app.post('/parse', (req, res) => {
  const form = formidable({ multiples: true });
  var toJson="{\"";
  var isOpen=false;
  form.parse(req, (err, fields, files) => {

    var path=files.toParse.path;
    console.log(path);
    fs.readFile(path,(err, data) => {
      if (err) throw err;
      text=data.toString();
    for (let i=0; i<text.length; i++)
    {
      if (text[i]==":")
      {
        toJson+="\":";
        let isNumberTmp=parseInt(text[i+1]);
        let isNumber=isNaN(isNumberTmp);
      if (isNumber)
      {
        toJson+="{\"";
        isOpen=true;
      }
      }
      else if (text[i]==";")
      {
        if(isOpen)
        {
          toJson+="}";
          isOpen=false;
        }
        toJson+=",\"";
      }
      else if (text[i]==",")
      {
        toJson+=",\"";
      }
      else {
        toJson+=text[i];
      }
    }
    if(isOpen)
    {
      toJson+="}";
    }
    toJson+="}";
    toJson.trim();

    console.log(toJson);
    res.json(JSON.parse(toJson));
    res.status(200);
    
  });
});
});

app.get('/login/:log/:pass', (req, res) => {
  var log = req.params.log;
  var pass = req.params.pass;
  var login = "admin"
  var password = "admin"

  var token = jwt.sign({login}, secret)
  
  if(log==login & pass==password){
    res.status(200)
    res.send(token)
  }
  else{
    res.status(401)
    res.send('Błąd 401');
  }
});

app.get('/profile', (req,res)=> {
  let token = req.headers.authorization;
  token=token.slice(7);
  var decoded=jwt.decode(token);
  var login = "login";
  if (decoded.login==login)
  {
    res.json({"login":decoded.login});
  }
  else {
    res.status(401);
    res.send("Wrong token!");
  }

})
