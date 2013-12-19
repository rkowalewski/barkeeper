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

app.get('/api/*', function(req, res, next) {
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

    var sql = 'select b.name, b.description, count(*) as score' +
        ' from 10basket a' +
        ' inner join 10item b' +
        ' on a.item = b.id' +
        ' where a.user = %s group by (a.item);'

    utils.executeQuery(jsUtils.format(sql, user), function (json) {
        res.send(json);
    });
});

app.get('/api/users/:user/items/:year', function (req, res) {
    var user = req.params.user,
        year = req.params.year;

    var unixDatePeriod = utils.unixDatePeriod(year);

    var sql = 'select b.name, b.description, count(*) as anzahl' +
        ' from 10basket a' +
        ' inner join 10item b' +
        ' on a.item = b.id' +
        ' where a.user = %s' +
        ' and (a.created between %d and %d)' +
        ' group by (a.item);'

    var query = jsUtils.format(sql, user, unixDatePeriod.start, unixDatePeriod.end);

    utils.executeQuery(query, function (json) {
        if (json.error) {
            res.send(json);
        } else {
            json = {
                year: year,
                items: json
            }

            res.send(json);
        }
    });
});

app.get('/api/users/:user/costs', function (req, res) {
    var user = req.params.user;

    var sql = 'select a.amount, a.created as date' +
        ' from 10basket a inner join 10item b' +
        ' on a.item = b.id' +
        ' where a.user = %s' +
        ' order by a.created';

    utils.executeQuery(jsUtils.format(sql, user), function(json) {
        res.send(json);
    });
});

app.get('/api/users/:user/costs/:year', function (req, res) {
    var user = req.params.user,
        year = req.params.year;

    var unixDatePeriod = utils.unixDatePeriod(year);

    var sql = 'select a.amount, a.created as date' +
        ' from 10basket a inner join 10item b' +
        ' on a.item = b.id' +
        ' where a.user = %s' +
        ' and (a.created between %d and %d)'+
        ' order by a.created';

    var query = jsUtils.format(sql, user, unixDatePeriod.start, unixDatePeriod.end);

    utils.executeQuery(query, function(json) {
        res.send(json);
    });
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
