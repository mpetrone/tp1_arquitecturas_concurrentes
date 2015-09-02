function Consulta(id, remitente, contenido){
  this.id = id;
  this.remitente = remitente;
  this.contenido = contenido;
};

Consulta.prototype.toString = function(){
  return "Consulta -> (remitente: " + this.remitente + " con contenido '" + this.contenido + "')";
}

module.exports = Consulta;