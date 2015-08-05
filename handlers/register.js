var Promise = require("bluebird");
var NodeRSA = require('node-rsa');
var validator = require('validator');
var debug = require('debug')('register');
var database = require('../database');

module.exports = function(io, socket, data) {

  return Promise.resolve().then(function() {

    //check if all parameters exists
    debug('check parameters');

    if(!data.hasOwnProperty('username')) throw new Error('Missing username', 1001);
    if(!data.hasOwnProperty('avatar')) throw new Error('Missing avatar', 1002);
    if(!data.hasOwnProperty('public_key')) throw new Error('Missing public key', 1003);

    if(!validator.isLength(data.username, 4, 20)) throw new Error('Invalid username length', 1010);
    if(!/^[0-9A-Za-z_]+$/.test(data.username)) throw new Error('Invalid characters in username', 1011);

  }).then(function () {

    //validate given public key
    debug('check public key');

    var key = new NodeRSA();
    key.importKey(data.public_key, 'pkcs8-public-der');

    if(key.isEmpty(true)) throw new Error('Empty public key', 1004);
    if(!key.isPublic(true)) throw new Error('Invalid public key', 1005)

    if(key.getKeySize() < 1024) throw new Error('Public key size is too small', 1006);
    if(key.getKeySize() > 4096) throw new Error('Public key size is too large', 1007);

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

    if(rows[0].count == 1) throw new Error('Username already taken', 1008);

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

    if(row == null || row.affectedRows != 1 || !row.insertId) throw new Error('Could not insert user', 1009)

    return row.insertId;

  }).then(function (id) {

    //return new user id
    debug('respond with user id');

    socket.emit('registerSuccess', { 'id': id });

  });

};
