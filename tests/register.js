var should = require('should');
var io = require('socket.io-client');
var NodeRSA = require('node-rsa');

var socketURL = 'http://localhost:3000';

var options ={
  transports: ['websocket'],
  'force new connection': true
};

it('Should broadcast new user to all users', function(done) {
  var client1 = io.connect(socketURL, options);

  client1.on('connect', function(){
    var key = new NodeRSA({b: 1024});

    var username = 'pascal';
    var avatar = '0000';
    var publicKey = key.exportKey('pkcs8-public-der');

    client1.on('registerSuccess', function(data) {

      should(data).have.property('id');

      done();
    });

    client1.emit('register', {
      'username': username,
      'avatar': avatar,
      'public_key': publicKey
    });

  });

});