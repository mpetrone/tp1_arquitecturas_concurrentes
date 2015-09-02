var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Lista = require("./lista");
var Usuario = require("./usuario");
var Message = require("./message");

var alumnos = new Lista();
var docentes = new Lista();
var consultas = {};
var registrados = {};

consultas[100] = new Message(100, 12, "no entiendo nada");

app.use(bodyParser.json());

app.post('/user', function (req, res) {
  console.log("user -> " + JSON.stringify(req.body));
  var id = req.body.id;
  if(registrados[id]) {
    res.status(401);
  } else {
    var type = req.body.type;
    var nombre = req.body.nombre;
    var user = new Usuario(id, type, nombre);
    registrados[id] = user;
    if(type.toLowerCase() == "alumno"){
      alumnos.agregar(user);
    } else if ( type.toLowerCase() == "docente") {
      docentes.agregar(user);
    }
    res.status(200);
  }
  res.send();
});

 // for parsing application/json
app.post('/consulta', function (req, res) {
  console.log("consulta -> " + req.body);	
  var messageId = req.body.messageId;
  if(consultas[messageId]){
    res.status(401);
  } else {
    var alumnoId = req.body.alumnoId;
    var consulta = req.body.consulta;
    var mensaje = new Message(messageId, alumnoId, consulta);
    consultas[messageId] = mensaje;
    docentes.mandarMensaje(mensaje);
    alumnos.mandarMensaje(mensaje);
    res.status(200);
  }
  res.send();
});

app.get('/consultas', function (req, res) {
  console.log("han llamado a consultas"); 
  res.send(consultas)
});

app.post('/responder', function (req, res) {
  console.log("responder -> " + JSON.stringify(req.body));  
  var docenteId = req.body.docente;
  var consultaId = req.body.consulta;
  var respuesta = req.body.respuesta;
  // hacer respuesta
  res.status(200);
  res.send();
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
