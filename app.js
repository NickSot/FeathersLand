var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser')
var expressLayout = require("express-ejs-layouts");
var db = require("./config/database");
var flash = require('express-flash');
var session = require('express-session');

// route vars
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectsRouter = require('./routes/projects');
var writeRouter = require('./routes/write');
var profileRouter = require('./routes/profile');
var bookRouter = require('./routes/books');
var logoutRouter = require('./routes/logout');
var authorsRouter = require('./routes/authors');

var app = express();

//VIEW ENGINE
app.use(expressLayout);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser(''));
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'Writer, my friend',
  resave: true,
  saveUninitialized: false
}));

app.use(flash());

//ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/write', writeRouter);
app.use('/profile', profileRouter);
app.use('/books', bookRouter);
app.use('/logout', logoutRouter);
app.use('/authors', authorsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
