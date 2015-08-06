var Promise = require("bluebird");
var database = require('../database');
var utils = require('../utils');
var debug = require('debug')('request');

module.exports = function(ns, socket, data) {
  return Promise.resolve().then(function() {

    //check if all parameters exists
    debug('check parameters');

    if(!data.hasOwnProperty('user_id')) throw new Error('USERID_MISSING');

  }).then(function() {

    //check if user is logged in
    debug('check login state');

    if(!socket.user_id) throw new Error('UNAUTHORIZED');

  }).then(function() {

    //search for username in database
    debug('search user');

    return database.query(
      'select id from users where id = ? and banned = false',
      [data.user_id]
    );

  }).then(function(rows) {

    //check if user exists
    debug('check user_id');

    if(rows.length != 1) throw new Error('USERID_NOTEXISTS');

  }).then(function() {

    //create request
    debug('create request');

    return database.query(
      'insert into request (requester_id, user_id) values (?, ?)',
      [socket.user_id, data.user_id]
    )

  }).then(function(row) {

    //check if new request exists
    debug('check new request');

    if(row.affectedRows != 1) throw new Error('REQUEST_ERROR');

  }).then(function() {

    //check if requested user is online
    debug('check online status');

    return utils.getSocket(ns, data.user_id);

  }).then(function(user) {

    if(user_socket == null) return;

    //notify user about new request
    debug('notify user');

    user_socket.emit('request', { 'username': socket.username });

  });
}
