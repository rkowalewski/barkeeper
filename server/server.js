'use strict';

var express = require('express')
    , path = require('path')
    , utils = require('./utils')
    , jsUtils = require('util')
    ;

var app = express();

app.set('port', process.env.PORT || 9000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '..', 'app')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/api/*', function (req, res, next) {
    res.contentType('application/json');
    next();
});

app.get('/api/users', function (req, res) {
    var query = 'select a.user, sum(a.amount) as sum' +
        ' from 10basket a' +
        ' inner join 10item b' +
        ' on a.item = b.id' +
        ' group by a.user';

    utils.executeQuery(query, function (json) {
        res.send(json);
    });
});

app.get('/api/users/:user/items', function (req, res) {
    var user = req.params.user
    var year = req.query.year;

    var basicSql = 'select b.name, b.description, count(*) as score' +
        ' from 10basket a' +
        ' inner join 10item b' +
        ' on a.item = b.id' +
        ' where a.user = %s';

    var query, sql;

    if (year) {
        var unixDatePeriod = utils.unixDatePeriod(year);

        sql = basicSql +
            ' and (a.created between %d and %d)' +
            ' group by (a.item);'

        query = jsUtils.format(sql, user, unixDatePeriod.start, unixDatePeriod.end);
    } else {
        sql = basicSql +
            ' group by (a.item);'

        query = jsUtils.format(sql, user);
    }

    utils.executeQuery(query, function (json) {
        res.send(json);
    });
});

app.get('/api/users/:user/costs', function (req, res) {
    var user = req.params.user;
    var year = req.query.year;

    var sql = 'select a.amount, a.created as date' +
        ' from 10basket a inner join 10item b' +
        ' on a.item = b.id' +
        ' where a.user = %s';

    var query;

    if (year) {
        var unixDatePeriod = utils.unixDatePeriod(year);

        sql = sql +
            ' and (a.created between %d and %d)';

        var query = jsUtils.format(sql, user, unixDatePeriod.start, unixDatePeriod.end);
    } else {
        query = jsUtils.format(sql, user);
    }

    utils.executeQuery(query, function (json) {
        res.send(json);
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
