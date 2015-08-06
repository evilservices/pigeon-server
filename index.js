var socket = require('socket.io');
var config = require('config');
var debug = require('debug')('server');

var errors = require('./errors');
var database = require('./database');

var register = require('./handlers/register');
var login = require('./handlers/login');
var verify = require('./handlers/verify');

var io = socket(process.env.PORT || 3000);
var ns = io.of(config.get('namespace'));

ns.on('connection', function(socket) {
  handler(io, socket, 'register', 'registerError', register);
  handler(io, socket, 'login', 'loginError', login);
  handler(io, socket, 'verify', 'verifyError', verify);
});

database.connect().catch(function (err) {
  debug(err.message);
});

function handler(ns, socket, event, error_event, promise) {
  socket.on(event, function(data) {
    debug(event);

    promise(ns, socket, data).catch(function(err) {
      debug(err.message);

      socket.emit(error_event, {
        'code': err.errno || err.message,
        'message': errors[err.message]
      });
    });
  });
}
