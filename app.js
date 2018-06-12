const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const chalk = require('chalk');
// const debug = require('debug');
// const morgan = require('morgan');
const firebase = require('firebase');
// const firebaseui = require('firebaseui');
//const index = require('./routes/index');
//const users = require('./routes/users');
const loginRouter = require('./routes/loginRouter');
const registerRouter = require('./routes/registerRouter');
const verifyRouter = require('./routes/verifyRouter');
const homeRouter = require('./routes/homeRouter');
const indexRouter = require('./routes/indexRouter');
const admin = require('firebase-admin');
// const firebaseui = require('firebaseui');
const app = express();
//otpcode = null;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist'))
);
app.use(
  '/stylesheets',
  express.static(path.join(__dirname, 'node_modules/jquery/dist'))
);

const serviceAccount = require("./routes/muffito-88994-firebase-adminsdk-dilha-b663634c31.json");

const adminConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://muffito-88994.firebaseio.com"
};
admin_app = admin.initializeApp(adminConfig,'admin');

const config = {
  apiKey: 'AIzaSyBRIt05f_gxZGvC0HTPpjxGh0hsglgl2I4',
  authDomain: 'muffito-88994.firebaseapp.com',
  databaseURL: 'https://muffito-88994.firebaseio.com',
  projectId: 'muffito-88994',
  storageBucket: 'muffito-88994.appspot.com',
  messagingSenderId: '1072542373026'
};

firebase.initializeApp(config);
const database = firebase.database();


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use('/', indexRouter);
//app.use('/users', users);
app.use('/register', registerRouter);
app.use('/login',loginRouter);
app.use('/verify',verifyRouter);
app.use('/home',homeRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next){
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
