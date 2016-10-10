'use strict';

var http = require("http");

var url =  'http://httpbin.org'

function readHTML (url, _cb){

  http.get(url, function(response){
      let received = "";

  response.on("data",function(data){
    received += data;
  });

  response.on("end",function(){
    _cb(received);
  })

});

}

function printHTML(htmlData){
  console.log(htmlData);
}

readHTML(url, printHTML);