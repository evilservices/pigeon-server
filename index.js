var socket = require('socket.io');

var register = require('./handlers/register');
var login = require('./handlers/login');

var io = socket(process.env.PORT || 3000);

io.on('connection', function(socket) {
  handler(io, socket, 'register', register);
  handler(io, socket, 'login', login);
});

function handler(io, socket, event, promise) {
  socket.on('register', function(data) {
    promise(io, socket, data).catch(function(err) {
      console.log(err);
    });
  });
}
