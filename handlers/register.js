var Promise = require("bluebird");
var NodeRSA = require('node-rsa');
var validator = require('validator');
var debug = require('debug')('register');
var database = require('../database');

module.exports = function(ns, socket, data) {

  return Promise.resolve().then(function() {

    // check if all parameters exists
    // - username : string : username of the user (4-20 chars, alphanumeric + _ only)
    // - avatar : string : avatar of the user (4 chars, 4 hex code digits)
    // - public_key : binary : public key of the user (DER format)

    debug('check parameters');

    if(!data.hasOwnProperty('username')) throw new Error('USERNAME_MISSING');
    if(!data.hasOwnProperty('avatar')) throw new Error('AVATAR_MISSING');
    if(!data.hasOwnProperty('public_key')) throw new Error('KEY_MISSING');

    if(!validator.isLength(data.username, 4, 20)) throw new Error('USERNAME_LENGTH');
    if(!/^[0-9A-Za-z_]+$/.test(data.username)) throw new Error('USERNAME_INVALID');

  }).then(function () {

    // validate given public key
    // key must be a valid public key
    // with a key size between 1024 and 4096 bits

    debug('check public key');

    if(data.public_key == null) throw new Error('KEY_INVALID');

    var key = new NodeRSA();
    try {
      key.importKey(data.public_key, 'pkcs8-public-der');
    } catch(err) {
      throw new Error('KEY_INVALID');
    }

    if(key.isEmpty(true)) throw new Error('KEY_INVALID');
    if(!key.isPublic(true)) throw new Error('KEY_NOTPUBLIC')
    
    if(key.getKeySize() < 1024) throw new Error('KEY_TOOSMALL');
    if(key.getKeySize() > 4096) throw new Error('KEY_TOOLARGE');

  }).then(function () {

    // count all users with give username

    debug('count usernames');

    return database.query(
      'select count(*) count from users where username = ?',
      [data.username]
    );

  }).then(function (rows) {

    // cancel registration if username
    // already belongs to another user

    debug('check username');

    if(rows[0].count > 0) throw new Error('USERNAME_TAKEN');

    // create new user record

    debug('insert user');

    return database.query(
      'insert into users (username, avatar, public_key) values (?, ?, ?)',
      [data.username, data.avatar, data.public_key]
    );

  }).then(function (row) {

    // check if new record
    // and new user_id exists

    debug('check inserted record');

    if(row == null || row.affectedRows != 1 || !row.insertId) throw new Error('ERROR_REGISTER')

    // complete registration
    // and send new user_id to the client

    debug('respond with user id');

    socket.emit('registerSuccess', { 'id': row.insertId });

  });

};
