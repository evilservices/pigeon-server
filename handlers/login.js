var Promise = require("bluebird");
var validator = require('validator');
var debug = require('debug')('login');
var random = require("randomstring");

module.exports = function(ns, socket, data) {
  return Promise.resolve().then(function() {

		//check if all parameters exists
		debug('check parameters');

		if(!data.hasOwnProperty('username')) throw new Error('Missing username', 1101);

		if(!validator.isLength(data.username, 4, 20)) throw new Error('Invalid username length', 1110);
		if(!/^[0-9A-Za-z_]+$/.test(data.username)) throw new Error('Invalid characters in username', 1111);


	}).then(function () {

		//generate new random login token
		socket.username = data.username;
		socket.login_token = random.generate(32);

		socket.emit('loginToken', {
			'login_token': socket.login_token
		});

	});

};
