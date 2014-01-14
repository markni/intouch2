
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
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

//TODO: this breaks in windows phone 8 somehow, need find a FIX

//app.use(express.csrf({value: csrfValue}));
//app.use(function(req, res, next) {
//    res.cookie('XSRF-TOKEN', req.csrfToken());
//    next();
//});

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

//catch all other requests and send index html to feed angularjs.

app.use(function(req, res) {
	// Use res.sendfile, as it streams instead of reading the file into memory.
	res.sendfile(__dirname + '/public/index.html');
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



//TODO: change these to post in production
app.all('/api/login',api.login);
app.all('/api/user/:username',api.user);
app.all('/api/progress',api.progress);

app.all('/api/user',api.user);
app.all('/api/demo',api.demo);

app.all('/api/collection/subject/:id',api.getCollectionSubject);
app.all('/api/collection',api.getCollection);
app.all('/api/schedule',api.schedule);

app.all('/api/subject/:id/watchedto/:epnum',api.updateTo);
app.all('/api/subject/:id/eps/:cmd',api.updateEps);
app.all('/api/subjects/update_status/:status',api.updateStatus);


app.all('/api/search/:q',api.search);
app.all('/api/user/:username/stats',stats.index);


app.all('/api/subject/:id',api.subject);




app.get('/cat',function(req,res){
    res.redirect('http://k.netaba.re/cat');

});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
