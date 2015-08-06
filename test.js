
var fs = require('fs');
var NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 512});
var exported_key =  key.exportKey('private')

fs.writeFile("test/key/512.pem", exported_key, function(err) {
  console.log(err);
});
