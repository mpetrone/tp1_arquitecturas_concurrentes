var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());


var ALUMNOS_HOST  = "localhost:3001";
var DOCENTES_HOST = "localhost:3002";

var alumnos = [];
var docentes = [];
var consultas = {};

var server = app.listen(3003, function () {
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
    console.log("docente " + docenteId + " empezo a escribir la respuesta para la consulta -> " + JSON.stringify(req.body));
    docentes.forEach(function(otherDocente) {
      var body = {"docente": otherDocente, "consulta": req.body.consulta}
      makePost(body, "http://" + DOCENTES_HOST + "/docentes/" + otherDocente + "/respuesta/start ")
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
    console.log("el alumno " + alumnoId + " realizo la consulta -> " + JSON.stringify(req.body));
    var descripcion = req.body.descripcion;
    var consultaId = Math.floor((Math.random() * 1000000) + 1);
    var consulta = { "id": consultaId, "alumno": alumnoId,  "descripcion": descripcion};
    alumnos.forEach(function(alumno) {
      makePost(consulta, "http://" + ALUMNOS_HOST + "/alumnos/" + alumno.id + "/consultas")
    });
   docentes.forEach(function(docente) {
      makePost(consulta, "http://" + DOCENTES_HOST + "/docentes/" + docente.id + "/consultas")
    });
    res.status(200);
    res.send(consulta);
  });
  res.status(200);
  res.send(alumno);
});

function makePost(body, url) {
  request({
    url: url,
    method: 'POST',
    json: consulta,
    headers: {
      "Content-Type": "application/json"
    }
  }, function(err, response, body) {
    if (err) {
      console.log(err);
      return;
    } 
    console.log("Response status del post a " + url + ": " + response.statusCode + " and body: " + JSON.stringify(body));
  });   
}

