var express = require('express');
var bodyParser = require('body-parser');
var HelperModule = require("./helper");
var Helper = new HelperModule();
var app = express();
app.use(bodyParser.json());

var cantidadDocentes = 2;
var APP_HOST = "localhost:3000";

var server = app.listen(3002, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


// registrar docentes
Helper.correrNveces(function() {
  registrarDocente(function(docenteId) {
    var consultas = [];

    recibirConsultas(docenteId, function(consultaId) {
      consultas.push(consultaId);
    });

    recibirStartRespuesta(docenteId, function(doncenteRespondiendoId, consultaId) {
      var pos = consultas.indexOf(consultaId);
      if(pos == -1){
        consultas.splice(pos, 1);
      }
    }); 
  });
}, cantidadDocentes, 10000);

function registrarDocente(cont) {
  console.log("=====================================");
  console.log("Registrando docente");
  var docente = { nombre: 'docente piola'};
  var url = "http://" + APP_HOST + "/docentes";

  Helper.makePost(docente, url, function(response, body) {
    console.log("Response de registrar docente " + JSON.stringify(response.body));
    cont(response.body.id);
  }, function(err){
    console.log("Hubo un error al registrar al docente: " + err);
  }); 
};

function recibirConsultas(doncenteId, cont) {
  app.post('/docentes/' + doncenteId + "/consultas", function (req, res) {
    console.log("=====================================");
    console.log("Docente " + doncenteId + " ha recibido la consulta: " + JSON.stringify(req.body));
    cont(req.body.consulta);
    res.status(200);
    res.send();
  });
};

function recibirStartRespuesta (doncenteId, cont) {
  app.post('/docentes/' + doncenteId + "/respuesta/start", function (req, res) {
    console.log("=====================================");
    console.log("Docente " + doncenteId + " ha recibido la start respuesta: " + JSON.stringify(req.body));
    cont(req.body.docente, req.body.consulta);
    res.status(200);
    res.send();
  });
};
