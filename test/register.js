var chai = require('chai');
var fs = require('fs');
var assert = chai.assert;
var database = require('../database');
var register = require('../handlers/register');
var NodeRSA = require('node-rsa');

describe('Cleanup:', function() {
  it('Should connect to the database', function(done) {
    database.connect().then(function() {
      return database.query(
        'delete from users'
      );
    }).then(function() {
      done();
    }).catch(function(err) {
      assert.ok(false, err.message);
    });
  });
});

describe('Registration:', function() {

  it('should allow 0815 user', function() {
    return test_registration('mike', '0000', 1024, function(event, data) {
      if(event == 'registerSuccess') {
        assert.property(data, 'id');
      } else {
        assert.ok(false, 'Unknown event');
      }
    }).catch(function(err) {
      assert.ok(false, err.message);
    });
  });

  it('should not allow 512 bit keys', function() {
    return test_registration('peter', '0000', 512)
      .then(function() {
        assert.ok(false, 'Should not complete');
      })
      .catch(function(err) {
        assert.isNotNull(err, 'No error for 512 bit key');
        assert.equal(err.message, 'KEY_TOOSMALL');
      });
  });

  it('should allow 1024 bit keys', function() {
    return test_registration('elena', '0000', 1024)
      .catch(function(err) {
        assert.ok(false, err.message);
      });
  });

  it('should allow 2048 bit keys', function() {
    return test_registration('john', '0000', 2048)
      .catch(function(err) {
        assert.ok(false, err.message);
      });
  });

  it('should allow 4096 bit keys', function() {
    return test_registration('martina', '0000', 4096)
      .catch(function(err) {
        assert.ok(false, err.message);
      });
  });

  it('should not allow 8192 bit keys', function() {
    return test_registration('lisa', '0000', 8192)
      .then(function() {
        assert.ok(false, 'Should not complete');
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
    emit: function(event, data) {
      if(emit != null)
        emit(event, data);
    }
  };

  //use pre-generated keys to speed up tests
  var key = new NodeRSA(fs.readFileSync('test/key/' + key_size + '.pem'));
  
  var data = {
    username: username,
    avatar: avatar,
    public_key: key.exportKey('pkcs8-public-der')
  };

  return register(nsMock, socketMock, data);
}
