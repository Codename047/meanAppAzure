var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport =  require('passport')
var session = require('express-session');
var mongoose  = require('mongoose');

if(process.env.DEV_ENV){
mongoose.connect("mongodb://localhost:27017/chirp-test");
}
else{
mongoose.connect("mongodb://FirstApp:3_IZK55fkUOvskgajRGp3.BAWied.9d39pF_1l2qRws-@ds040898.mongolab.com:40898/FirstApp")  
}



var app = express();


app.listen(3000,function(){
  console.log("Listening");
});




// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
  secret: 'keyboard cat'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

require('./models/model.js');
var api = require('./routes/api');
var authenticate  =  require('./routes/authenticate')(passport);
var index = require('./routes/index');

var initPassport = require('./passport-init')
initPassport(passport);
app.use('/api',api);
app.use('/authenticate',authenticate);
app.use('/',index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
