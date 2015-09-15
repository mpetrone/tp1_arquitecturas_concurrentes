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


// Alumnos

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
    consultas[consultaId] = consulta;
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

function enviarRespuestaAlumno(alumnoId, respuesta) {
  var url = "http://" + ALUMNOS_HOST + "/alumno/" + alumnoId + "/respuesta";
  Helper.makePost(respuesta, url, function(response, body) {
    console.log("Response de recibir respuesta: " + alumnoId + " and body: " + JSON.stringify(body));    
  }, function(err){
    console.log("Hubo un error al recibir respuesta de alumno " + alumnoId + ": " + err);
  });  
}


// Docentes

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
    console.log("docente " + docenteId + " empezo a responder -> " + JSON.stringify(req.body));
    var consultaId = req.body.consulta;
    if(!consultas[consultaId].started){
      console.log("el docente " + docenteId + " trato de empezar a responder " + consultaId + " con exito");
      consultas[consultaId].started = true;
      docentes.forEach(function(docente) {
        if(docente.id != docenteId) {
          enviarStartRespuesta(docente.id, {"docente": docenteId, "consulta": consultaId});   
        } 
      });
      recibirRespuesta(docenteId, function(response) {
        consultas[response.consulta].respuesta = response.respuesta;
        docentes.forEach(function(docente) {
          if(docente.id != docenteId) {
            enviarRespuestaDocente(docente.id, response);
          }
        });
        alumnos.forEach(function(alumno) {
          enviarRespuestaAlumno(alumno.id, response);
        });
      });

      res.status(200);
      res.send();
    } else {
      console.log("el docente " + docenteId + " trato de empezar a responder " + consultaId + " pero ya estaba empezada");
      res.status(401);
      res.send({error: true, causa: "already started"});
    }
  });

  app.post('/docentes/' + docenteId + '/respuesta/finish', function (req, res) { 

    res.status(200);
    res.send(docente);
  });

  res.status(200);
  res.send(docente);
});


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

function recibirRespuesta(docenteId, cont) {
  app.post('/docentes/' + docenteId + '/respuesta/finish', function (req, res) { 
    console.log("el docente " + docenteId + "finalizo la respuesta: " + JSON.stringify(req.body));
    cont(req.body);
    res.status(200);
    res.send();    
  });
}

function enviarRespuestaDocente(docenteId, respuesta) {
  var url = "http://" + DOCENTES_HOST + "/docentes/" + docenteId + "/respuesta";
  Helper.makePost(respuesta, url, function(response, body) {
    console.log("Response de recibir respuesta docente: " + docenteId + " and body: " + JSON.stringify(body));    
  }, function(err){
    console.log("Hubo un error al recibir respuesta de docente " + docenteId + ": " + err);
  });  
}