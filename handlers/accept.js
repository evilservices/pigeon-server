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

    //accept request
    debug('accept request');

    return database.query(
      'update request set accept = true where user_id = ? and requester_id = ?',
      [socket.user_id, data.user_id]
    )

  }).then(function(row) {

    //check if request exists
    debug('check request');

    if(row.affectedRows != 1) throw new Error('REQUEST_NOTEXISTS');

  }).then(function() {

    //check if accepted user is online
    debug('check online status');

    return utils.getSocket(ns, data.user_id);

  }).then(function() {

    //notify user about new request
    debug('notify user');

    user_socket.emit('accepted', { 'username': socket.username });

  });

};
