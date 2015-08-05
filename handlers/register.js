var Promise = require("bluebird");

module.exports = function() {
  return Promise.resolve().then(function() {

		throw new Error('Check error');

	});
}
