
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var api = require('./routes/api');
var stats = require('./routes/stats');
var http = require('http');
var path = require('path');

var app = express();

//var csrfValue = function(req) {
//    var token = (req.body && req.body._csrf)
//        || (req.query && req.query._csrf)
//        || (req.headers['x-csrf-token'])
//        || (req.headers['x-xsrf-token']);
//    return token;
//};

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
//app.use(express.csrf({value: csrfValue}));
//app.use(function(req, res, next) {
//    res.cookie('XSRF-TOKEN', req.csrfToken());
//    next();
//});
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/temp/login', user.login);
app.get('/temp/logout', user.logout);
app.get('/temp/home', user.home);
app.get('/temp/settings', user.settings);
app.get('/temp/search', user.search);
app.get('/temp/schedule', user.schedule);
app.get('/temp/profile', user.profile);
app.get('/temp/subject', user.subject);

//reusable parts

app.get('/temp/bottom-menu', user.bottomMenu);
app.get('/temp/side-menu', user.sideMenu);
app.get('/temp/search-bar', user.searchBar);
app.get('/temp/404', user.fourofour);

//TODO: change these to post in production
app.all('/api/login',api.login);
app.all('/api/user/:username',api.user);
app.all('/api/user',api.user);
app.all('/api/demo',api.demo);

app.all('/api/collection/subject/:id',api.getCollectionSubject);
app.all('/api/collection',api.getCollection);
app.all('/api/schedule',api.schedule);

app.all('/api/subject/:id/watchedto/:epnum',api.updateTo);
app.all('/api/subjects/update_status/:status',api.updateStatus);


app.all('/api/search/:q',api.search);
app.all('/api/user/:username/stats',stats.index);


app.all('/api/subject/:id',api.subject);

app.get('/login', routes.index);
app.get('/logout',routes.index);
app.get('/settings',routes.index);

app.get('/cat',function(req,res){
    res.redirect('http://k.netaba.re/cat');

});

app.get('*',routes.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
