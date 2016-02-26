var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');//!!!!!!!
var passport = require('passport');
// 그냥인증 -> passport 인증... + passport 세션 + init!?

global.pool = require('./config/dbpool');//.=서버??? 아 그러네 app.js 는 밖이네
//패스포트 세팅 제거
//require('./config/passportconfig')(passport); //??????  로딩 한 것이 함수...
//캐싱??? = var 로 받은거...                   // passport 준거...


var app = express();


var main = require('./routes/index');
var products = require('./routes/products')

// view engine setup  //살리고
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  // process.env.SERVER_KEY 환경변수 로 설정 ㄱㄱ (서버 메모리상 존재)
  "secret" : process.env.FMS_DB_SESSION_KEY,  // 서버가 만들어줌??
  "cookie": { "maxAge": 86400000 }, //하루;;; 60*60*24*1000[ms]
  "resave": true,
  "saveUninitialized":true,
}));
app.use(passport.initialize());//passport 쓸 수 있도록 초기화...
app.use(passport.session()); //passport의 세션을 사용하도록 만듬...
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', main);
app.use('/products', products);

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
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;