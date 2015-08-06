var Promise = require("bluebird");
var mysql = require('mysql');
var config = require('config');

var db = mysql.createConnection({
    host: config.get('db.host'),
    user: config.get('db.user'),
    password: config.get('db.password'),
    database: config.get('db.name')
});

module.exports = {
    connect: function (callback) {
        var defer = Promise.defer();

        db.connect(function(err) {
          if(err) {
              return defer.reject(err);
          }

          return defer.resolve();
        });

        return defer.promise;
    },
    query: function (query, params) {
        var defer = Promise.defer();
        params = params || {};

        db.query(query, params, function(err, rows, fields) {
            if(err) {
                return defer.reject(err);
            }

            return defer.resolve(rows, fields);
        });

        return defer.promise;
    }
};
