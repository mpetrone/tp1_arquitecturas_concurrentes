var express = require('express');
var request = require('request');
var app = express();

var profesores = [];

var server = app.listen(3000, function () {
    
});

app.post('/notification', function (req, res) {

});

// registrar profesor
setInterval(function () {
  console.log("=====================================");
  console.log("Registrando profesor");
  var rand = Math.floor((Math.random() * 100) + 1);
  while(profesores.indexOf(rand) !== -1) {
    rand = Math.floor((Math.random() * 100) + 1);
  }

  var profParams = { id: rand, nombre: 'profe' + rand, type: 'Docente' };
  profesores.push(rand);

  request({
    url: "http://172.20.10.3:3000/user",
    method: 'POST',
    json: profParams,
    headers: {
      "Content-Type": "application/json"
    }
  }, function(err, response, body) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Response status de registrar profesor" + rand + ": " + response.statusCode);
  });

}, 5000);


// get a consultas y responder una random
setInterval(function () {
  console.log("=====================================");
  console.log("Trayendo las consultas");
  request({
    url: "http://172.20.10.3:3000/consultas",
    method: 'GET'
  }, function(err, response, body) {
    if (err) {
      console.log(err);
      return;
    }
    
    console.log("CONSULTAS:")
    console.log(body);
    
    for (var consultaId in body) {
      var profesorId = 1;
      
      var respuestaParams = {
        respuesta: "veintisiete",
        profesor: profesorId,
        consulta: consultaId
      };

      console.log("=====================================");
    console.log("Respondiendo la consulta " + consultaId);
    request({
      url: "http://172.20.10.3:3000/responder",
      method: 'POST'
    }, function(err, response, body) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(body);
    }); 
    }
  }); 
}, 3000);


// get a consultas y responder una random
setInterval(function () {
  console.log("=====================================");
  console.log("Trayendo las consultas");
  request({
    url: "http://172.20.10.3:3000/consultas",
    method: 'GET'
  }, function(err, response, body) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(body);
  }); 
}, 3000);