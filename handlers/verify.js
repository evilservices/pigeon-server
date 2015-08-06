var Promise = require("bluebird");
var NodeRSA = require('node-rsa');
var database = require('../database');
var debug = require('debug')('verify');

module.exports = function(ns, socket, data) {
  return Promise.resolve().then(function() {

    //check if all parameters exists
    debug('check parameters');

    if(!data.hasOwnProperty('signature')) throw new Error('SIGNATURE_MISSING');

  }).then(function () {

    //check if login token exists
    debug('check login token');

    if(!socket.login_token) throw new Error('LOGINTOKEN_MISSING');

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

    if(rows.length != 1) throw new Error('USERNAME_NOTEXISTS')

    return rows[0];

  }).then(function (user) {

    //check signature
    debug('check signature');

    var key = new NodeRSA();
    key.importKey(user.public_key, 'pkcs8-public-der');

    if(!key.verify(socket.login_token, data.signature)) throw new Error('SIGNATURE_INVALID');

    return user.id;

  }).then(function (user_id) {

    //set socket as logged in
    debug('login success');

    socket.user_id = user_id;
    socket.emit('verifySuccess');

  });

};
