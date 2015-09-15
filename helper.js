//var request = require('request');
var Promise = require("bluebird");
var request = Promise.promisify(require("request"));

function Helper(){
}

Helper.prototype = {
  correrNveces: function(f, n, delay) {
    var intervalId = setInterval(function () {
      if(n <= 0){
        clearInterval(intervalId);
        return;
      }
      n -= 1;
      f();
    }, delay);
  },

  makePost: function(body, url, cont, errHandler) {
     request({
      url: url,
      method: 'POST',
      json: body,
      headers: {
        "Content-Type": "application/json"
      }
    }, function(err, response, body) {
      if (err || response.statusCode >= 400) {
        errHandler(err);
      } else {
        cont(response, body);
      }
    });
  },

  makePostPromise: function(body, url) {
    return request({
      url: url,
      method: 'POST',
      json: body,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      if(response.statusCode >= 400) {
        throw "Error al crear el post"
      }
      return response[0];
    });
  }
}

module.exports = Helper;
