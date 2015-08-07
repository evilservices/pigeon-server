var chai = require('chai');
var assert = chai.assert;
var database = require('../database');
var login = require('../handlers/login');

describe('Login:', function() {

  it('should get a login token', function() {
    var socketMock = {
      emit: function(event, data) {
        assert.equal(event, 'loginToken');
        assert.property(data, 'login_token');
      }
    };

    return test_login('jessica', socketMock).then(function() {
      assert.property(socketMock, 'username');
      assert.property(socketMock, 'login_token');
    });

  });

  it('should get a login token', function() {
    var socketMock = {};

    return test_login('reallylonglonglonglonglonglongname', socketMock).then(function() {
      assert.property(socketMock, 'username');
      assert.property(socketMock, 'login_token');
    });

  });

});


function test_login(username, socketMock) {
  var nsMock = { };

  var data = {
    username: username
  };

  return login(nsMock, socketMock, data);
}
