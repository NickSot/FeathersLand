var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressLayout = require("express-ejs-layouts");
var db = require("./config/database");
var flash = require('express-flash');
var session = require('express-session');

// ROUTE VARS
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectsRouter = require('./routes/projects');
var writeRouter = require('./routes/write');
var profileRouter = require('./routes/profile');
var bookRouter = require('./routes/book');
var catalogRouter = require('./routes/catalog');
var logoutRouter = require('./routes/logout');
var authorsRouter = require('./routes/authors');
var authorRouter = require('./routes/author');
var verifyRouter = require('./routes/verify');
var chaptersRouter = require('./routes/chapter');
var bookFormRouter = require('./routes/bookform');
var chapterFormRouter = require('./routes/chapterform');
//ROUTE VARS

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
app.use(cookieParser("Why should it be so hard???"));

//ROUTES
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/write', writeRouter);
app.use('/profile', profileRouter);
app.use('/book', bookRouter);
app.use('/catalog', catalogRouter);
app.use('/logout', logoutRouter);
app.use('/authors', authorsRouter);
app.use('/author', authorRouter);
app.use('/verify', verifyRouter);
app.use('/chapter', chaptersRouter);
app.use('/newbook', bookFormRouter);
app.use('/newchapter', chapterFormRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.authenticated = req.session.authenticated;
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
