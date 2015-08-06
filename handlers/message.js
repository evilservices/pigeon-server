var Promise = require("bluebird");
var database = require('../database');
var utils = require('../utils');
var debug = require('debug')('message');

module.exports = function(ns, socket, data) {
  return Promise.resolve().then(function() {

    //check if all parameters exists
    debug('check parameters');

    if(!data.hasOwnProperty('user_id')) throw new Error('USERID_MISSING');
    if(!data.hasOwnProperty('local_id')) throw new Error('LOCALID_MISSING');
    if(!data.hasOwnProperty('message')) throw new Error('MESSAGE_MISSING');

  }).then(function() {

    //check if user is logged in
    debug('check login state');

    if(!socket.user_id) throw new Error('UNAUTHORIZED');

  }).then(function () {

    //check if message already exists
    debug('check local id');

    return database.query(
      'select id, created count from messages where local_id = ? and user_id = ?',
      [data.local_id, socket.user_id]
    );

  }).then(function(rows) {

    if(rows.length == 0) {

      //create message
      debug('create message');

      return database.query(
        'insert into messages (local_id, user_id, receiver_id, message) values (?, ?, ?, ?)',
        [data.local_id, socket.user_id, data.user_id, data.message]
      ).then(function (row) {

        //check if message exists
        debug('check message');

        if(row.affectedRows != 1 || row.insertId == null) throw new Error('ERROR_MESSAGE');

        return database.query(
          'select id, created from messages where id = ?',
          [row.insertId]
        );

      });
    } else {

      //message already exists
      debug('message already exists');

    }

  }).then(function(rows) {

    socket.emit('message', { 'message_id': rows[0].id, 'created': rows[0].created });

    return rows[0];

  }).then(function(row) {

    //check if accepted user is online
    debug('check online status');

    return [utils.getSocket(ns, data.user_id), row];

  }).then(function(args) {

    if(args[0] == null) return;

    //notify user about new request
    debug('notify user');

    args[0].emit('message', {
      'message_id': args[1].id,
      'user_id': socket.user_id,
      'message': data.message,
      'created': args[1].created
    });

  });

};
