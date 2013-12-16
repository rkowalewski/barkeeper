'use strict';

var mysql = require('mysql');

var dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'barkeeper'
};

exports.executeQuery = function (query, fn) {
    var connection = mysql.createConnection(dbConfig);
    connection.connect();

    var json = '';

    connection.query(query, function (err, results, fields) {
        var json = '';
        if (err) {
            if (err.message) {
                json = {error: err.message}
            } else {
                json = {error: JSON.stringify(err)}
            }
        } else {
            json = results;
        }

        connection.end();

        fn(json);
    });
};


exports.unixDatePeriod = function (year) {
    var start = new Date(year, 0),
        end = new Date(year, 11, 23, 59),
        startUnix = Math.round(start / 1000),
        endUnix = Math.round(end / 1000);

    return {
        start: startUnix,
        end: endUnix
    };
};