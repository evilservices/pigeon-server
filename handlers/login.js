var Promise = require("bluebird");
var validator = require('validator');
var debug = require('debug')('login');
var random = require("randomstring");

module.exports = function(ns, socket, data) {
  return Promise.resolve().then(function() {

		// check if all parameters exists
    // - username : string : username of the user who wants to log in (4-20 chars)
		debug('check parameters');

		if(!data.hasOwnProperty('username')) throw new Error('USERNAME_MISSING');

		if(!validator.isLength(data.username, 4, 20)) throw new Error('USERNAME_LENGTH');
		if(!/^[0-9A-Za-z_]+$/.test(data.username)) throw new Error('USERNAME_INVALID');

	}).then(function () {

		// generate new random login token
    // which must be signed with the
    // private key to complete the log in

		socket.username = data.username;
		socket.login_token = random.generate(32);

		socket.emit('loginToken', {
			'login_token': socket.login_token
		});

	});

};
