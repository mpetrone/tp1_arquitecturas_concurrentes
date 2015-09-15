//var request = require('request');
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
  }

  makePostPromise: function(body, url) {
     request({
      url: url,
      method: 'POST',
      json: body,
      headers: {
        "Content-Type": "application/json"
      }
    }.then(function(){
      return request;
    })
  }


}

module.exports = Helper;