var Promise = require("bluebird");
var NodeRSA = require('node-rsa');
var database = require('../database');
var debug = require('debug')('verify');

module.exports = function(ns, socket, data) {
  return Promise.resolve().then(function() {

    // check if all parameters exists
    // - signature : binary : signature of the login token

    debug('check parameters');

    if(!data.hasOwnProperty('signature')) throw new Error('SIGNATURE_MISSING');

  }).then(function () {

    // check if the client already called
    // the login event and the login token exists

    debug('check login token');

    if(!socket.login_token) throw new Error('LOGINTOKEN_MISSING');

  }).then(function () {

    // get the id and public key
    // of the given user to valid the signature

    debug('load public key');

    return database.query(
      'select id, public_key from users where username = ?',
      [socket.username]
    );

  }).then(function (rows) {

    // check if the given username exists

    debug('check username');

    if(rows.length != 1) throw new Error('USERNAME_NOTEXISTS')

    // compare the signature with
    // the login token

    debug('check signature');

    var key = new NodeRSA();
    key.importKey(rows[0].public_key, 'pkcs8-public-der');

    if(!key.verify(socket.login_token, data.signature)) throw new Error('SIGNATURE_INVALID');

    // complete verification and
    // respond with a success event

    debug('verify success');

    socket.user_id = user_id;
    socket.emit('verifySuccess');

  });

};
