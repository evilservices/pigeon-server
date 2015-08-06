var Promise = require("bluebird");
var NodeRSA = require('node-rsa');
var validator = require('validator');
var debug = require('debug')('register');
var database = require('../database');

module.exports = function(ns, socket, data) {

  return Promise.resolve().then(function() {

    //check if all parameters exists
    debug('check parameters');

    if(!data.hasOwnProperty('username')) throw new Error('USERNAME_MISSING');
    if(!data.hasOwnProperty('avatar')) throw new Error('AVATAR_MISSING');
    if(!data.hasOwnProperty('public_key')) throw new Error('KEY_MISSING');

    if(!validator.isLength(data.username, 4, 20)) throw new Error('USERNAME_LENGTH');
    if(!/^[0-9A-Za-z_]+$/.test(data.username)) throw new Error('USERNAME_INVALID');

  }).then(function () {

    //validate given public key
    debug('check public key');

    var key = new NodeRSA();
    key.importKey(data.public_key, 'pkcs8-public-der');

    if(key.isEmpty(true)) throw new Error('KEY_INVALID');
    if(!key.isPublic(true)) throw new Error('KEY_NOTPUBLIC')

    if(key.getKeySize() < 1024) throw new Error('KEY_TOOSMALL');
    if(key.getKeySize() > 4096) throw new Error('KEY_TOOLARGE');

  }).then(function () {

    //count users with give username
    debug('count usernames');

    return database.query(
      'select count(*) count from users where username = ?',
      [data.username]
    );

  }).then(function (rows) {

    //check if username is already taken
    debug('check username');

    if(rows[0].count == 1) throw new Error('USERNAME_TAKEN');

  }).then(function () {

    //create new user
    debug('insert user');

    return database.query(
      'insert into users (username, avatar, public_key) values (?, ?, ?)',
      [data.username, data.avatar, data.public_key]
    );

  }).then(function (row) {

    //check for sql insert
    debug('check inserted record');

    if(row == null || row.affectedRows != 1 || !row.insertId) throw new Error('ERROR_REGISTER')

    return row.insertId;

  }).then(function (id) {

    //return new user id
    debug('respond with user id');

    socket.emit('registerSuccess', { 'id': id });

  });

};
