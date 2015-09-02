var express = require('express');
var app = express();
var request = require('request');
var consultas = ['Como me hago la paja con las dos manos?', 'Rodo la pone ahora que esta soltero?', 'El tony algun dia sacará mas de 4?']

app.get('/notificacion', function (req, res) {
  console.log("notificacion -> " + JSON.stringify(req.body));
  res.status(200);
  res.send();
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  var id = Math.floor((Math.random() * 1000) + 1);

  var options = {
    uri: 'http://172.20.10.3:3000/user',
    method: 'POST',
    json: {
      "tipo": "alumno",
      "id" : id,
      "nombre" : "Mamerto"
    }
  };

  request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('Alumno registrado');
    }
  });

  setInterval(function(){
      var consulta =  consultas[Math.floor(Math.random()*consultas.length)];
      var idConsulta = Math.floor((Math.random() * 1000000) + 1);
      console.log(consulta);

      var options = {
        uri: 'http://172.20.10.3:3000/consulta',
        method: 'POST',
        json: {
          "consulta": consulta,
          "consultaId": idConsulta
        }
      };


      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log('Consulta realizada');
        }
      });

  },2000);
});