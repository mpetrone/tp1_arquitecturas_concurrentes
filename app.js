var express = require('express');
var HelperModule = require("./helper");
var Helper = new HelperModule();
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());


var ALUMNOS_HOST  = "localhost:3001";
var DOCENTES_HOST = "localhost:3002";

var alumnos = [];
var docentes = [];
var consultas = {};

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Servidor levantado en http://%s:%s', host, port);
});

app.post('/docentes', function (req, res) {
  console.log("=====================================");
  console.log("docentes creado -> " + JSON.stringify(req.body));
  if(!req.body.nombre) {
    res.status(401);
    res.send();   
  }

  var docenteId = docentes.length + 1
  var nombre = req.body.nombre;
  var docente = { "id": docenteId, "nombre": nombre};
  docentes.push(docente);
  app.post('/docentes/' + docenteId + '/respuesta/start', function (req, res) { 
    console.log("=====================================");
    console.log("creacion docente " + docenteId + " respuesta -> " + JSON.stringify(req.body));
    docentes.forEach(function(docente) {
      if(docente.id != docenteId){
        enviarStartRespuesta(docente.id, {"docente": docenteId, "consulta": body.consulta});   
      } 
    });
  });
  res.status(200);
  res.send(docente);
});

app.post('/alumnos', function (req, res) {
  console.log("=====================================");
  console.log("alumnos creado -> " + JSON.stringify(req.body));
  if(!req.body.nombre) {
    res.status(401);
    res.send();   
  }
  
  var alumnoId = alumnos.length + 1
  var nombre = req.body.nombre;
  var alumno = { "id": alumnoId, "nombre": nombre};
  alumnos.push(alumno);
  app.post('/alumnos/' + alumnoId + '/consultas', function (req, res) { 
    console.log("=====================================");
    console.log("el alumno " + alumnoId + " hizo una consulta -> " + JSON.stringify(req.body));
    var descripcion = req.body.descripcion;
    var consultaId = Math.floor((Math.random() * 1000000) + 1);
    var consulta = { "consulta": consultaId, "alumno": alumnoId,  "descripcion": descripcion};
    alumnos.forEach(function(alumno) {
      if(alumno.id != alumnoId) {
        enviarConsultaAlumno(alumno.id, consulta);
      }
    });
   docentes.forEach(function(docente) {
      enviarConsultaDocente(docente.id, consulta);
    });
    res.status(200);
    res.send(consulta);
  });
  res.status(200);
  res.send(alumno);
});

function enviarConsultaAlumno(alumnoId, consulta) {
  var url = "http://" + ALUMNOS_HOST + "/alumnos/" + alumnoId + "/consultas";
  Helper.makePost(consulta, url, function(response, body) {
    console.log("Response status de enviar consulta al alumno: " + response.statusCode + " and body: " + JSON.stringify(body));    
  }, function(err){
    console.log("Hubo un error al enviar la consulta al alumno " + alumnoId + ": " + err);
  });
}

function enviarConsultaDocente(doncenteId, consulta) {
  var url = "http://" + DOCENTES_HOST + "/docentes/" + doncenteId + "/consultas";
  Helper.makePost(consulta, url, function(response, body) {
    console.log("Response status de enviar consulta al docente: " + response.statusCode);    
  }, function(err){
    console.log("Hubo un error al enviar la consulta al docente " + doncenteId + ": " + err);
  });
}

function enviarStartRespuesta(doncenteId, infoRespuesta) {
  var url = "http://" + DOCENTES_HOST + "/docentes/" + doncenteId + "/respuesta/start";
  Helper.makePost(infoRespuesta, url, function(response, body) {
    console.log("Response status de start respuesta al doncente: " + response.statusCode + " and body: " + JSON.stringify(body));    
  }, function(err){
    console.log("Hubo un error al enviar la consulta al docente " + doncenteId + ": " + err);
  });
}
