var Promise = require("bluebird");
var database = require('../database');
var debug = require('debug')('search');

module.exports = function(ns, socket, data) {
  return Promise.resolve().then(function() {

    //check if all parameters exists
    debug('check parameters');

    if(!data.hasOwnProperty('username')) throw new Error('Missing username', 1301);

  }).then(function() {

    //check if user is logged in
    debug('check login state');

    if(!socket.user_id) throw new Error('Not logged in', 1302);

  }).then(function() {

    //search for username in database
    debug('search user');

    return database.query(
      'select id, avatar, username, public_key from users where username like ? and banned = false limit 15',
      ['%' + data.username + '%']
    );

  }).then(function(rows) {

    //respond with found users
    debug('send found users');

    socket.emit('searchResult', rows);

  });
}
