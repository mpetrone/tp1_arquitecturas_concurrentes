var express = require('express');
var app = express();
var HelperModule = require("./helper");
var Helper = new HelperModule();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var cantidadAlumnos = 2;
var cantidadConsultas = 2;
var APP_HOST = "localhost:3000";

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// registrar alumnos
Helper.correrNveces(function() {
  registrarAlumno().then(function(alumnoId){
    recibirConsultas(alumnoId, recibirRespuesta(alumnoId));
    enviarConsultas(alumnoId).then(recibirRespuesta(alumnoId));
  });
}, cantidadAlumnos, 10000);

// Helper.correrNveces(function() {
//   registrarAlumno().then(function(alumnoId) {
//     recibirConsultas(alumnoId, function(consultaId) {
//       recibirRespuesta(alumnoId, consultaId);
//     });
//     enviarConsultas(alumnoId, function(consultaId) {
//       recibirRespuesta(alumnoId, consultaId);
//     });
//   });
// }, cantidadAlumnos, 10000);

function registrarAlumno() {
  console.log("=====================================");
  console.log("Registrando alumno");
  var alumno = { nombre: 'alumno piola'};
  var url = "http://" + APP_HOST + "/alumnos";

  Helper.makePostPromise(alumno, url).then(function(response) {
    console.log("Response status de registrar alumno: " + response.statusCode + " and body: " + JSON.stringify(response.body));
    return response.body.id;
  })
  .catch(function(err)){
    console.log("Hubo un error al registrar un alumno: " + err);
  }); 
}

function recibirConsultas(alumnoId, cont) {
  app.post('/alumnos/' + alumnoId + "/consultas", function (req, res) {
    console.log("=====================================");
    console.log("Alumno " + alumnoId + " ha recibido la consulta: " + JSON.stringify(req.body));
    cont(req.body.consulta);
    res.status(200);
    res.send();
  });
}

function recibirRespuesta(alumnoId, consultaId) {
  app.post('/alumnos/' + alumnoId + "/respuesta", function (req, res) {
    console.log("=====================================");
    console.log("Alumno " + alumnoId + " ha recibido la respuesta: " + JSON.stringify(req.body));
    res.status(200);
    res.send();
  });  
}

function enviarConsultas(alumnoId) {
  Helper.correrNveces(function () {
    console.log("=====================================");
    console.log("Enviando consulta del alumno " + alumnoId);
    consulta = { descripcion: "consulta piola"};
    var url = "http://" + APP_HOST + '/alumnos/' + alumnoId + "/consultas";

    Helper.makePostPromise(consulta, url).then(function(response) {
      console.log("Response status de enviar consulta: " + response.statusCode + " and body: " + JSON.stringify(response.body));
      return response.body.consulta;
    })
    .catch(function(err){
      console.log("Hubo un error al enviar la consulta del alumno " + alumnoId + ": " + err);
    });       
  }, cantidadConsultas, 10000);
};