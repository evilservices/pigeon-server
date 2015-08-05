var Promise = require("bluebird");
var NodeRSA = require('node-rsa');
var database = require('../database');
var debug = require('debug')('verify');

module.exports = function(io, socket, data) {
  return Promise.resolve().then(function() {

    //check if all parameters exists
    debug('check parameters');

    if(!data.hasOwnProperty('signature')) throw new Error('Missing signature', 1201);

  }).then(function () {

    //check if login token exists
    debug('check login token');

    if(!socket.login_token) throw new Error('Never called login', 1202);

  }).then(function () {

    //load public key from database
    debug('load public key');

    return database.query(
      'select id, public_key from users where username = ?',
      [socket.username]
    );

  }).then(function (rows) {

    //check if username exist
    debug('check username');

    if(rows.length != 1) throw new Error('Username does not exist', 1203)

    return rows[0];

  }).then(function (user) {

    //check signature
    debug('check signature');

    var key = new NodeRSA();
    key.importKey(user.public_key, 'pkcs8-public-der');

    if(!key.verify(socket.login_token, data.signature)) throw new Error('Invalid signature', 1204);

    return user.id;

  }).then(function (user_id) {

    //set socket as logged in
    debug('login success');

    socket.user_id = user_id;
    socket.emit('verifySuccess');

  });

};
