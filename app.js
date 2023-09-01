var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Mongodb Connection
const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/express_menu";
mongoose.connect(uri).then(() => console.log("Database Connected!"));

var indexRouter = require('./routes/index');
var seederRouter = require('./routes/seeder');
var usersRouter = require('./routes/users');
var menusRouter = require('./routes/menus');
var axiosRouter = require('./routes/axios');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/seeders', seederRouter);
app.use('/users', usersRouter);
app.use('/menus', menusRouter);
app.use('/axios', axiosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
