
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var api = require('./routes/api');
var http = require('http');
var path = require('path');

var app = express();

var csrfValue = function(req) {
    var token = (req.body && req.body._csrf)
        || (req.query && req.query._csrf)
        || (req.headers['x-csrf-token'])
        || (req.headers['x-xsrf-token']);
    return token;
};

// all environments
app.set('port', process.env.PORT || 8004);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('nyancat'));
app.use(express.session());
app.use(express.csrf({value: csrfValue}));
app.use(function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.session._csrf);
    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/temp/login', user.login);
app.get('/temp/home', user.home);

//TODO: change these to post in production
app.all('/api/login',api.login);
app.all('/api/user',api.user);
app.all('/api/demo',api.demo);
app.all('/api/collection',api.getCollection);
app.all('/api/subject/:id/watchedto/:epnum',api.updateTo);

app.get('/login', routes.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
