'use strict';

let request = require("request");

const url = "http://httpbin.org";

request(url, function(err, response, body) {
  if (err) {
    console.log("wrong")
  }
  console.log("Response Status Code:", body);

});

