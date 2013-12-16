var express = require('express')
    , http = require('http')
    , path = require('path')
    , utils = require('./utils');

var app = express();

app.set('port', process.env.PORT || 9000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '..', 'app')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/basket', function (req, res) {
    utils.executeQuery('SELECT count(id) from 10basket', res);
});

app.get('/error', function (req, res) {
    utils.executeQuery('SELECT count(id) from error', res);
});


app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
