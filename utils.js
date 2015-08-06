var config = require('config');

var utils = {};

utils.getSocket = function(ns, user_id) {

    for(var id in ns.connected) {
      if(ns.connected[id].user_id == user_id) {
        return ns.connected[id];
      }
    }

    return null;
};

module.exports = utils;
