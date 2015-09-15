var express = require('express');
var bodyParser = require('body-parser');
var HelperModule = require("./helper");
var Helper = new HelperModule();
var app = express();
app.use(bodyParser.json());

var cantidadDocentes = 1;
var cantidadDeIntentosDeRespuesta = 2;
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
      if(pos != -1){
        consultas.splice(pos, 1);
      }
    });

    // intenata n veces responder alguna consulta
    Helper.correrNveces(function() {
      if(consultas.length > 0) {
        var consultaId = consultas.pop();
        empezarResponderConsulta(docenteId, consultaId, function(){
          setTimeout(function() {
            var respuesta = "respuesta piola";
            finalizarRespuesta(docenteId, consultaId, respuesta, function(response){
              console.log("el doncente " + docenteId + " finalizo de responder la consulta " + consultaId + ": " + JSON.stringify(response));
            }, function(err) {
              console.log("el doncente " + docenteId + " fallo al finalizar de responder la consulta " + consultaId);
            })
          }, 2000);
        }, function(err){
          console.log("el doncente " + docenteId + " quiso responder la consulta " + consultaId + " pero fallo: " + err);
        });
      }

    }, cantidadDeIntentosDeRespuesta, 5000); 
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

function recibirConsultas(docenteId, cont) {
  app.post('/docentes/' + docenteId + "/consultas", function (req, res) {
    console.log("Docente " + docenteId + " ha recibido la consulta: " + JSON.stringify(req.body));
    cont(req.body.consulta);
    res.status(200);
    res.send();
  });
};

function recibirStartRespuesta(docenteId, cont) {
  app.post('/docentes/' + docenteId + "/respuesta/start", function (req, res) {
    console.log("Docente " + docenteId + " ha recibido la start respuesta: " + JSON.stringify(req.body));
    cont(req.body.docente, req.body.consulta);
    res.status(200);
    res.send();
  });
};

function empezarResponderConsulta(docenteId, consultaId, cont, err){
  console.log("el doncente " + docenteId + " envio empezar respuesta de la consulta " + consultaId);
  var url = "http://" + APP_HOST + '/docentes/' + docenteId + "/respuesta/start";
  var consulta = { "consulta": consultaId }

  Helper.makePost(consulta, url, function(response, body) {
    console.log("respuesta de empezar a responder consulta: " + JSON.stringify(body))
    cont(); 
 }, err);
}

function finalizarRespuesta(docenteId, consultaId, respuesta, cont, err){
  console.log("el doncente " + docenteId + " envio finalizar respuesta de la consulta " + consultaId);
  var url = "http://" + APP_HOST + '/docentes/' + docenteId + "/respuesta/finish";
  var body = { "respuesta": respuesta, "consulta": consultaId }

  Helper.makePost(body, url, function(response, body) { cont(body); }, err); 
}
