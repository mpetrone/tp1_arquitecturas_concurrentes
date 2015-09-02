function Message(id, remitente, contenido){
  this._id = id;
  this._remitente = remitente;
  this._contenido = contenido;
};

Message.prototype.toString = function(){
  return "mensaje -> (remitente: " + this._remitente + " con contenido '" + this._contenido + "')";
}

module.exports = Message;