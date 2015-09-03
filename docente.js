var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

var cantidadDocentes = 10;
var APP_HOST = "localhost:3000";

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
  registrarDocente(function(id) {
    app.post('/docentes/' + id + "/consultas", function (req, res) {
      console.log("=====================================");
      console.log("Docente " + id + " ha recibido la consulta: " + JSON.stringify(req.body));
      res.status(200);
      res.send();
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
