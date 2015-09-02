function Lista() {
  this.list = [];
}

var request = require('request');

var ipDocente = "172.20.10.7";
var ipAlumno = "172.20.10.6";

Lista.prototype = {
  agregar: function(usuario) {
    this.list.push(usuario);
  },
  mandarMensaje: function(mensaje) {
    this.list.forEach(function(usuario) {
      var ip;
      if(usuario.tipo.toLowerCase() == "docente"){
        ip = ipDocente;
      } else {
        ip = ipAlumno;
      }
      request({
        url: "http://" + ip + ":3000/consultas",
        method: 'POST',
        json: mensaje,
        headers: {
          "Content-Type": "application/json"
        }
      }, function(err, response, body) {
        if (err) {
          console.log(err);
          return;
        }
        console.log(response.statusCode  + " Se ha mandado el mensaje " + mensaje + " a el " + usuario.tipo + " " + usuario.nombre);
      });
    });
  }
}

module.exports = Lista;