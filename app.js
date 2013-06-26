
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , monitors = require('./routes/monitors')
  , response_time = require('./routes/response_time')
  , up_time = require('./routes/up_time')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.options('/', routes.monitors);
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/monitors', monitors.monitors);
app.get('/response_time', response_time.response_time);
app.get('/up_time', up_time.up_time);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
