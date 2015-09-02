function Lista() {
  this._list = [];
}

Lista.prototype = {
  agregar: function(usuario) {
    this._list.push(usuario);
  },
  mandarMensaje: function(mensaje) {
    this._list.forEach(function(usuario) {
      console.log("Se ha mandado el mensaje " + mensaje + " a el " + usuario._tipo + " " + usuario._nombre);
    });
  }
}

module.exports = Lista;