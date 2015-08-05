var socket = require('socket.io');
var debug = require('debug')('server');

var database = require('./database');

var register = require('./handlers/register');
var login = require('./handlers/login');
var verify = require('./handlers/verify');

var io = socket(process.env.PORT || 3000);

io.on('connection', function(socket) {
  handler(io, socket, 'register', 'registerError', register);
  handler(io, socket, 'login', 'loginError', login);
  handler(io, socket, 'verify', 'verifyError', verify);
});

database.connect(function (err) {
  if(err) debug(err.message);
});

function handler(io, socket, event, error_event, promise) {
  socket.on(event, function(data) {
    debug(event);

    promise(io, socket, data).catch(function(err) {
      debug(err.message);

      socket.emit(error_event, err.id || 100);
    });
  });
}