var mysql = require('mysql');

var dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'barkeeper'
};

exports.executeQuery = function (query, res) {
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
            json = JSON.stringify(results);
        }

        connection.end();

        res.send(json);
    });
};