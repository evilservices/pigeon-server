var chai = require('chai');
var assert = chai.assert;
var database = require('../database');
var register = require('../handlers/register');
var NodeRSA = require('node-rsa');

describe('Connect:', function() {
  it('Should connect to the database', function(done) {
    database.connect().then(function() {
      return database.query(
        'delete from users'
      );
    }).then(function() {
      return done();
    }).catch(function(err) {
      throw err;
    });
  })
});

describe('Registration:', function() {

  it('should allow 0815 user', function(done) {
    test_registration('mike', '0000', 1024, function(event, data) {
      if(event == 'registerSuccess') {
        assert.property(data, 'id');
      } else {
        assert.fail('Unknown event');
      }

      done();
    }).catch(function(err) {
      throw err;
    });
  });

  it('should not allow 512 bit keys', function() {
    return test_registration('peter', '0000', 512)
      .then(function() {
        assert.fail('Should not complete');
      })
      .catch(function(err) {
        assert.isNotNull(err, 'No error for 512 bit key');
        assert.equal(err.message, 'KEY_TOOSMALL');
      });
  });

  it('should not allow 8192 bit keys', function() {
    return test_registration('lisa', '0000', 8192)
      .then(function() {
        assert.fail('Should not complete');
      })
      .catch(function(err) {
        assert.isNotNull(err, 'No error for 8192 bit key');
        assert.equal(err.message, 'KEY_TOOLARGE');
      });
  });

});

function test_registration(username, avatar, key_size, emit) {
  var nsMock = { };
  var socketMock = {
    emit: emit
  };

  var key = new NodeRSA({b: key_size});
  var data = {
    username: username,
    avatar: avatar,
    public_key: key.exportKey('pkcs8-public-der')
  };

  return register(nsMock, socketMock, data);
}
