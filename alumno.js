var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var cantidadAlumnos = 10;
var cantidadConsultas = 10;
var APP_HOST = "localhost:3003";

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// registrar alumnos
correrNveces(function() {
  registrarAlumno(function(alumnoId) {
    recibirConsultas(alumnoId);
    enviarConsultas(alumnoId);
  });
}, cantidadAlumnos, 10000);

function registrarAlumno(cont) {
  console.log("=====================================");
  console.log("Registrando alumno");
  var alumno = { nombre: 'alumno piola'};

  request({
    url: "http://" + APP_HOST + "/alumnos",
    method: 'POST',
    json: alumno,
    headers: {
      "Content-Type": "application/json"
    }
  }, function(err, response, body) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Response status de registrar alumno: " + response.statusCode + " and body: " + JSON.stringify(body));
    cont(body.id);
  });  
}

function recibirConsultas(alumnoId) {
  app.post('/alumnos/' + alumnoId + "/consultas", function (req, res) {
    console.log("=====================================");
    console.log("Alumno " + alumnoId + " ha recibido la consulta: " + JSON.stringify(req.body));
    res.status(200);
    res.send();
  });
}

function enviarConsultas(alumnoId) {
  correrNveces(function () {
    console.log("=====================================");
    console.log("Enviando consulta del alumno " + alumnoId);
    consulta = { descripcion: "consulta piola"};

    request({
      url: "http://" + APP_HOST + '/alumnos/' + alumnoId + "/consultas",
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
      console.log("Response status de enviar consulta: " + response.statusCode + " and body: " + JSON.stringify(body));
    });     
  }, cantidadConsultas, 10000);
}

function correrNveces(f, n, delay) {
  var intervalId = setInterval(function () {
    if(n <= 0){
      clearInterval(intervalId);
      return;
    }    
    n -= 1;
    f();
  }, delay);  
}
