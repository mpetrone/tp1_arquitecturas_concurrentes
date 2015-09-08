var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

var cantidadDocentes = 10;
var APP_HOST = "localhost:3003";

var server = app.listen(3002, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// registrar docentes
var intervalId = setInterval(function () {
  if(cantidadDocentes <= 0){
    console.log("=====================================");
    console.log("Registro finalizado");   
    clearInterval(intervalId);
    return;
  }

  cantidadDocentes -= 1;
  registrarDocente(function(docenteId) {
    // scope de un docente
    var consultas = [];
    var consultasSiendoRespondidas = [];

    recibirConsultas(docenteId, function(consultaId) {
      consultas.push(consultaId);
    });

    recibirComienzosDeRespuestas(docenteId, function(consultaId) {
      var pos = consultas.indexOf(consultaId);
      if(pos != -1) {
        consultas.splice(pos, 1);
        consultasSiendoRespondidas.push(consultaId);
      } else {
        console.log("se recibio que un docente empezo a responder una consulta que no se tenia :(")
      }
    });

  });
}, 10000);

function registrarDocente(cont) {
  console.log("=====================================");
  console.log("Registrando docente");
  var docente = { nombre: 'docente piola'};

  request({
    url: "http://" + APP_HOST + "/docentes",
    method: 'POST',
    json: docente,
    headers: {
      "Content-Type": "application/json"
    }
  }, function(err, response, body) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Response de registrar docente " + JSON.stringify(response.body));
    cont(response.body.id);
  });  
}

function recibirComienzosDeRespuestas(docenteId, cont) {
  app.post('/doncentes/' + docenteId + '/respuesta/start', function (req, res) {
    console.log("=====================================");
    console.log("Docente " + docenteId + " ha recibido la notificacion de que una respuesta ha sido empezado a responderse: " + JSON.stringify(req.body));
    cont(req.body.consulta)
    res.status(200);
    res.send();
  });    
}

function recibirConsultas(docenteId, cont) {
  app.post('/docentes/' + docenteId + "/consultas", function (req, res) {
    console.log("=====================================");
    console.log("Docente " + docenteId + " ha recibido la consulta: " + JSON.stringify(req.body));
    cont(req.body.id)
    res.status(200);
    res.send();
  });  
}
