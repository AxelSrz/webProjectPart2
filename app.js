var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var quizzes = require('./routes/quizzes');

var session = require('express-session');

var app = express();

var db = require('./model/db');
var quiz = require('./model/quizzes');

var connection  = require('express-myconnection');
var mysql = require('mysql');

app.use(

    connection(mysql,{

        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'questions_db'

    },'pool') //or single

);

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'shhhhhhhhhhh',
                 resave: false,
                 saveUninitialized: true,
                 cookie: { secure: true }}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index);
app.get('/quizzes', quizzes.list);
app.get('/quizzes/add', quizzes.add);
app.post('/quizzes/add', quizzes.save);
app.get('/quizzes/delete/:id', quizzes.delete_quizz);
app.get('/quizzes/edit/:id', quizzes.edit);
app.post('/quizzes/edit/:id',quizzes.save_edit);
app.get('/quizzes/:id', quizzes.show);

var server = app.listen(3001, function() {
    console.log(new Date().toISOString() + ": server started on port 3001");
});

module.exports = app;
